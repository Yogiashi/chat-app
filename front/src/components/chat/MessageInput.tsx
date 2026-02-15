import { useState } from "react";
import { BaseTextArea } from "../common/BaseTextArea";
import { BaseButton } from "../common/BaseButton";

type Props = {
  onSend: (content: string) => void;
  isLoading: boolean;
};

export function MessageInput({ onSend, isLoading }: Props) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <BaseTextArea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="メッセージを入力..."
        disabled={isLoading}
        rows={1}
      />
      <BaseButton type="submit" disabled={!input.trim() || isLoading}>
        {isLoading ? "送信中..." : "送信"}
      </BaseButton>
    </form>
  );
}
