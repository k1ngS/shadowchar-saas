export type PathTier = "novice" | "expert" | "master";
export type PathProgressStatus = "locked" | "eligible" | "selected";

export const PATH_UNLOCK: Record<PathTier, number> = {
  novice: 1,
  expert: 3,
  master: 7,
} as const;

export function canChooseTier(level: number, tier: PathTier): boolean {
  return level >= PATH_UNLOCK[tier];
}

export function getTierStatus(
  level: number,
  selectedSlug: string | undefined | null,
  tier: PathTier,
): PathProgressStatus {
  if (selectedSlug) return "selected";
  return canChooseTier(level, tier) ? "eligible" : "locked";
}

export function getNextUnlock(
  level: number,
): { tier: PathTier; atLevel: number } | null {
  const remaining = (Object.keys(PATH_UNLOCK) as PathTier[])
    .map((t) => ({ tier: t, atLevel: PATH_UNLOCK[t] }))
    .filter((x) => level < x.atLevel)
    .sort((a, b) => a.atLevel - b.atLevel);
  return remaining[0] ?? null;
}
