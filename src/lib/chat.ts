import type { ChatState } from '../../worker/types';
export interface ChatResponse {
  success: boolean;
  data?: ChatState;
  error?: string;
  content?: string;
}
class ChatService {
  private sessionId: string;
  private baseUrl: string;
  constructor() {
    this.sessionId = crypto.randomUUID();
    this.baseUrl = `/api/chat/${this.sessionId}`;
  }
  async sendMessage(
    message: string,
    onChunk?: (chunk: string) => void
  ): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, stream: !!onChunk }),
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      if (onChunk) {
        // This part is not used in the current app but kept for potential future use
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let fullResponse = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          fullResponse += chunk;
          onChunk(chunk);
        }
        return { success: true, content: fullResponse };
      }
      // Non-streaming response for this app
      const result = await response.json();
      return { success: true, content: result.data.messages[result.data.messages.length - 1].content };
    } catch (error) {
      console.error('Failed to send message:', error);
      return { success: false, error: 'Failed to send message' };
    }
  }
}
export const chatService = new ChatService();