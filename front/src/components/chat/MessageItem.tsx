import type { Message } from "../../types/chat";
import { BaseLoadingDots } from "../common/BaseLoadingDots";

type Props = {
  message: Message;
  isStreaming?: boolean;
};

export function MessageItem({ message, isStreaming = false }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={`message ${isUser ? "message-user" : "message-assistant"}`}>
      <div className="message-role">{isUser ? "You" : "AI"}</div>
      <div className="message-content">
        {message.content}
        {isStreaming && <BaseLoadingDots />}
      </div>
    </div>
  );
}
