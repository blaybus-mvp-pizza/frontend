import { ButtonHTMLAttributes } from "react";
import { Typography } from "@workspace/ui/components/typography";

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
      className={`px-2 py-1 cursor-pointer rounded-sm border-[#E5E5EC] border ${className || ""}`}
      onClick={onClick}
      {...props}
    >
      <Typography variant="button" weight={'semibold'}>
        {text}
      </Typography>
    </button>
  );
}
