import * as openai from "@livekit/agents-plugin-openai";

type CloudflareLLMOptions = {
  baseURL: string;
  apiKey: string;
  model: string;
};

export const createCloudflareLLM = (options: CloudflareLLMOptions) =>
  new openai.LLM({
    baseURL: options.baseURL,
    apiKey: options.apiKey,
    model: options.model,
    temperature: 0.4,
  });
