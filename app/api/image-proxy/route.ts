import type { NextRequest } from "next/server";

// SSRF 방지: 허용 호스트만 프록시 (필요 호스트 추가)
const ALLOWED_HOST_SUFFIXES = ["visitkorea.or.kr"];

export const GET = async (request: NextRequest): Promise<Response> => {
  const url = request.nextUrl.searchParams.get("url");
  if (!url) return new Response("Missing url", { status: 400 });

  let target: URL;
  try {
    target = new URL(url);
  } catch {
    return new Response("Invalid url", { status: 400 });
  }
  if (!ALLOWED_HOST_SUFFIXES.some((host) => target.hostname.endsWith(host))) {
    return new Response("Host not allowed", { status: 403 });
  }

  const upstream = await fetch(target.toString());
  if (!upstream.ok) return new Response("Upstream error", { status: 502 });

  return new Response(upstream.body, {
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "image/jpeg",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=86400",
    },
  });
};