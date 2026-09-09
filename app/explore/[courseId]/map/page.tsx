"use client";

import { use, useState } from "react";
import { useGetCourseDetailQuery } from "@/hooks/queries/useGetCourseDetailQuery";
import { getCourseMapData } from "@/features/course/utils/courseMapAdapter";
import { toLatLng } from "@/features/explore/utils/toLatLng";
import VisitMap from "@/features/explore/components/VisitMap";
import ExploreHeader from "@/features/explore/components/ExploreHeader";
import TeamBadge from "@/features/explore/components/TeamBadge";
import TeamParticipantsSheet from "@/features/explore/components/TeamParticipantsSheet";
import LocationSharingModal from "@/features/explore/components/LocationSharingModal";
import Sidebar from "@/components/layout/sidebar/Sidebar";
import SidebarProfileMenu from "@/components/layout/sidebar/SidebarProfileMenu";
import useGeolocation from "@/features/explore/hooks/useGeolocation";
import useGetExplorationVisitedPlacesQuery from "@/features/explore/hooks/useGetExplorationVisitedPlacesQuery";
import useGetParticipantsQuery from "@/features/explore/hooks/useGetParticipantsQuery";
import useGetExplorationStatusQuery from "@/features/explore/hooks/useGetExplorationStatusQuery";
import useGeolocationStore from "@/stores/geolocationStore";
import useSessionStore from "@/stores/sessionStore";

interface ExploreMapPageProps {
  params: Promise<{ courseId: string }>;
}

/**
 * 팀 탐험 지도 화면 (4.3.1).
 * 코스 핀 + 방문 인증 + 현재 위치 + 헤더 + 팀원 목록 + 위치 공유.
 * (후속: STOMP 실시간, 주변 장소)
 */
const ExploreMapPage = ({ params }: ExploreMapPageProps) => {
  const { courseId } = use(params);
  const explorationId = useSessionStore((state) => state.explorationId);
  const explorationIdStr = explorationId !== null ? String(explorationId) : "";

  const [isTeamOpen, setIsTeamOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLocationSharingOpen, setIsLocationSharingOpen] = useState(true);

  useGeolocation({ enabled: true });
  const coordinates = useGeolocationStore((state) => state.coordinates);
  const isAccurate = useGeolocationStore((state) => state.isAccurate);

  const {
    data: course,
    isPending,
    isError,
  } = useGetCourseDetailQuery(courseId);
  const { data: visitedData } =
    useGetExplorationVisitedPlacesQuery(explorationIdStr);
  const {
    data: participants,
    isPending: isParticipantsPending,
    isError: isParticipantsError,
  } = useGetParticipantsQuery(explorationIdStr);
  const { data: explorationStatus } =
    useGetExplorationStatusQuery(explorationIdStr);

  if (isPending) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <p className="text-neutral-04 text-sm">코스를 불러오고 있어요…</p>
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <p className="text-neutral-04 text-sm">코스를 불러오지 못했어요.</p>
      </div>
    );
  }

  if (explorationId === null) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <p className="text-neutral-04 text-sm">
          탐험 정보를 찾을 수 없어요. 다시 합류해 주세요.
        </p>
      </div>
    );
  }

  const { center } = getCourseMapData(course.places);
  const myLocation =
    coordinates && isAccurate ? toLatLng(coordinates) : undefined;
  const initialVisitedPlaceIds =
    visitedData?.visitedPlaces.map((place) => place.placeId) ?? [];

  const participantCount = participants?.participantCount ?? 0;
  const isOngoing = explorationStatus?.status === "ONGOING";

  return (
    <div className="relative h-dvh w-full">
      <VisitMap
        explorationId={explorationId}
        places={course.places}
        center={myLocation ?? center}
        myLocation={myLocation}
        initialVisitedPlaceIds={initialVisitedPlaceIds}
      />

      <ExploreHeader
        center={
          <TeamBadge
            participantCount={participantCount}
            onClick={() => setIsTeamOpen(true)}
          />
        }
        onOpenMenu={() => setIsMenuOpen(true)}
      />

      <Sidebar open={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
        <SidebarProfileMenu />
      </Sidebar>

      {isTeamOpen && (
        <TeamParticipantsSheet
          participantCount={participantCount}
          participants={participants?.participants ?? []}
          isPending={isParticipantsPending}
          isError={isParticipantsError}
          isOngoing={isOngoing}
          onClose={() => setIsTeamOpen(false)}
        />
      )}

      {isLocationSharingOpen && (
        <LocationSharingModal
          explorationId={explorationIdStr}
          onClose={() => setIsLocationSharingOpen(false)}
        />
      )}
    </div>
  );
};

export default ExploreMapPage;
