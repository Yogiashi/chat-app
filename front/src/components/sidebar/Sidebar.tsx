import type { Conversation } from "../../types/chat";
import { BaseButton } from "../common/BaseButton";
import { SidebarItem } from "./SidebarItem";

type Props = {
  conversations: Conversation[];
  currentConversationId?: string;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onNewChat: () => void;
  isLoading: boolean;
};

export function Sidebar({
  conversations,
  currentConversationId,
  onSelect,
  onDelete,
  onNewChat,
  isLoading,
}: Props) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <BaseButton
          variant="primary"
          onClick={onNewChat}
          className="new-chat-btn"
        >
          ＋ 新しいチャット
        </BaseButton>
      </div>

      <div className="sidebar-list">
        {isLoading ? (
          <div className="sidebar-loading">読み込み中...</div>
        ) : conversations.length === 0 ? (
          <div className="sidebar-empty">会話履歴がありません</div>
        ) : (
          conversations.map((conversation) => (
            <SidebarItem
              key={conversation.id}
              conversation={conversation}
              isActive={conversation.id === currentConversationId}
              onSelect={onSelect}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
