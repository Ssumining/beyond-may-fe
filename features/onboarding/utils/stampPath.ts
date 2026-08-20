interface StampPathOptions {
  width: number;
  height: number;
  notchRadius: number;
  /** 톱니(원) 사이 직선 구간 길이(px). 기본값은 notchRadius와 동일. */
  gap?: number;
  /**
   * 모서리 여백(px). 양 끝에서 이만큼 떨어진 구간에만 톱니를 채워
   * 톱니가 가운데로 밀집되고 모서리는 넓게 남는다. 기본값은 notchRadius의 2배.
   */
  cornerMargin?: number;
}

/**
 * 실제 우표처럼 사방에 반원형 톱니(perforation)가 있는 SVG path data를 생성한다.
 *
 * 톱니 사이에 짧은 직선 구간을 두어 "원 - 직선 - 원 - 직선 ..." 리듬을 만들고,
 * 모서리는 자르지 않고 직각 그대로 두되, cornerMargin만큼 넓게 비워 톱니를
 * 가운데로 밀집시킨다.
 */
export const buildStampPath = ({
  width,
  height,
  notchRadius,
  gap = notchRadius,
  cornerMargin = notchRadius * 2,
}: StampPathOptions): string => {
  const r = notchRadius;
  const diameter = r * 2;
  const margin = Math.max(cornerMargin, r);

  const usableX = Math.max(width - margin * 2, diameter);
  const notchesX = Math.max(1, Math.round((usableX + gap) / (diameter + gap)));
  const gapX =
    notchesX > 1 ? (usableX - notchesX * diameter) / (notchesX - 1) : 0;

  const usableY = Math.max(height - margin * 2, diameter);
  const notchesY = Math.max(1, Math.round((usableY + gap) / (diameter + gap)));
  const gapY =
    notchesY > 1 ? (usableY - notchesY * diameter) / (notchesY - 1) : 0;

  const commands: string[] = ["M 0 0"];

  // 위쪽 톱니 (왼쪽 → 오른쪽)
  commands.push(`L ${margin} 0`);
  for (let i = 0; i < notchesX; i++) {
    const x = margin + i * (diameter + gapX);
    commands.push(`A ${r} ${r} 0 0 0 ${x + diameter} 0`);
    if (i < notchesX - 1) {
      commands.push(`L ${x + diameter + gapX} 0`);
    }
  }
  commands.push(`L ${width} 0`);

  // 오른쪽 톱니 (위 → 아래)
  commands.push(`L ${width} ${margin}`);
  for (let i = 0; i < notchesY; i++) {
    const y = margin + i * (diameter + gapY);
    commands.push(`A ${r} ${r} 0 0 0 ${width} ${y + diameter}`);
    if (i < notchesY - 1) {
      commands.push(`L ${width} ${y + diameter + gapY}`);
    }
  }
  commands.push(`L ${width} ${height}`);

  // 아래쪽 톱니 (오른쪽 → 왼쪽)
  commands.push(`L ${width - margin} ${height}`);
  for (let i = 0; i < notchesX; i++) {
    const x = width - margin - i * (diameter + gapX);
    commands.push(`A ${r} ${r} 0 0 0 ${x - diameter} ${height}`);
    if (i < notchesX - 1) {
      commands.push(`L ${x - diameter - gapX} ${height}`);
    }
  }
  commands.push(`L 0 ${height}`);

  // 왼쪽 톱니 (아래 → 위)
  commands.push(`L 0 ${height - margin}`);
  for (let i = 0; i < notchesY; i++) {
    const y = height - margin - i * (diameter + gapY);
    commands.push(`A ${r} ${r} 0 0 0 0 ${y - diameter}`);
    if (i < notchesY - 1) {
      commands.push(`L 0 ${y - diameter - gapY}`);
    }
  }
  commands.push("L 0 0");

  commands.push("Z");

  return commands.join(" ");
};
