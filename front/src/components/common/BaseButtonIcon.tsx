import type { ButtonHTMLAttributes } from "react";

/**
 * アイコン付きボタン
 * テキストなしでアイコンだけ表示するボタン用
 */
type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string; // アクセシビリティ用のラベル（スクリーンリーダー向け）
};

export function BaseIconButton({
  label,
  className = "",
  children,
  ...rest
}: Props) {
  return (
    <button className={`icon-btn ${className}`} aria-label={label} {...rest}>
      {children}
    </button>
  );
}
