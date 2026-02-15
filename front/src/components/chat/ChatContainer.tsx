import { useChat } from "../../hooks/useChat";
import { useConversations } from "../../hooks/useConversations";

import { Sidebar } from "../sidebar/Sidebar";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";

export function ChatContainer() {
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

  /**
   * サイドバーで会話を選択したとき
   */
  async function handleSelectConversation(id: string) {
    const loadedMessages = await fetchConversationMessages(id);
    loadConversation(id, loadedMessages);
  }

  /**
   * 会話を削除したとき
   */
  async function handleDeleteConversation(id: string) {
    await removeConversation(id);
    // 今開いている会話を削除したら、新規会話に切り替え
    if (id === conversationId) {
      newConversation();
    }
  }

  /**
   * 新しいチャットを開始するとき
   * 会話一覧も更新する（前の会話が一覧に反映されるように）
   */
  function handleNewChat() {
    newConversation();
    fetchConversations();
  }

  /**
   * メッセージ送信後に会話一覧を更新
   */
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
        </div>
        <MessageList messages={messages} isLoading={isLoading} />
        <MessageInput onSend={handleSendChat} isLoading={isLoading} />
      </div>
    </div>
  );
}
