import type { Conversation } from "../../types/chat";
import { BaseIconButton } from "../common/BaseButtonIcon";

type Props = {
  conversation: Conversation;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
};

export function SidebarItem({
  conversation,
  isActive,
  onSelect,
  onDelete,
}: Props) {
  return (
    <div
      className={`sidebar-item ${isActive ? "sidebar-item-active" : ""}`}
      onClick={() => onSelect(conversation.id)}
    >
      <div className="sidebar-item-title">{conversation.title}</div>
      <BaseIconButton
        label="削除"
        className="sidebar-item-delete"
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          /**
           * e.stopPropagation()：
           * イベントの「バブリング」を止める。
           *
           * 削除ボタンは sidebar-item の中にある。
           * クリックすると、まず削除ボタンのonClickが発火し、
           * その後親の sidebar-item の onClick（会話選択）も発火してしまう。
           * stopPropagation で親への伝播を止めて、削除だけ実行する。
           */
          e.stopPropagation();
          onDelete(conversation.id);
        }}
      >
        ✕
      </BaseIconButton>
    </div>
  );
}
