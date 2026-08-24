import { type ButtonHTMLAttributes, type ReactNode } from "react";

import { cn } from "@/lib/cn";

type ButtonVariant = "outline" | "solid";
type ButtonSize = "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** 텍스트 앞에 놓일 아이콘 */
  icon?: ReactNode;
}

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  outline: "border-neutral-07 text-neutral-07 border",
  solid: "bg-neutral-07 text-neutral-01",
};

const SIZE_CLASS: Record<ButtonSize, string> = {
  lg: "py-3.5 text-[15px]",
  md: "py-3 text-[14px]",
};

/**
 * 공용 버튼 (components/ui). 아웃라인/솔릿 두 스타일과 두 크기를 지원한다.
 * 너비(w-full/flex-1 등)는 쓰이는 위치의 레이아웃에 맡기고 className으로 받는다.
 */
const Button = ({
  variant = "outline",
  size = "md",
  icon,
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) => (
  <button
    type={type}
    className={cn(
      "flex items-center justify-center gap-2 rounded-full font-medium disabled:opacity-50",
      VARIANT_CLASS[variant],
      SIZE_CLASS[size],
      className,
    )}
    {...rest}
  >
    {icon}
    {children}
  </button>
);

export default Button;
