/**
 * 1つのメッセージを表す型
 *
 * バックエンドの schemas/request/chat_request.py の Message と対応している。
 * フロントとバックエンドで同じ構造を共有することで、
 * データのやり取りでミスが起きにくくなる。
 */
export type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

export type ChatRequest = {
  messages: Message[];
  conversation_id?: string;
};

export type ChatResponse = {
  content: string;
  conversation_id: string;
};

export type Conversation = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
};

export type ConversationDetail = {
  id: string;
  title: string;
  messages: MessageResponse[];
  created_at: string;
  updated_at: string;
};

export type MessageResponse = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
};
