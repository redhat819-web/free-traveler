"use client";

/**
 * SCR-004 검색 Filter + 결과 요약.
 * 필터 상태만 관리하고 실제 조회는 부모(목록 Component)가 담당한다.
 * 차단 사용자 글 제외는 DB-ACCESS 조회 계층(RLS/쿼리)에서 처리한다.
 */

import { useState } from "react";
import type { AgeGroup, Gender, MateStatus } from "@/lib/db/types";

const COUNTRY_REGIONS: Record<string, string[]> = {
  전체: [],
  일본: ["오사카", "도쿄", "삿포로", "후쿠오카"],
  베트남: ["다낭", "호이안", "호치민"],
  태국: ["방콕", "치앙마이", "푸켓"],
  프랑스: ["파리", "니스"],
  이탈리아: ["로마", "베네치아", "밀라노"],
  대한민국: ["제주", "부산", "강릉", "서울"],
};

const AGE_GROUPS: { value: AgeGroup; label: string }[] = [
  { value: "10s", label: "10대" },
  { value: "20s", label: "20대" },
  { value: "30s", label: "30대" },
  { value: "40s", label: "40대" },
  { value: "50s", label: "50대" },
  { value: "60_plus", label: "60대 이상" },
];

const GENDERS: { value: Gender; label: string }[] = [
  { value: "male", label: "남성" },
  { value: "female", label: "여성" },
  { value: "other", label: "그 외" },
  { value: "prefer_not_to_say", label: "선택 안 함" },
];

const STYLES = [
  "힐링",
  "액티비티",
  "맛집 탐방",
  "사진 촬영",
  "쇼핑",
  "배낭여행",
];

export interface MateFilterState {
  country: string;
  region: string;
  startDate: string;
  endDate: string;
  ageGroups: AgeGroup[];
  genders: Gender[];
  styles: string[];
  status: MateStatus | "all";
}

export const DEFAULT_MATE_FILTER: MateFilterState = {
  country: "",
  region: "",
  startDate: "",
  endDate: "",
  ageGroups: [],
  genders: [],
  styles: [],
  status: "open",
};

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

interface MateFilterBarProps {
  resultCount: number;
  onFilterChange: (filters: MateFilterState) => void;
}

export function MateFilterBar({
  resultCount,
  onFilterChange,
}: MateFilterBarProps) {
  const [filters, setFilters] = useState<MateFilterState>(DEFAULT_MATE_FILTER);

  const update = (next: MateFilterState) => {
    setFilters(next);
    onFilterChange(next);
  };

  const regions = filters.country
    ? (COUNTRY_REGIONS[filters.country] ?? [])
    : [];

  return (
    <section
      className="bg-bg-canvas px-gutter py-md"
      aria-label="동행 검색 필터"
    >
      <div className="mx-auto max-w-container-max">
        <div className="grid grid-cols-1 gap-sm sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-xs text-sm text-text-secondary">
            국가
            <select
              className="min-h-[44px] rounded-sm border border-border-hairline bg-bg-canvas px-sm text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
              value={filters.country}
              onChange={(e) =>
                update({ ...filters, country: e.target.value, region: "" })
              }
            >
              <option value="">전체</option>
              {Object.keys(COUNTRY_REGIONS)
                .filter((c) => c !== "전체")
                .map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
            </select>
          </label>

          <label className="flex flex-col gap-xs text-sm text-text-secondary">
            지역
            <select
              className="min-h-[44px] rounded-sm border border-border-hairline bg-bg-canvas px-sm text-text-primary disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
              value={filters.region}
              disabled={!filters.country}
              onChange={(e) => update({ ...filters, region: e.target.value })}
            >
              <option value="">전체</option>
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-xs text-sm text-text-secondary">
            여행 시작일(이후)
            <input
              type="date"
              className="min-h-[44px] rounded-sm border border-border-hairline bg-bg-canvas px-sm text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
              value={filters.startDate}
              onChange={(e) =>
                update({ ...filters, startDate: e.target.value })
              }
            />
          </label>

          <label className="flex flex-col gap-xs text-sm text-text-secondary">
            여행 종료일(이전)
            <input
              type="date"
              className="min-h-[44px] rounded-sm border border-border-hairline bg-bg-canvas px-sm text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
              value={filters.endDate}
              onChange={(e) => update({ ...filters, endDate: e.target.value })}
            />
          </label>
        </div>

        <div className="mt-sm flex flex-col gap-xs">
          <span className="text-xs font-semibold text-text-secondary">
            연령대
          </span>
          <div className="flex flex-wrap gap-xs">
            {AGE_GROUPS.map((item) => (
              <button
                key={item.value}
                type="button"
                aria-pressed={filters.ageGroups.includes(item.value)}
                className={`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring min-h-[44px] rounded-pill px-sm text-sm font-medium ${
                  filters.ageGroups.includes(item.value)
                    ? "bg-accent-coral-soft text-text-primary"
                    : "bg-bg-strong text-text-secondary"
                }`}
                onClick={() =>
                  update({
                    ...filters,
                    ageGroups: toggle(filters.ageGroups, item.value),
                  })
                }
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-sm flex flex-col gap-xs">
          <span className="text-xs font-semibold text-text-secondary">
            성별
          </span>
          <div className="flex flex-wrap gap-xs">
            {GENDERS.map((item) => (
              <button
                key={item.value}
                type="button"
                aria-pressed={filters.genders.includes(item.value)}
                className={`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring min-h-[44px] rounded-pill px-sm text-sm font-medium ${
                  filters.genders.includes(item.value)
                    ? "bg-accent-coral-soft text-text-primary"
                    : "bg-bg-strong text-text-secondary"
                }`}
                onClick={() =>
                  update({
                    ...filters,
                    genders: toggle(filters.genders, item.value),
                  })
                }
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-sm flex flex-col gap-xs">
          <span className="text-xs font-semibold text-text-secondary">
            여행 스타일
          </span>
          <div className="flex flex-wrap gap-xs">
            {STYLES.map((style) => (
              <button
                key={style}
                type="button"
                aria-pressed={filters.styles.includes(style)}
                className={`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring min-h-[44px] rounded-pill px-sm text-sm font-medium ${
                  filters.styles.includes(style)
                    ? "bg-accent-coral-soft text-text-primary"
                    : "bg-bg-strong text-text-secondary"
                }`}
                onClick={() =>
                  update({ ...filters, styles: toggle(filters.styles, style) })
                }
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-sm flex flex-col gap-xs">
          <span className="text-xs font-semibold text-text-secondary">
            모집 상태
          </span>
          <div className="flex flex-wrap gap-xs">
            {(
              [
                { value: "open", label: "모집중" },
                { value: "closed", label: "마감" },
                { value: "all", label: "전체" },
              ] as const
            ).map((item) => (
              <button
                key={item.value}
                type="button"
                aria-pressed={filters.status === item.value}
                className={`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring min-h-[44px] rounded-pill px-sm text-sm font-medium ${
                  filters.status === item.value
                    ? "bg-accent-coral-soft text-text-primary"
                    : "bg-bg-strong text-text-secondary"
                }`}
                onClick={() => update({ ...filters, status: item.value })}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <p
          className="mt-sm text-sm font-semibold text-text-primary"
          role="status"
        >
          조건에 맞는 모집글 {resultCount}건
        </p>
      </div>
    </section>
  );
}
