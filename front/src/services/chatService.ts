import { apiClient, fetchStream } from "../api/client";
import { ENDPOINTS } from "../api/endpoints";
import type { ChatRequest, ChatResponse, Message } from "../types/chat";

/**
 * 通常のチャットAPI
 */
export async function sendMessage(messages: Message[]): Promise<ChatResponse> {
  const request: ChatRequest = { messages };

  /**
   * ky の使い方：
   * apiClient.post(url, { json: data })
   *
   * fetch との比較：
   *   fetch: body: JSON.stringify(data) + headers指定 + response.json()
   *   ky:    json: data → 自動でJSON変換 + .json() で自動パース
   *
   * ただしここでは import を避けるため、
   * 通常リクエストも fetchStream と同じく fetch ベースで統一することも可能。
   * 今回は ky の使い方を学ぶために ky を使う。
   */

  return apiClient
    .post(ENDPOINTS.chat.send, { json: request })
    .json<ChatResponse>();
}

/**
 * ストリーミングチャットAPI
 */
export async function sendMessageStream(
  messages: Message[],
  onChunk: (chunk: string) => void,
): Promise<void> {
  const request: ChatRequest = { messages };

  const response = await fetchStream(ENDPOINTS.chat.stream, request);

  const reader = response.body
    ?.pipeThrough(new TextDecoderStream())
    .getReader();

  if (!reader) {
    throw new Error("Failed to get response reader");
  }

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      onChunk(value);
    }
  }
}
