import type { ButtonHTMLAttributes } from "react";

/**
 * 共通ボタンコンポーネント
 *
 * ButtonHTMLAttributes<HTMLButtonElement>：
 *   HTMLの<button>が持つすべての属性（onClick, disabled, type等）の型。
 *   これを extends することで、標準のボタン属性をすべて受け取れる。
 *
 * variant：ボタンの見た目のバリエーション
 *   - "primary": メインのアクション（送信など）
 *   - "secondary": サブのアクション（クリアなど）
 */
type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export function BaseButton({
  variant = "primary",
  className = "",
  children,
  ...rest
}: Props) {
  return (
    <button className={`btn btn-${variant} ${className}`} {...rest}>
      {children}
    </button>
  );
}
