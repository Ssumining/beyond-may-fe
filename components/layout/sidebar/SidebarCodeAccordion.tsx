"use client";

import { useState } from "react";

import ChevronDown from "@/components/ui/icons/ChevronDown";
import ChevronRight from "@/components/ui/icons/ChevronRight";

interface SidebarCodeAccordionProps {
  code: string;
}

const MENU_ITEM_CLASS =
  "border-neutral-02 flex w-full cursor-pointer items-center justify-between border-b py-4 text-[15px]";

/**
 * "식별코드 보기" 아코디언. 접힌 상태는 다른 메뉴 항목과 같은 chevron 행,
 * 펼치면 코드 값 + 복사 버튼이 담긴 테두리 박스로 바뀐다.
 */
const SidebarCodeAccordion = ({ code }: SidebarCodeAccordionProps) => {
  const [open, setOpen] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={MENU_ITEM_CLASS}
      >
        식별코드 보기
        <ChevronRight className="text-neutral-04 h-3 w-3" />
      </button>
    );
  }

  return (
    <div className="border-neutral-02 border-b py-4">
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="flex w-full cursor-pointer items-center justify-between"
      >
        <span className="text-neutral-04 text-[13px]">식별코드</span>
        <span className="text-neutral-04 flex items-center gap-1 text-[13px]">
          접기
          <ChevronDown className="h-2 w-3 rotate-180" />
        </span>
      </button>

      <div className="border-neutral-07 mt-2 flex items-center justify-between rounded-lg border px-3.5 py-3">
        <span className="text-neutral-07 text-[15px] font-medium">{code}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="text-neutral-04 cursor-pointer text-[13px]"
        >
          복사
        </button>
      </div>
    </div>
  );
};

export default SidebarCodeAccordion;
