import { AuthForm } from "./components/auth/AuthForm";
import { ChatContainer } from "./components/chat/ChatContainer";
import { useAuth } from "./hooks/useAuth";
import "./styles/common.css";
import "./styles/auth.css";
import "./styles/sidebar.css";
import "./styles/chat.css";

function App() {
  const { user, isLoading, login, register, logout } = useAuth();

  // Firebase の初期化中はローディング表示
  if (isLoading) {
    return (
      <div className="auth-container">
        <p>読み込み中...</p>
      </div>
    );
  }

  // 未ログインなら認証画面を表示
  if (!user) {
    return (
      <AuthForm
        onLogin={async (email, password) => {
          await login(email, password);
        }}
        onRegister={async (email, password) => {
          await register(email, password);
        }}
      />
    );
  }

  // ログイン済みならチャット画面を表示
  return <ChatContainer onLogout={logout} userEmail={user.email ?? ""} />;
}

export default App;
