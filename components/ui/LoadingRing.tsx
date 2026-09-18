import { cn } from "@/lib/cn";

interface LoadingRingProps {
  /** 스크린리더용 상태 설명 */
  label: string;
  className?: string;
}

/**
 * 원형 로딩 스피너. conic-gradient로 꼬리가 옅어지는 링을 만들고
 * radial-gradient 마스크로 안쪽을 뚫어 도넛 모양만 남긴다.
 * (참고: yui540/reanimated-css-animations)
 */
const LoadingRing = ({ label, className }: LoadingRingProps) => (
  <span
    role="status"
    aria-label={label}
    className={cn("animate-spin rounded-full", className)}
    style={{
      width: 42,
      height: 42,
      background:
        "conic-gradient(from 0deg, transparent 0%, var(--color-primary-08) 100%)",
      WebkitMask:
        "radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 4px))",
      mask: "radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 4px))",
    }}
  />
);

export default LoadingRing;
