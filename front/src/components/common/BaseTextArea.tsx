import type { TextareaHTMLAttributes } from "react";

/**
 * 共通テキストエリアコンポーネント
 */
type Props = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function BaseTextArea({ className = "", ...rest }: Props) {
  return <textarea className={`textarea ${className}`} {...rest} />;
}
