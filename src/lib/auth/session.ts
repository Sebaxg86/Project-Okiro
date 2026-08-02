export const INACTIVITY_LIMIT_MS = 15 * 24 * 60 * 60 * 1000;

export function sessionIsInactive(lastActiveAt: string | null | undefined, now = new Date()) {
  if (!lastActiveAt) return false;

  const lastActive = new Date(lastActiveAt).getTime();
  return Number.isFinite(lastActive) && now.getTime() - lastActive >= INACTIVITY_LIMIT_MS;
}

export function shouldRefreshActivity(lastActiveAt: string | null | undefined, now = new Date()) {
  if (!lastActiveAt) return true;

  const lastActive = new Date(lastActiveAt).getTime();
  return !Number.isFinite(lastActive) || now.getTime() - lastActive >= 5 * 60 * 1000;
}
