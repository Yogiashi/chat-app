import { useEffect, useRef } from "react";
import type { Message } from "../../types/chat";
import { MessageItem } from "./MessageItem";

type Props = {
  messages: Message[];
  isLoading: boolean;
};

export function MessageList({ messages, isLoading }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="message-list">
      {messages.length === 0 ? (
        <div className="message-list-empty">
          メッセージを入力してチャットを開始しましょう
        </div>
      ) : (
        messages.map((message, index) => (
          <MessageItem
            key={index}
            message={message}
            isStreaming={
              isLoading &&
              index === messages.length - 1 &&
              message.role === "assistant"
            }
          />
        ))
      )}
      <div ref={bottomRef} />
    </div>
  );
}
