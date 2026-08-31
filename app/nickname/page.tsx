"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import AppHeader from "@/components/layout/AppHeader";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { usePostSignupMutation } from "@/features/onboarding/hooks/usePostSignupMutation";
import IdentificationCodeModal from "@/features/onboarding/components/IdentificationCodeModal";

const nicknameSchema = z.object({
  nickname: z.string().min(1).max(10),
});

type NicknameFormValues = z.infer<typeof nicknameSchema>;

/**
 * 닉네임/세션 등록 화면.
 * 닉네임을 입력해 회원가입(=세션 생성)하고, 발급된 식별코드를 모달로 보여준
 * 뒤 장소 선택(2.1.1)으로 이동한다.
 */
const NicknamePage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<NicknameFormValues>({
    resolver: zodResolver(nicknameSchema),
    mode: "onChange",
    defaultValues: { nickname: "" },
  });
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
    <main className="bg-neutral-01 mx-auto flex h-[100dvh] w-full max-w-[430px] flex-col">
      <AppHeader showMenu={false} className="text-neutral-04" />

      <div className="flex-1 px-8 pt-10">
        <h1 className="text-neutral-07 text-[20px] leading-relaxed font-medium">
          닉네임을 입력해주세요
        </h1>
        <p className="text-neutral-05 mt-2 text-[14px]">
          1~10자로 자유롭게 지어주세요.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
          <label
            htmlFor="nickname-input"
            className="text-neutral-04 text-[13px]"
          >
            닉네임
          </label>
          <input
            id="nickname-input"
            type="text"
            placeholder="닉네임을 입력해주세요."
            maxLength={10}
            className={cn(
              "border-neutral-03 mt-1.5 w-full rounded-lg border px-3.5 py-3 text-[15px]",
              "placeholder:text-neutral-04",
            )}
            {...register("nickname")}
          />

          <Button
            type="submit"
            variant="solid"
            size="lg"
            disabled={!isValid || isPending || isSuccess}
            className="mt-6 w-full"
          >
            시작하기
          </Button>
        </form>
      </div>

      {data && (
        <IdentificationCodeModal
          open={isModalOpen}
          code={data.identificationCode}
          onClose={handleModalClose}
        />
      )}
    </main>
  );
};

export default NicknamePage;
