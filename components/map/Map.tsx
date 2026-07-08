"use client";

import { Map } from "react-kakao-maps-sdk";
import useKakaoLoader from "@/hooks/useKakaoLoader";

/**
 * 카카오 지도를 렌더링하는 컴포넌트.
 * SDK 로딩 상태에 따라 로딩/에러 UI를 보여주고, 정상 시 지도를 그린다.
 */
const KakaoMap = () => {
  const [loading, error] = useKakaoLoader();

  if (error)
    return <div className="p-4 text-red-500">지도를 불러오지 못했어요.</div>;
  if (loading)
    return <div className="p-4 text-gray-500">지도 불러오는 중…</div>;

  return (
    <Map
      center={{ lat: 37.4563, lng: 126.7052 }}
      className="h-[400px] w-full"
      level={3}
    />
  );
};

export default KakaoMap;
