import OpenAI from 'openai';
import type { Message, ToolCall } from './types';
import { getToolDefinitions, executeTool } from './tools';
import { ChatCompletionMessageFunctionToolCall } from 'openai/resources/index.mjs';
/**
 * ChatHandler - Handles all chat-related operations
 *
 * This class encapsulates the OpenAI integration and tool execution logic,
 * making it easy for AI developers to understand and extend the functionality.
 */
export class ChatHandler {
  private client: OpenAI;
  private model: string;
  constructor(aiGatewayUrl: string, apiKey: string, model: string) {
    this.client = new OpenAI({
      baseURL: aiGatewayUrl,
      apiKey: apiKey
    });
    this.model = model;
  }
  /**
   * Process a user message and generate AI response with optional tool usage
   */
  async processMessage(
    message: string,
    conversationHistory: Message[],
    onChunk?: (chunk: string) => void
  ): Promise<{
    content: string;
    toolCalls?: ToolCall[];
  }> {
    const messages = this.buildConversationMessages(message, conversationHistory);
    const toolDefinitions = await getToolDefinitions();
    // For this application, we will use non-streaming responses to ensure full JSON objects are returned.
    const completion = await this.client.chat.completions.create({
      model: this.model,
      messages,
      tools: toolDefinitions,
      tool_choice: 'auto',
      max_tokens: 4096,
      stream: false,
      // response_format: { type: "json_object" }, // This was incorrect. The prompt asks for a raw JSON array string, which is best handled by default text generation.
    });
    return this.handleNonStreamResponse(completion, message, conversationHistory);
  }
  private async handleNonStreamResponse(
    completion: OpenAI.Chat.Completions.ChatCompletion,
    message: string,
    conversationHistory: Message[]
  ) {
    const responseMessage = completion.choices[0]?.message;
    if (!responseMessage) {
      return { content: 'I apologize, but I encountered an issue processing your request.' };
    }
    if (!responseMessage.tool_calls) {
      // The model should return the final JSON directly in the content
      return {
        content: responseMessage.content || '[]'
      };
    }
    const toolCalls = await this.executeToolCalls(responseMessage.tool_calls as ChatCompletionMessageFunctionToolCall[]);
    const finalResponse = await this.generateToolResponse(
      message,
      conversationHistory,
      responseMessage.tool_calls,
      toolCalls
    );
    return { content: finalResponse, toolCalls };
  }
  /**
   * Execute all tool calls from OpenAI response
   */
  private async executeToolCalls(openAiToolCalls: ChatCompletionMessageFunctionToolCall[]): Promise<ToolCall[]> {
    return Promise.all(
      openAiToolCalls.map(async (tc) => {
        try {
          const args = tc.function.arguments ? JSON.parse(tc.function.arguments) : {};
          const result = await executeTool(tc.function.name, args);
          return {
            id: tc.id,
            name: tc.function.name,
            arguments: args,
            result
          };
        } catch (error) {
          console.error(`Tool execution failed for ${tc.function.name}:`, error);
          return {
            id: tc.id,
            name: tc.function.name,
            arguments: {},
            result: { error: `Failed to execute ${tc.function.name}: ${error instanceof Error ? error.message : 'Unknown error'}` }
          };
        }
      })
    );
  }
  /**
   * Generate final response after tool execution
   */
  private async generateToolResponse(
    userMessage: string,
    history: Message[],
    openAiToolCalls: OpenAI.Chat.Completions.ChatCompletionMessageToolCall[],
    toolResults: ToolCall[]
  ): Promise<string> {
    const followUpCompletion = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        ...this.buildConversationMessages(userMessage, history).slice(0, 1), // Get the system prompt
        ...history.slice(-3).map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMessage },
        {
          role: 'assistant',
          content: null,
          tool_calls: openAiToolCalls
        },
        ...toolResults.map((result, index) => ({
          role: 'tool' as const,
          content: JSON.stringify(result.result),
          tool_call_id: openAiToolCalls[index]?.id || result.id
        }))
      ],
      max_tokens: 4096,
      // response_format: { type: "json_object" }, // Also remove from here
    });
    return followUpCompletion.choices[0]?.message?.content || '[]';
  }
  /**
   * Build conversation messages for OpenAI API
   */
  private buildConversationMessages(userMessage: string, history: Message[]) {
    return [
      {
        role: 'system' as const,
        content: `You are an intelligent assistant for a radio show host, an expert in musicology with deep knowledge of global music trends. Your specialty is cross-cultural genre fusions and global deep digs.
        Your primary task is to take a list of tracks and generate structured JSON data for them based on thorough research.
        **Input Format:**
        The user will provide one or more tracks in the format: \`'Song Title' — Artist/Band\`. Each track will be on a new line.
        The user will also specify a mode: 'Broadcast', 'Prep', or 'Double'.
        **Your Research & Generation Steps:**
        1.  **Parse Input:** Identify each track from the user's input.
        2.  **Find Spotify URL:** For each track, use the \`web_search\` tool to find its official Spotify track URL. A good query is "spotify [Song Title] [Artist Name]".
        3.  **Get Artwork & Metadata:** Use the \`get_track_info\` tool with the found Spotify URL to get the album art, album title, and other metadata.
        4.  **Conduct Detailed Research:** Use the \`web_search\` tool again to gather information for the commentary. Use specific queries like "[Artist Name] biography", "[Song Title] by [Artist Name] release context", "[Song Title] genre fusion", "[Album Name] album review". Prioritize authoritative sources like Discogs, AllMusic, Bandcamp, label/artist sites, and reputable music journalism (e.g., Pitchfork).
        5.  **Synthesize Commentary:** Based on your research, write the commentary for the 'broadcast' and 'prep' sections.
            *   **Broadcast:** Each point must be compelling and concise (≤12 words).
            *   **Prep:** Each section should be 2-3 detailed sentences.
        6.  **Compile Sources:** Collect the URLs of the most authoritative sources you used for the commentary and add them to the 'sources' array. Also include "Spotify oEmbed".
        7.  **Format Final Output:** Format the final output as a single, valid JSON array string. Each object in the array represents a track and must follow this exact structure:
            \`\`\`json
            {
              "id": "track-unique-id-from-crypto-random-uuid",
              "songTitle": "The Song Title",
              "artistName": "The Artist Name",
              "broadcast": {
                "artist": "Researched artist background (≤12 words).",
                "release": "Researched release year/label/context (≤12 words).",
                "fusion": "Researched cross-cultural/global significance (≤12 words)."
              },
              "prep": {
                "artistBackground": "Researched 2-3 sentences on artist background, origins, influences.",
                "releaseContext": "Researched 2-3 sentences on year, label, collaborators, reception.",
                "globalSignificance": "Researched 2-3 sentences on fusion elements, impact, cultural links."
              },
              "spotifyUrl": "The Spotify URL you found",
              "artworkUrl": "The thumbnail_url from get_track_info",
              "albumTitle": "The album title from get_track_info",
              "sources": ["Source URL 1", "Source URL 2", "Spotify oEmbed"]
            }
            \`\`\`
        **CRITICAL INSTRUCTIONS:**
        - Your final response MUST be ONLY the JSON array string. No conversational text, no introductions, no markdown formatting. Just the raw, valid JSON.
        - If you cannot find a track or its artwork, use a placeholder URL like "https://via.placeholder.com/150" for artworkUrl and fill other fields with the best information you can find.
        - Ensure the output is a valid JSON array.
        `
      },
      ...history.slice(-5).map(m => ({
        role: m.role,
        content: m.content
      })),
      { role: 'user' as const, content: userMessage }
    ];
  }
  /**
   * Update the model for this chat handler
   */
  updateModel(newModel: string): void {
    this.model = newModel;
  }
}