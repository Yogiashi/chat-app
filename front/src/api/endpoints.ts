const V1 = "api/v1";

export const ENDPOINTS = {
  chat: {
    send: `${V1}/chat`,
    stream: `${V1}/chat/stream`,
  },
  conversations: {
    list: `${V1}/conversations`,
    detail: (id: string) => `${V1}/conversations/${id}`,
    delete: (id: string) => `${V1}/conversations/${id}`,
  },
  health: {
    check: `${V1}/health`,
  },
} as const;

/**
 * as const とは：
 * オブジェクトの値を「リテラル型」として固定する。
 *
 * as const なし → ENDPOINTS.chat.send の型は string
 * as const あり → ENDPOINTS.chat.send の型は "/api/chat"（この文字列だけ）
 *
 * typoしたとき型エラーで気づけるようになる。
 */
