import { useKakaoLoader as useKakaoLoaderOrigin } from "react-kakao-maps-sdk";
import { ENV } from "@/lib/env";

/**
 * 카카오 지도 SDK를 로드한다.
 * 지도를 쓰는 컴포넌트에서 호출하며, SDK는 최초 1회만 로딩된다.
 */
const useKakaoLoader = (): ReturnType<typeof useKakaoLoaderOrigin> => {
  return useKakaoLoaderOrigin({
    appkey: ENV.KAKAO_MAP_KEY,
    libraries: ["services", "clusterer"],
  });
};

export default useKakaoLoader;
