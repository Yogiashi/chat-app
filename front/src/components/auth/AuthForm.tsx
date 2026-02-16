import { useState } from "react";
import { BaseButton } from "../common/BaseButton";
import type { AuthMode } from "../../types/auth";

type Props = {
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (email: string, password: string) => Promise<void>;
};

export function AuthForm({ onLogin, onRegister }: Props) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (mode === "login") {
        await onLogin(email, password);
      } else {
        await onRegister(email, password);
      }
    } catch (err) {
      /**
       * Firebase のエラーコードを日本語に変換
       * Firebase は英語のエラーコードを返すので、ユーザーに分かりやすくする
       */
      const errorCode = (err as { code?: string }).code ?? "";
      const messages: Record<string, string> = {
        "auth/email-already-in-use": "このメールアドレスは既に使われています",
        "auth/invalid-email": "メールアドレスの形式が正しくありません",
        "auth/weak-password": "パスワードは6文字以上にしてください",
        "auth/invalid-credential":
          "メールアドレスまたはパスワードが間違っています",
      };
      setError(messages[errorCode] ?? "認証に失敗しました");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">GPT Chat</h1>
        <p className="auth-subtitle">
          {mode === "login" ? "ログイン" : "アカウント作成"}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            className="auth-input"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="auth-input"
            placeholder="パスワード（6文字以上）"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          {error && <p className="auth-error">{error}</p>}

          <BaseButton type="submit" disabled={isLoading}>
            {isLoading
              ? "処理中..."
              : mode === "login"
                ? "ログイン"
                : "登録"}
          </BaseButton>
        </form>

        <p className="auth-switch">
          {mode === "login" ? (
            <>
              アカウントがない方は
              <button
                type="button"
                className="auth-switch-btn"
                onClick={() => {
                  setMode("register");
                  setError("");
                }}
              >
                新規登録
              </button>
            </>
          ) : (
            <>
              アカウントをお持ちの方は
              <button
                type="button"
                className="auth-switch-btn"
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
              >
                ログイン
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
