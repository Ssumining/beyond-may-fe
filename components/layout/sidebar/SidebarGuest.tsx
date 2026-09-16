"use client";

import { useState } from "react";

import useAccountStore from "@/stores/accountStore";
import SidebarLoginForm from "./SidebarLoginForm";
import SidebarNewUser from "./SidebarNewUser";

interface SidebarGuestProps {
  /** 세션 만료로 진입한 경우 — 이력 유무와 무관하게 로그인 폼을 보여준다. */
  expired?: boolean;
}

/**
 * 비로그인 상태 사이드바 콘텐츠 분기.
 * - 가입/로그인 이력 있음(또는 세션 만료) → 로그인 폼("여행 이어가기")
 * - 이력 없는 신규 사용자 → 성향 검사 유도, 로그인은 보조 동선
 */
const SidebarGuest = ({ expired = false }: SidebarGuestProps) => {
  const hasAccount = useAccountStore((state) => state.hasAccount);
  const [showLogin, setShowLogin] = useState(false);

  if (expired || hasAccount || showLogin) {
    return <SidebarLoginForm />;
  }
  return <SidebarNewUser onLoginClick={() => setShowLogin(true)} />;
};

export default SidebarGuest;