"use client";

import { type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/cn";
import Close from "@/components/ui/icons/Close";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

/**
 * 우측에서 슬라이드로 열리는 전역 메뉴 뼈대 (components/layout/sidebar).
 * 오버레이·닫기 버튼·슬라이드 애니메이션만 담당하고, 실제 내용(로그인 폼/프로필 메뉴 등)은
 * children으로 받아 로그인 상태에 따라 호출부(app/page.tsx 등)가 갈아 끼운다.
 */
const Sidebar = ({ open, onClose, children, className }: SidebarProps) => {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            className="absolute inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* 오버레이는 전체 화면, 패널은 앱 프레임(max-w-430) 안에서 우측 정렬 —
              데스크톱 브라우저에서 앱 콘텐츠와 어긋나지 않도록 ShareSheet와 동일 패턴 */}
          <div className="relative mx-auto flex h-full max-w-[430px] justify-end">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="메뉴"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className={cn(
                "bg-neutral-01 relative flex h-full w-[82%] flex-col px-6 pt-4",
                className,
              )}
            >
              <button
                type="button"
                onClick={onClose}
                aria-label="닫기"
                className="text-neutral-06 self-end p-2"
              >
                <Close className="h-5 w-5" />
              </button>

              <div className="flex-1 overflow-y-auto pb-6">{children}</div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
