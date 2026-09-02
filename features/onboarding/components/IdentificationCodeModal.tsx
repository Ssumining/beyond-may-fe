"use client";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Close from "@/components/ui/icons/Close";

interface IdentificationCodeModalProps {
  open: boolean;
  code: number;
  onClose: () => void;
}

/**
 * 회원가입 완료 후 발급된 식별코드를 보여주는 모달.
 * 닫으면(X·복사와 무관하게) 호출부가 /places로 이동시킨다.
 */
const IdentificationCodeModal = ({
  open,
  code,
  onClose,
}: IdentificationCodeModalProps) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(String(code));
  };

  return (
    <Modal open={open} onClose={onClose} className="max-w-[320px]">
      <div className="flex items-start justify-between">
        <h2 className="text-neutral-07 text-[18px] font-semibold">
          당신의 식별코드
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="text-neutral-05 cursor-pointer p-1"
        >
          <Close className="h-3.5 w-3.5" />
        </button>
      </div>
      <p className="text-neutral-04 mt-1 text-[13px]">
        이 코드로 다음에 다시 로그인할 수 있어요
      </p>

      <div className="border-neutral-07 mt-4 flex items-center justify-between rounded-lg border px-4 py-3.5">
        <span className="text-neutral-07 text-[20px] font-semibold tracking-wide">
          {code}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="text-neutral-04 cursor-pointer text-[13px]"
        >
          복사
        </button>
      </div>

      <Button
        variant="outline"
        size="lg"
        className="mt-4 w-full"
        onClick={onClose}
      >
        닫기
      </Button>
    </Modal>
  );
};

export default IdentificationCodeModal;
