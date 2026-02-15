import { useState } from "react";
import { sendMessageStream } from "../services/chatService";
import type { Message } from "../types/chat";

/**
 * チャット機能のロジックをまとめたカスタムフック
 *
 * カスタムフックとは：
 *   use で始まる関数で、React のフック（useState 等）を内部で使う。
 *   コンポーネントから「状態管理＋ロジック」を切り出せる。
 *
 *   バックエンドの usecase と同じ発想：
 *   - useChat = usecase（ロジック担当）
 *   - ChatContainer = router（UIとロジックの接続担当）
 */
export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * メッセージを送信する
   *
   * なぜ普通の関数で十分か：
   * useCallback は子コンポーネントが React.memo でラップされている場合に
   * 無駄な再描画を防ぐ最適化。
   * 今回はその構成ではないので、シンプルな関数で問題ない。
   * パフォーマンス問題が出てから最適化すればいい（早すぎる最適化は避ける）。
   */
  async function sendChat(content: string) {
    if (!content.trim()) return;

    // ユーザーのメッセージを追加
    const userMessage: Message = { role: "user", content };

    // 現在のメッセージ一覧を取得してからstateを更新
    // stateの更新は非同期なので、API送信用に現在の値を変数で保持する
    const currentMessages = [...messages, userMessage];

    setMessages(currentMessages);
    setIsLoading(true);

    // AIの応答用の空メッセージを先に追加
    // ストリーミングでここに文字を追記していく
    setMessages([...currentMessages, { role: "assistant", content: "" }]);

    try {
      await sendMessageStream(currentMessages, (chunk) => {
        // チャンクが届くたびに、最後のメッセージ（assistant）の content に追記
        setMessages((prev) =>
          prev.map((msg, index) =>
            index === prev.length - 1
              ? { ...msg, content: msg.content + chunk }
              : msg,
          ),
        );
      });
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

  function clearMessages() {
    setMessages([]);
  }

  return {
    messages,
    isLoading,
    sendChat,
    clearMessages,
  };
}
