import ky from "ky";
import { auth } from "../lib/firebase";

/**
 * API クライアント
 *
 * hooks.beforeRequest で全リクエストにトークンを自動付与する。
 * これにより各 service ファイルで毎回トークンを渡す必要がなくなる。
 */
export const apiClient = ky.create({
  prefixUrl: import.meta.env.VITE_API_URL ?? "http://localhost:8000",
  timeout: 60000,
  retry: {
    limit: 2,
    methods: ["get"],
  },
  headers: {
    "Content-Type": "application/json",
  },
  hooks: {
    beforeRequest: [
      async (request) => {
        const user = auth.currentUser;
        if (user) {
          const token = await user.getIdToken();
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
  },
});

/**
 * ストリーミング用の fetch
 * ky ではなく素の fetch を使うが、同じくトークンを付ける
 */
export async function fetchStream(
  endpoint: string,
  body: unknown
): Promise<Response> {
  const baseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(60000),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response;
}
