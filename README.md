# RetroWave Radio Assistant

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/kleros109/papunky2)

An AI-powered music research assistant that generates radio show commentary with a stunning, nostalgic retro-themed UI.

RetroWave Radio Assistant is a specialized, AI-powered tool for radio hosts and music enthusiasts. Built on Cloudflare's serverless platform, it transforms simple track inputs ('Song Title' — Artist) into detailed, broadcast-ready commentary. The application features three distinct output modes: a concise 'Broadcast' mode for on-air use, an in-depth 'Prep' mode for show preparation, and a comprehensive 'Double' mode combining both. For each track, the assistant researches artist backgrounds, release details, and global/fusion significance. It automatically fetches and displays official album art via the Spotify oEmbed API, provides a direct Spotify link, and lists research sources. The entire user experience is wrapped in a stunning, nostalgic 'Retro' aesthetic, featuring CRT screen effects, neon glows, pixel art elements, and glitch animations, creating a visually unique and engaging tool that is both powerful and a joy to use.

## ✨ Key Features

*   **AI-Powered Research**: Automatically generates detailed commentary on artist background, release context, and musical significance.
*   **Three Output Modes**:
    *   **Broadcast Mode**: Concise, on-air ready bullet points.
    *   **Prep Mode**: In-depth paragraphs for show preparation.
    *   **Double Mode**: A comprehensive view with both formats.
*   **Spotify Integration**: Fetches album cover art and direct Spotify links for each track.
*   **Retro-Futuristic UI**: A stunning, nostalgic interface with CRT screen effects, neon glows, and pixel art elements.
*   **Serverless Architecture**: Built entirely on the Cloudflare stack for high performance and scalability.
*   **Responsive Design**: Flawless experience across all device sizes, from mobile to desktop.

## 🚀 Technology Stack

*   **Frontend**: React, Vite, Tailwind CSS, shadcn/ui, Framer Motion, Zustand
*   **Backend**: Cloudflare Workers, Cloudflare Agents, Hono
*   **Language**: TypeScript
*   **Package Manager**: Bun

## ⚙️ Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or later)
*   [Bun](https://bun.sh/) package manager
*   A Cloudflare account

### Installation

1.  **Clone the repository:**
    ```sh
    git clone <repository-url>
    cd retrowave_radio_assistant
    ```

2.  **Install dependencies:**
    ```sh
    bun install
    ```

3.  **Configure Environment Variables:**
    Create a `.dev.vars` file in the root directory for local development. You will need to get your Cloudflare Account ID and create an AI Gateway.

    ```ini
    # .dev.vars
    CF_AI_BASE_URL="https://gateway.ai.cloudflare.com/v1/YOUR_ACCOUNT_ID/YOUR_GATEWAY_ID/openai"
    CF_AI_API_KEY="YOUR_CLOUDFLARE_API_KEY"
    ```

    **Note**: The AI capabilities will not work out-of-the-box in the provided preview environment due to security constraints on API keys. To enable AI features, you must deploy the project to your own Cloudflare account.

## 💻 Development

To start the local development server, which includes both the Vite frontend and the Cloudflare Worker backend, run:

```sh
bun run dev
```

This will start the application, typically available at `http://localhost:3000`. The frontend will automatically reload on changes, and the worker will be updated as you edit the backend code in the `worker/` directory.

##  usage

1.  Open the application in your browser.
2.  Enter one or more tracks in the text area, using the format `'Song Title' — Artist`. Each track should be on a new line.
3.  Select your desired output mode: `Broadcast`, `Prep`, or `Double`.
4.  Click the "Generate" button.
5.  The results will appear below, complete with commentary, album art, and links.

## ☁️ Deployment

This project is designed for seamless deployment to Cloudflare Pages.

1.  **Login to Wrangler:**
    ```sh
    bunx wrangler login
    ```

2.  **Deploy the application:**
    ```sh
    bun run deploy
    ```
    This command will build the Vite application and deploy it along with the worker to your Cloudflare account.

3.  **Configure Production Secrets:**
    After deploying, you must add your production environment variables as secrets in the Cloudflare dashboard under **Workers & Pages > Your Project > Settings > Environment variables**.

    *   `CF_AI_BASE_URL`: Your Cloudflare AI Gateway URL.
    *   `CF_AI_API_KEY`: Your Cloudflare API Key.
    *   `SERPAPI_KEY`: Your SerpApi key for web search.

Alternatively, deploy directly from your GitHub repository:

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/kleros109/papunky2)

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.