import { ButtonHTMLAttributes } from "react";

interface MyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

export function MyButton({
  text,
  onClick,
  className,
  ...props
}: MyButtonProps) {
  return (
    <button
      className={`p-2 text-sm cursor-pointer rounded-sm border-[#E5E5EC] border font-bold ${className || ""}`}
      onClick={onClick}
      {...props}
    >
      {text}
    </button>
  );
}
