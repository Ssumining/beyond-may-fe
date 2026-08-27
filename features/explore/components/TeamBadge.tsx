"use client";

interface TeamBadgeProps {
  participantCount: number;
  onClick: () => void;
}

const TeamBadge = ({ participantCount, onClick }: TeamBadgeProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-white-01 text-neutral-07 rounded-full px-4 py-2 text-[12px] font-medium shadow"
    >
      ◈ 팀 {participantCount}명
    </button>
  );
};

export default TeamBadge;
