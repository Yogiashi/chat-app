

import ky from "ky";

/**
 * アプリ全体で使うHTTPクライアントのインスタンス
 *
 * ky.create() で共通設定を1回だけ定義する。
 * バックエンドの dependencies/ で OpenAI クライアントを
 * 1回だけ生成するのと同じ発想。
 *
 * 個別のサービスファイルではこの apiClient を import して使う。
 * 共通設定（ベースURL、タイムアウト、認証ヘッダーなど）が
 * 全リクエストに自動で適用される。
 */
export const
 apiClient 
 = ky.create({
  prefixUrl: import.meta.env.VITE_API_URL ?? "http://localhost:8000",

  // タイムアウト：30秒（GPTの応答は時間がかかることがある）
  timeout: 30000,

  headers: {
    "Content-Type": "application/json",
  },

  /**
   * hooks：リクエスト/レスポンスの前後に処理を挟める
   *
   * バックエンドの middleware と同じ発想。
   * 将来、認証トークンの付与やエラーログの送信などをここに追加できる。
   */
  hooks: {
    beforeRequest: [
      // 将来：認証トークンをヘッダーに付与する処理を追加
      // (request) => {
      //   request.headers.set("Authorization", `Bearer ${token}`);
      // },
    ],
  },
});

/**
 * ストリーミング用にfetchベースのリクエストを送る関数
 *
 * ky はレスポンスを自動でパースする設計のため、
 * ストリーミング（生のレスポンスを少しずつ読む）には
 * 標準の fetch を使う方がシンプル。
 *
 * ベースURLなどの共通設定はここで吸収する。
 */
export async function fetchStream(
  endpoint: string,
  body: unknown,
): Promise<Response> {
  const baseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

  const response = await fetch(`${baseUrl}/${endpoint}`, {
      method: "POST",

    headers: { "Content-Type": "application/json" },

    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response;
}
