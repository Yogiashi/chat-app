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

/**
 * バックエンドに送るリクエストの型
 * POST /api/chat のリクエストボディに対応
 */
export type ChatRequest = {
  messages: Message[];
};

/**
 * バックエンドから返ってくるレスポンスの型
 * POST /api/chat のレスポンスに対応
 */
export type ChatResponse = {
  content: string;
};
