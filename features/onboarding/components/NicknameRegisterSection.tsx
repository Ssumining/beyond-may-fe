"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Button from "@/components/ui/Button";
import { usePostSignupMutation } from "@/features/onboarding/hooks/usePostSignupMutation";
import IdentificationCodeModal from "@/features/onboarding/components/IdentificationCodeModal";

const nicknameSchema = z.object({
  nickname: z.string().min(1).max(10),
});

type NicknameFormValues = z.infer<typeof nicknameSchema>;

/**
 * 결과 화면 하단에 이어지는 닉네임/세션 등록 섹션.
 * 성향 검사만 마치고 세션(닉네임)이 없는 사용자에게만 노출된다 (호출부에서 조건 처리).
 * 등록 완료 시 식별코드 모달을 보여준 뒤 장소 선택(2.1.1)으로 이동한다.
 */
const NicknameRegisterSection = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { isValid },
  } = useForm<NicknameFormValues>({
    resolver: zodResolver(nicknameSchema),
    mode: "onChange",
    defaultValues: { nickname: "" },
  });
  const nickname = watch("nickname");
  const { mutate, data, isPending, isSuccess } = usePostSignupMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onSubmit = (values: NicknameFormValues) => {
    mutate(values, { onSuccess: () => setIsModalOpen(true) });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    router.push("/places");
  };

  return (
    <section className="mt-16 px-6">
      <h2 className="text-neutral-07 text-[18px] font-semibold">
        여행 시작하기
      </h2>
      <p className="text-neutral-04 mt-1 text-[13px]">
        중복 확인 없이 바로 시작해요. 실명이나 개인정보 대신 자유롭게 닉네임을
        지어주세요.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
        <label
          htmlFor="result-nickname"
          className="text-neutral-04 text-[13px]"
        >
          닉네임
        </label>
        <div className="border-neutral-07 mt-1.5 flex items-center rounded-lg border px-3.5 py-3">
          <input
            id="result-nickname"
            type="text"
            placeholder="닉네임을 입력해주세요."
            maxLength={10}
            className="placeholder:text-neutral-04 flex-1 text-[15px] outline-none"
            {...register("nickname")}
          />
          <span className="text-neutral-04 shrink-0 text-[13px]">
            {nickname?.length ?? 0} / 10
          </span>
        </div>
        <p className="text-neutral-04 mt-1.5 text-[12px]">
          닉네임은 바꿀 수 없습니다.
        </p>

        <Button
          type="submit"
          variant="solid"
          size="lg"
          disabled={!isValid || isPending || isSuccess}
          className="mt-4 w-full"
        >
          시작하기
        </Button>
      </form>

      {data && (
        <IdentificationCodeModal
          open={isModalOpen}
          code={data.identificationCode}
          onClose={handleModalClose}
        />
      )}
    </section>
  );
};

export default NicknameRegisterSection;
