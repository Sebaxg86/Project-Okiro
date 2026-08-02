export const XP_RULES = {
  weeklyPenaltyCap: 300,
  dailyBehaviorPenaltyCap: 40,
  weeklyTarget: 1_000,
  ordinaryWeeklyMaximum: 1_180,
} as const;

const recoveryTypes = new Set(["walking", "mobility", "yoga", "active_recovery"]);

export function workoutBaseXp(durationMinutes: number, workoutType: string) {
  const duration = Math.max(0, Math.trunc(durationMinutes));
  if (recoveryTypes.has(workoutType)) {
    if (duration < 30) return 0;
    if (duration < 45) return 20;
    if (duration < 60) return 30;
    return 40;
  }
  if (duration < 20) return 0;
  if (duration < 30) return 35;
  if (duration < 45) return 55;
  if (duration < 75) return 70;
  return 80;
}

export function sleepDurationXp(durationMinutes: number) {
  const duration = Math.max(0, Math.trunc(durationMinutes));
  if (duration >= 420 && duration <= 540) return 30;
  if ((duration >= 390 && duration <= 419) || (duration >= 541 && duration <= 570)) return 20;
  if ((duration >= 360 && duration <= 389) || (duration >= 571 && duration <= 600)) return 10;
  if (duration >= 300 && duration <= 359) return -10;
  if (duration < 300) return -25;
  return 0;
}

export function mealBaseXp(mealType: string, classification: string) {
  if (classification === "considerable_excess") return -15;
  if (mealType === "snack") return ["balanced", "adequate", "flexible"].includes(classification) ? 2 : -3;
  return { balanced: 10, adequate: 6, flexible: 2, out_of_plan: -8 }[classification] ?? -8;
}

export function hydrationDailyXp(totalMl: number, targetMl: number) {
  if (targetMl <= 0) return 0;
  const percentage = totalMl / targetMl * 100;
  if (percentage < 40) return 0;
  if (percentage < 60) return 4;
  if (percentage < 80) return 8;
  if (percentage < 100) return 12;
  return 15;
}

export function focusDailyXp(durationMinutes: number) {
  if (durationMinutes < 25) return 0;
  if (durationMinutes < 50) return 20;
  if (durationMinutes < 90) return 30;
  return 40;
}

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
