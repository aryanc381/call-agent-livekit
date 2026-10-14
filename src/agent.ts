import {
  cli,
  defineAgent,
  ServerOptions,
  type JobContext,
  voice,
} from "@livekit/agents";
import { fileURLToPath } from "node:url";

import { config } from "./config.js";
import { createCartesiaTTS } from "./providers/cartesia-tts.js";
import { createCloudflareLLM } from "./providers/cloudflare-llm.js";
import { CloudflareSTT } from "./providers/cloudflare-stt.js";

const instructions = `You are a concise, friendly voice assistant.
Speak naturally and keep every answer short enough to say aloud.
Never use markdown, emojis, bullets, or long explanations.`;

export default defineAgent({
  entry: async (ctx: JobContext) => {
    const session = new voice.AgentSession({
      stt: new CloudflareSTT({
        ...config.cloudflare.stt,
        accountId: config.cloudflare.accountId,
        apiToken: config.cloudflare.apiToken,
        aiGatewayId: config.cloudflare.aiGatewayId,
      }),
      llm: createCloudflareLLM({
        ...config.cloudflare.llm,
        accountId: config.cloudflare.accountId,
        apiToken: config.cloudflare.apiToken,
        aiGatewayId: config.cloudflare.aiGatewayId,
      }),
      tts: createCartesiaTTS(config.cartesia),
      turnHandling: {
        turnDetection: "vad",
        preemptiveGeneration: { enabled: false },
      },
      transcriptionTimeout: 5000,
    });

    session.on(voice.AgentSessionEventTypes.UserTranscriptionTimeout, () => {
      session.generateReply({
        instructions:
          "Tell the user you did not catch that and ask them to repeat it.",
      });
    });

    session.on(voice.AgentSessionEventTypes.Error, (event) => {
      console.error("[agent] session error", event.error);
    });

    await ctx.connect();

    await session.start({
      agent: voice.Agent.create({ instructions }),
      room: ctx.room,
    });

    await session.generateReply({
      instructions: "Greet the user warmly and ask how you can help.",
    });
  },
});

cli.runApp(
  new ServerOptions({
    agent: fileURLToPath(import.meta.url),
    agentName: "call-agent-livekit",
  }),
);
