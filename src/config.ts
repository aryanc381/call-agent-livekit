import "dotenv/config";

const required = (name: string) => {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
};

export const config = {
  livekit: {
    url: required("LIVEKIT_URL"),
    apiKey: required("LIVEKIT_API_KEY"),
    apiSecret: required("LIVEKIT_API_SECRET"),
  },
  cloudflare: {
    accountId: required("CLOUDFLARE_ACCOUNT_ID"),
    apiToken: required("CLOUDFLARE_API_TOKEN"),
    aiGatewayId: required("CLOUDFLARE_AI_GATEWAY_ID"),
    llm: {
      model: required("CLOUDFLARE_AI_MODEL"),
    },
    stt: {
      model: required("CLOUDFLARE_STT_MODEL"),
    },
  },
  cartesia: {
    apiKey: required("CARTESIA_API_KEY"),
    model: required("CARTESIA_MODEL_ID"),
    voiceId: required("CARTESIA_VOICE_ID"),
  },
};
