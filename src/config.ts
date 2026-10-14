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
    llm: {
      baseURL: required("CLOUDFLARE_LLM_BASE_URL"),
      apiKey: required("CLOUDFLARE_LLM_API_KEY"),
      model: required("CLOUDFLARE_LLM_MODEL"),
    },
    stt: {
      url: required("CLOUDFLARE_STT_URL"),
      apiKey: required("CLOUDFLARE_STT_API_KEY"),
      model: required("CLOUDFLARE_STT_MODEL"),
    },
  },
  cartesia: {
    apiKey: required("CARTESIA_API_KEY"),
    model: required("CARTESIA_MODEL"),
    voiceId: required("CARTESIA_VOICE_ID"),
  },
};
