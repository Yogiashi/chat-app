/**
 * ローディング表示（3つの点がアニメーションする）
 *
 * GPTが応答を生成中であることをユーザーに伝える。
 * 何も表示されないと「フリーズした？」と不安になるため。
 */
export function BaseLoadingDots() {
  return (
    <span className="loading-dots">
      <span className="dot" />
      <span className="dot" />
      <span className="dot" />
    </span>
  );
}
