// clsx로 조건부 클래스 조합 + tailwind-merge로 충돌 정리

// tailwind-merge(twMerge) - 같은 속성끼리는 뒤에 온 거 남기고 앞에 있는 것을 버림
// ex: twMerge("px-2 py-1 px-4") -> px-4만 남음

// clsx - 조건부로 클래스를 켜고 끄는 역할
// ex: clsx("pin", isVisited && "pin-color", isDisabled && "opacity-50") -> isVisited가 true - "pin pin-color",  false - "pin"

// ex: cn("px-2", isActive && "bg-blue-500", "px-4")  → "bg-blue-500 px-4"

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
