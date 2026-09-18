"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * 라우트 전환 시 짧은 페이드인으로 화면이 뚝 바뀌는 느낌을 줄인다.
 * exit 애니메이션(AnimatePresence)은 일부러 넣지 않는다 — 이전 페이지가
 * 사라지길 기다리면 모든 내비게이션에 체감 지연이 생기므로, 새 페이지
 * 진입만 부드럽게 만든다.
 */
const PageTransition = ({ children }: PageTransitionProps) => {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
