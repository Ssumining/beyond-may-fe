/** 백엔드/TourAPI 문자열에 섞인 <br> 태그를 실제 줄바꿈으로 바꿈. (whitespace-pre-line과 함께 사용) */
export const stripHtmlBreaks = (text: string | null | undefined): string =>
  (text ?? "").replace(/<br\s*\/?>/gi, "\n");
