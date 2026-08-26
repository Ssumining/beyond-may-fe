"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { isAxiosError } from "axios";
import Link from "next/link";

import { cn } from "@/lib/cn";
import Button from "@/components/ui/Button";
import ChevronRight from "@/components/ui/icons/ChevronRight";
import { usePostLoginMutation } from "./usePostLoginMutation";

const loginSchema = z.object({
  nickname: z.string().min(1),
  identificationCode: z.string().min(1),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const DEFAULT_ERROR_MESSAGE = "닉네임 또는 식별코드가 올바르지 않아요.";

/**
 * 사이드바 로그인 폼 (비로그인 상태 콘텐츠).
 * 닉네임+식별코드로 이전 세션을 이어가는 용도. 로그인 성공은 usePostLoginMutation이
 * 세션 스토어·accessToken 저장까지 처리하므로 이 컴포넌트는 폼 상태만 다룬다.
 */
const SidebarLoginForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { nickname: "", identificationCode: "" },
  });
  const { mutate, isPending, isError, error, reset } = usePostLoginMutation();

  const [nickname, identificationCode] = watch([
    "nickname",
    "identificationCode",
  ]);

  useEffect(() => {
    if (isError) reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nickname, identificationCode]);

  const errorMessage =
    isError &&
    isAxiosError(error) &&
    typeof error.response?.data?.message === "string"
      ? error.response.data.message
      : isError
        ? DEFAULT_ERROR_MESSAGE
        : null;

  const onSubmit = (values: LoginFormValues) => {
    mutate(values);
  };

  return (
    <div>
      <h2 className="text-neutral-07 text-[13px] font-normal">로그인</h2>
      <p className="text-neutral-07 mt-3 text-[15px] leading-relaxed font-medium">
        닉네임을 입력하면
        <br />
        이전 여행을 이어갈 수 있어요.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 flex flex-col gap-4"
      >
        <div>
          <label
            htmlFor="sidebar-login-nickname"
            className="text-neutral-04 text-[13px]"
          >
            닉네임
          </label>
          <input
            id="sidebar-login-nickname"
            type="text"
            placeholder="닉네임을 입력해주세요."
            className={cn(
              "border-neutral-03 mt-1.5 w-full rounded-lg border px-3.5 py-3 text-[15px]",
              "placeholder:text-neutral-04",
              errorMessage && "border-caution-02 bg-caution-01",
            )}
            {...register("nickname")}
          />
        </div>

        <div>
          <label
            htmlFor="sidebar-login-code"
            className="text-neutral-04 text-[13px]"
          >
            식별코드
          </label>
          <input
            id="sidebar-login-code"
            type="text"
            placeholder="부여된 식별코드를 입력해주세요."
            className={cn(
              "border-neutral-03 mt-1.5 w-full rounded-lg border px-3.5 py-3 text-[15px]",
              "placeholder:text-neutral-04",
              errorMessage && "border-caution-02 bg-caution-01",
            )}
            {...register("identificationCode")}
          />
          {errorMessage && (
            <p className="text-caution-02 mt-1.5 text-[12px]">{errorMessage}</p>
          )}
        </div>

        <Button
          type="submit"
          variant="solid"
          size="lg"
          disabled={!isValid || isPending}
          className="mt-2 w-full"
        >
          시작하기
        </Button>
      </form>

      <div className="border-neutral-02 mt-6 border-t">
        {/* TODO: 서비스 소개 페이지 경로 미확정 */}
        <button
          type="button"
          className="border-neutral-02 flex w-full items-center justify-between border-b py-4 text-[15px]"
        >
          서비스 소개
          <ChevronRight className="text-neutral-04 h-3 w-3" />
        </button>

        <Link
          href="/onboarding"
          className="flex w-full items-center justify-between py-4 text-[15px]"
        >
          성향 검사 시작
          <ChevronRight className="text-neutral-04 h-3 w-3" />
        </Link>
      </div>
    </div>
  );
};

export default SidebarLoginForm;
