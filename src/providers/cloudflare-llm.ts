import * as openai from "@livekit/agents-plugin-openai";
import OpenAI from "openai";

type CloudflareLLMOptions = {
  accountId: string;
  apiToken: string;
  aiGatewayId: string;
  model: string;
};

export const createCloudflareLLM = (options: CloudflareLLMOptions) => {
  const client = new OpenAI({
    apiKey: options.apiToken,
    baseURL: `https://api.cloudflare.com/client/v4/accounts/${options.accountId}/ai/v1`,
    defaultHeaders: { "cf-aig-gateway-id": options.aiGatewayId },
  });

  return new openai.LLM({
    client,
    model: options.model,
    temperature: 0.4,
  });
};
