import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

/**
 * Firebase の初期設定
 *
 * initializeApp：Firebase アプリを初期化する（アプリ全体で1回だけ）
 * getAuth：認証機能のインスタンスを取得する
 *
 * バックエンドの dependencies/ で OpenAI クライアントを
 * 1回だけ生成するのと同じ発想。
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
