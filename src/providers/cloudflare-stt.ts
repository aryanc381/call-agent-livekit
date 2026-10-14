import { normalizeLanguage, stt, type AudioBuffer } from "@livekit/agents";
import type { APIConnectOptions } from "@livekit/agents";
import { combineAudioFrames, type AudioFrame } from "@livekit/rtc-node";

type CloudflareSTTOptions = {
  accountId: string;
  apiToken: string;
  aiGatewayId: string;
  model: string;
  language?: string;
};

type CloudflareSTTResponse = {
  text?: unknown;
  result?: { text?: unknown; result?: { text?: unknown } };
};

export class CloudflareSTT extends stt.STT {
  label = "cloudflare.STT";

  constructor(private readonly options: CloudflareSTTOptions) {
    super({ streaming: false, interimResults: false });
  }

  protected async _recognize(
    frame: AudioBuffer,
    abortSignal?: AbortSignal,
  ): Promise<stt.SpeechEvent> {
    const audio = combineAudioFrames(frame);
    const body = {
      model: this.options.model,
      input: {
        file: `data:audio/wav;base64,${toWav(audio).toString("base64")}`,
      },
    };

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${this.options.accountId}/ai/run`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.options.apiToken}`,
          "cf-aig-gateway-id": this.options.aiGatewayId,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: abortSignal,
      },
    );

    if (!response.ok) {
      throw new Error(`Cloudflare STT failed with HTTP ${response.status}`);
    }

    const payload = (await response.json()) as CloudflareSTTResponse;
    console.log("[cloudflare-stt] response", JSON.stringify(payload));
    const text = getText(payload);
    if (!text) throw new Error("Cloudflare STT returned an empty transcript");

    return {
      type: stt.SpeechEventType.FINAL_TRANSCRIPT,
      alternatives: [
        {
          language: normalizeLanguage(this.options.language ?? "en"),
          text,
          startTime: 0,
          endTime: audio.samplesPerChannel / audio.sampleRate,
          confidence: 1,
        },
      ],
    };
  }

  stream(_options?: { connOptions?: APIConnectOptions }): stt.SpeechStream {
    throw new Error(
      "Cloudflare STT is batch-only; LiveKit wraps it with VAD automatically.",
    );
  }
}

const getText = (payload: CloudflareSTTResponse) => {
  const nested =
    payload.result?.result?.text ?? payload.result?.text ?? payload.text;
  return typeof nested === "string" ? nested.trim() : "";
};

const toWav = (frame: AudioFrame) => {
  const data = Buffer.from(
    frame.data.buffer,
    frame.data.byteOffset,
    frame.data.byteLength,
  );
  const header = Buffer.alloc(44);
  const byteRate = frame.sampleRate * frame.channels * 2;
  const blockAlign = frame.channels * 2;

  header.write("RIFF", 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(frame.channels, 22);
  header.writeUInt32LE(frame.sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(data.length, 40);

  return Buffer.concat([header, data]);
};
