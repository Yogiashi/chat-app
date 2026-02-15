import { useCallback, useEffect, useState } from "react";
import {
  deleteConversation,
  getConversationDetail,
  getConversations,
} from "../services/conversationService";
import type { Conversation, Message } from "../types/chat";

/**
 * 会話一覧の管理ロジック
 *
 * サイドバーで使う：一覧取得・選択・削除
 */
export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);

  /**
   * 会話一覧を取得する
   */
  const fetchConversations = useCallback(async () => {
    setIsLoadingList(true);
    try {
      const data = await getConversations();
      setConversations(data);
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    } finally {
      setIsLoadingList(false);
    }
  }, []);

  /**
   * 会話の詳細（メッセージ付き）を取得する
   */
  async function fetchConversationMessages(id: string): Promise<Message[]> {
    try {
      const detail = await getConversationDetail(id);
      return detail.messages.map((m) => ({
        role: m.role as "user" | "assistant" | "system",
        content: m.content,
      }));
    } catch (error) {
      console.error("Failed to fetch conversation detail:", error);
      return [];
    }
  }

  /**
   * 会話を削除する
   */
  async function removeConversation(id: string) {
    try {
      await deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Failed to delete conversation:", error);
    }
  }

  // 初回マウント時に会話一覧を取得
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    isLoadingList,
    fetchConversations,
    fetchConversationMessages,
    removeConversation,
  };
}
