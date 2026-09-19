/**
 * 즐겨찾기 로컬 저장(REQ-FUNC-068). 서버에는 저장하지 않는다 — localStorage 전용.
 */

const STORAGE_KEY = "free_traveler.favorites";

function readAll(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function writeAll(ids: string[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function isFavorite(destinationId: string): boolean {
  return readAll().includes(destinationId);
}

export function toggleFavorite(destinationId: string): boolean {
  const current = readAll();
  const exists = current.includes(destinationId);
  const next = exists
    ? current.filter((id) => id !== destinationId)
    : [...current, destinationId];
  writeAll(next);
  return !exists;
}

export function listFavorites(): string[] {
  return readAll();
}
