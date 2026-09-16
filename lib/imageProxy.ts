/** 외부(비-CORS/http) 이미지를 같은 출처 https+CORS로 우회. 우표 캡처용. */
export const toProxiedImage = (url?: string | null): string | undefined =>
  url ? `/api/image-proxy?url=${encodeURIComponent(url)}` : undefined;