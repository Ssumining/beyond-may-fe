"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  onClose: () => void;
  /** 표시 시간(ms) */
  duration?: number;
}

/** 공용 하단 토스트. 지정 시간 후 자동으로 닫힌다. */
const Toast = ({ message, onClose, duration = 3000 }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-neutral-07 text-white-01 pointer-events-none fixed bottom-12 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full px-5 py-3 text-[13px] font-medium whitespace-nowrap shadow-[0_8px_24px_-6px_rgba(0,0,0,0.12)]"
    >
      {message}
    </div>
  );
};

export default Toast;