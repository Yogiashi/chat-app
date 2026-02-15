import { useState } from "react";
import { sendMessageStream } from "../services/chatService";
import type { Message } from "../types/chat";

/**
 * チャット機能のロジック
 *
 * conversationId を管理して、DBとの紐づけを行う。
 */
export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  async function sendChat(content: string) {
    if (!content.trim()) return;

    const userMessage: Message = { role: "user", content };
    const currentMessages = [...messages, userMessage];

    setMessages(currentMessages);
    setIsLoading(true);
    setMessages([...currentMessages, { role: "assistant", content: "" }]);

    try {
      const newConversationId = await sendMessageStream(
        currentMessages,
        (chunk) => {
          setMessages((prev) =>
            prev.map((msg, index) =>
              index === prev.length - 1
                ? { ...msg, content: msg.content + chunk }
                : msg,
            ),
          );
        },
        conversationId,
      );

      // 新規会話の場合、返ってきた conversation_id を保持する
      if (!conversationId && newConversationId) {
        setConversationId(newConversationId);
      }
    } catch (error) {
      setMessages((prev) =>
        prev.map((msg, index) =>
          index === prev.length - 1
            ? {
                ...msg,
                content: "エラーが発生しました。もう一度お試しください。",
              }
            : msg,
        ),
      );
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * 既存の会話を読み込む（サイドバーから選択したとき）
   */
  function loadConversation(id: string, loadedMessages: Message[]) {
    setConversationId(id);
    setMessages(loadedMessages);
  }

  /**
   * 新しい会話を開始する
   */
  function newConversation() {
    setConversationId(undefined);
    setMessages([]);
  }

  return {
    messages,
    conversationId,
    isLoading,
    sendChat,
    loadConversation,
    newConversation,
  };
}
