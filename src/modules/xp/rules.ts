export const XP_RULES = {
  weeklyPenaltyCap: 300,
  dailyBehaviorPenaltyCap: 40,
  weeklyTarget: 1_000,
  ordinaryWeeklyMaximum: 1_180,
} as const;

export type WeeklyRank = "E" | "D" | "C" | "B" | "A" | "S";

type WeeklyXpInput = {
  positiveXp: number;
  bonusXp: number;
  penaltyXp: number;
};

export function consolidateWeek(input: WeeklyXpInput) {
  const positiveXp = Math.max(0, Math.trunc(input.positiveXp));
  const bonusXp = Math.max(0, Math.trunc(input.bonusXp));
  const rawPenalty = Math.max(0, Math.trunc(input.penaltyXp));
  const appliedPenalty = Math.min(rawPenalty, XP_RULES.weeklyPenaltyCap);
  const netXp = positiveXp + bonusXp - appliedPenalty;

  return {
    positiveXp,
    bonusXp,
    rawPenalty,
    appliedPenalty,
    netXp,
    consolidatedXp: Math.max(0, netXp),
  };
}

const rankOrder: WeeklyRank[] = ["E", "D", "C", "B", "A", "S"];

function rawRank(score: number): WeeklyRank {
  if (score >= 95) return "S";
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 55) return "C";
  if (score >= 40) return "D";
  return "E";
}

export function rankFromScore(score: number, coverage: number): WeeklyRank {
  const calculatedRank = rawRank(Math.min(100, Math.max(0, score)));
  const coverageCap: WeeklyRank = coverage < 60 ? "C" : coverage < 80 ? "B" : "S";

  return rankOrder[
    Math.min(rankOrder.indexOf(calculatedRank), rankOrder.indexOf(coverageCap))
  ];
}

export function xpRequiredForNextLevel(level: number) {
  return 400 + 60 * (Math.max(1, Math.trunc(level)) - 1);
}
