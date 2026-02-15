import { apiClient } from "../api/client";
import { ENDPOINTS } from "../api/endpoints";
import type { Conversation, ConversationDetail } from "../types/chat";

/**
 * 会話一覧を取得する
 */
export async function getConversations(): Promise<Conversation[]> {
  return apiClient.get(ENDPOINTS.conversations.list).json<Conversation[]>();
}

/**
 * 会話の詳細（メッセージ付き）を取得する
 */
export async function getConversationDetail(
  id: string,
): Promise<ConversationDetail> {
  return apiClient
    .get(ENDPOINTS.conversations.detail(id))
    .json<ConversationDetail>();
}

/**
 * 会話を削除する
 */
export async function deleteConversation(id: string): Promise<void> {
  await apiClient.delete(ENDPOINTS.conversations.delete(id));
}
