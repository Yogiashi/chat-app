import { useChat } from "../../hooks/useChat";
import { useConversations } from "../../hooks/useConversations";
import { BaseButton } from "../common/BaseButton";
import { Sidebar } from "../sidebar/Sidebar";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";

type Props = {
  onLogout: () => void;
  userEmail: string;
};

export function ChatContainer({ onLogout, userEmail }: Props) {
  const {
    messages,
    conversationId,
    isLoading,
    sendChat,
    loadConversation,
    newConversation,
  } = useChat();

  const {
    conversations,
    isLoadingList,
    fetchConversations,
    fetchConversationMessages,
    removeConversation,
  } = useConversations();

  async function handleSelectConversation(id: string) {
    const loadedMessages = await fetchConversationMessages(id);
    loadConversation(id, loadedMessages);
  }

  async function handleDeleteConversation(id: string) {
    await removeConversation(id);
    if (id === conversationId) {
      newConversation();
    }
  }

  function handleNewChat() {
    newConversation();
    fetchConversations();
  }

  async function handleSendChat(content: string) {
    await sendChat(content);
    fetchConversations();
  }

  return (
    <div className="app-layout">
      <Sidebar
        conversations={conversations}
        currentConversationId={conversationId}
        onSelect={handleSelectConversation}
        onDelete={handleDeleteConversation}
        onNewChat={handleNewChat}
        isLoading={isLoadingList}
      />
      <div className="chat-container">
        <div className="chat-header">
          <h1>GPT Chat</h1>
          <div className="chat-header-right">
            <span className="chat-header-email">{userEmail}</span>
            <BaseButton variant="secondary" onClick={onLogout}>
              ログアウト
            </BaseButton>
          </div>
        </div>
        <MessageList messages={messages} isLoading={isLoading} />
        <MessageInput onSend={handleSendChat} isLoading={isLoading} />
      </div>
    </div>
  );
}
