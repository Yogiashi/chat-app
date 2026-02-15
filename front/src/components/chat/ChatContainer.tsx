import { useChat } from "../../hooks/useChat";
import { BaseButton } from "../common/BaseButton";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";

export function ChatContainer() {
  const { messages, isLoading, sendChat, clearMessages } = useChat();

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>GPT Chat</h1>
        <BaseButton variant="secondary" onClick={clearMessages}>
          クリア
        </BaseButton>
      </div>
      <MessageList messages={messages} isLoading={isLoading} />
      <MessageInput onSend={sendChat} isLoading={isLoading} />
    </div>
  );
}
