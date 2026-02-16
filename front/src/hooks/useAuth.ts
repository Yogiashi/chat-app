import { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { auth } from "../lib/firebase";

/**
 * 認証状態の管理フック
 *
 * Firebase Auth が以下をすべて担当してくれる：
 * - パスワードのハッシュ化と保存
 * - セッション管理（ログイン状態の維持）
 * - ID トークン（JWT）の発行と自動更新
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    /**
     * onAuthStateChanged：認証状態の変化を監視するリスナー
     *
     * ログインしたとき → user にユーザー情報が入る
     * ログアウトしたとき → user が null になる
     * ページリロード時 → Firebase がセッションを復元してくれる
     *
     * 戻り値の unsubscribe を返すことで、
     * コンポーネントのアンマウント時にリスナーを解除する。
     */
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  /**
   * ユーザー登録
   */
  async function register(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  /**
   * ログイン
   */
  async function login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  /**
   * ログアウト
   */
  async function logout() {
    return signOut(auth);
  }

  /**
   * ID トークンを取得する（API リクエストに付ける）
   *
   * Firebase が自動で JWT を生成してくれる。
   * このトークンをバックエンドに送ることで、
   * 「このリクエストはログイン済みユーザーからのもの」と証明する。
   */
  async function getToken(): Promise<string | null> {
    if (!user) return null;
    return user.getIdToken();
  }

  return {
    user,
    isLoading,
    register,
    login,
    logout,
    getToken,
  };
}
