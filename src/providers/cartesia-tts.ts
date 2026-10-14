import * as cartesia from "@livekit/agents-plugin-cartesia";

type CartesiaTTSOptions = {
  apiKey: string;
  model: string;
  voiceId: string;
};

export const createCartesiaTTS = (options: CartesiaTTSOptions) =>
  new cartesia.TTS({
    apiKey: options.apiKey,
    model: options.model,
    voice: options.voiceId,
  });
