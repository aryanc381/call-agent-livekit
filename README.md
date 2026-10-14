# call-agent-livekit

Minimal local LiveKit voice agent using Cloudflare STT, a Cloudflare OpenAI-compatible LLM endpoint, and Cartesia TTS.

## Local setup

Requirements: Node.js 20+, pnpm 10+, and a local LiveKit OSS server.

Start LiveKit locally in dev mode:

```sh
brew install livekit
livekit-server --dev
```

It uses `ws://127.0.0.1:7880`, `devkey`, and `secret` by default.

Install and configure the agent:

```sh
pnpm install
cp .env.example .env
pnpm dev
```

Set the Cloudflare and Cartesia values in `.env`. `CLOUDFLARE_LLM_BASE_URL` must point to the base URL of an OpenAI-compatible chat-completions endpoint. `CLOUDFLARE_STT_URL` must accept the Cloudflare `/ai/run`-style JSON body and return a transcript as `text` or `result.text`.

Use LiveKit Playground or another LiveKit client to join the local room and speak with the agent.
