"use client";

/**
 * SCR-004 동행글 목록 — 최대 8개 우선 노출, 그 이상은 "더 보기".
 * 저장된 status가 open이어도 end_date가 조회 시점을 지났으면 CLOSED로 표시한다(REQ-FUNC-037).
 */

import { useMemo, useState } from "react";
import { isMateClosed } from "@/lib/mate-state";
import type { Mate } from "@/lib/db/types";
import type { MateFilterState } from "./MateFilterBar";

const PAGE_SIZE = 8;

interface MatePostListProps {
  mates: Mate[];
  filters: MateFilterState;
  onSelect: (mate: Mate) => void;
  selectedId?: string | null;
}

function overlaps(mate: Mate, filters: MateFilterState): boolean {
  if (filters.startDate && mate.end_date < filters.startDate) return false;
  if (filters.endDate && mate.start_date > filters.endDate) return false;
  return true;
}

function applyFilters(mates: Mate[], filters: MateFilterState, todayIso: string): Mate[] {
  return mates.filter((mate) => {
    if (filters.country && mate.country !== filters.country) return false;
    if (filters.region && mate.region !== filters.region) return false;
    if (!overlaps(mate, filters)) return false;

    const closed = isMateClosed(mate, todayIso);
    if (filters.status === "open" && closed) return false;
    if (filters.status === "closed" && !closed) return false;

    return true;
  });
}

export function MatePostList({ mates, filters, onSelect, selectedId }: MatePostListProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const todayIso = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const filtered = useMemo(
    () => applyFilters(mates, filters, todayIso),
    [mates, filters, todayIso],
  );
  const visible = filtered.slice(0, visibleCount);

  if (filtered.length === 0) {
    return (
      <section className="bg-bg-canvas px-gutter py-lg">
        <div className="mx-auto max-w-container-max rounded-md border border-border-hairline bg-bg-soft p-lg text-center">
          <p className="text-sm font-semibold text-text-primary">
            조건에 맞는 모집글이 아직 없습니다.
          </p>
          <p className="mt-xs text-sm text-text-secondary">
            검색 조건을 초기화하거나 나중에 다시 확인해보세요. 새 동행 글을 직접 작성할 수도
            있습니다.
          </p>
          <p className="mt-xs text-xs text-text-secondary">
            참가 요청 방법: 1) 관심 있는 모집글을 선택 → 2) 참가 요청 메시지 작성 → 3) 작성자의
            승인/거절 확인
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-bg-canvas px-gutter py-lg">
      <div className="mx-auto max-w-container-max">
        <ul className="grid grid-cols-1 gap-sm sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((mate) => {
            const closed = isMateClosed(mate, todayIso);
            return (
              <li key={mate.id}>
                <button
                  type="button"
                  onClick={() => onSelect(mate)}
                  aria-pressed={selectedId === mate.id}
                  className={`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring min-h-[44px] w-full rounded-md border p-md text-left ${
                    selectedId === mate.id
                      ? "border-accent-coral bg-accent-coral-soft"
                      : "border-border-hairline bg-bg-soft"
                  }`}
                >
                  <span
                    className={`inline-block rounded-pill px-sm py-xs text-xs font-semibold ${
                      closed
                        ? "bg-bg-strong text-text-secondary"
                        : "bg-accent-coral-soft text-accent-coral"
                    }`}
                  >
                    {closed ? "CLOSED" : "모집중"}
                  </span>
                  <h3 className="mt-xs text-sm font-semibold text-text-primary">{mate.title}</h3>
                  <p className="mt-xs text-xs text-text-secondary">
                    {mate.country} · {mate.region}
                  </p>
                  <p className="mt-xs text-xs text-text-secondary">
                    {mate.start_date} ~ {mate.end_date}
                  </p>
                </button>
              </li>
            );
          })}
        </ul>

        {visibleCount < filtered.length && (
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            className="mt-md min-h-[44px] w-full rounded-pill border border-border-hairline px-md text-sm font-semibold text-text-primary hover:bg-bg-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          >
            더 보기
          </button>
        )}
      </div>
    </section>
  );
}
