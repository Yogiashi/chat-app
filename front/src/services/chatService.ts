import { apiClient } from "../api/client";
import { fetchStream } from "../api/client";
import { ENDPOINTS } from "../api/endpoints";
import type { ChatRequest, ChatResponse, Message } from "../types/chat";

/**
 * 通常のチャット（非ストリーミング）
 */
export async function sendMessage(
  messages: Message[],
  conversationId?: string,
): Promise<ChatResponse> {
  const request: ChatRequest = {
    messages,
    conversation_id: conversationId,
  };

  return apiClient
    .post(ENDPOINTS.chat.send, { json: request })
    .json<ChatResponse>();
}

/**
 * ストリーミングチャット
 *
 * レスポンスヘッダーから conversation_id を取得して返す。
 * ストリーミング中はJSONを返せないので、
 * バックエンドがヘッダーに conversation_id を入れている。
 */
export async function sendMessageStream(
  messages: Message[],
  onChunk: (chunk: string) => void,
  conversationId?: string,
): Promise<string> {
  const request: ChatRequest = {
    messages,
    conversation_id: conversationId,
  };

  const response = await fetchStream(ENDPOINTS.chat.stream, request);

  // レスポンスヘッダーから conversation_id を取得
  const newConversationId = response.headers.get("X-Conversation-Id") ?? "";

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

  return newConversationId;
}
