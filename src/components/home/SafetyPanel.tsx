"use client";

/**
 * SCR-001 Section 5 — 국가별 주의사항 Card Grid + 안전정보 상세.
 * 8개 카테고리(치안·사기·법규·교통·재난·보건·문화·긴급연락처)와 출처·확인일을 표시하고,
 * 7일 초과 시 stale 배지를 색상+텍스트로 병행 노출한다.
 */

import { useMemo, useRef, useState } from "react";
import { countrySafety } from "@/data/safety";
import { useDialogA11y } from "@/hooks/useDialogA11y";

const STALE_THRESHOLD_DAYS = 7;

function daysSince(dateText: string): number {
  const then = new Date(dateText).getTime();
  const now = Date.now();
  return Math.floor((now - then) / (1000 * 60 * 60 * 24));
}

type TextCategoryKey =
  | "security"
  | "scam"
  | "law"
  | "traffic"
  | "disaster"
  | "health"
  | "culture"
  | "emergencyContacts";

const CATEGORY_LABELS: { key: TextCategoryKey; label: string }[] = [
  { key: "security", label: "치안" },
  { key: "scam", label: "사기" },
  { key: "law", label: "법규" },
  { key: "traffic", label: "교통" },
  { key: "disaster", label: "재난" },
  { key: "health", label: "보건" },
  { key: "culture", label: "문화" },
  { key: "emergencyContacts", label: "긴급연락처" },
];

export function SafetyPanel({ initialCountry }: { initialCountry?: string }) {
  const featured = useMemo(() => countrySafety.slice(0, 6), []);
  const [openCountry, setOpenCountry] = useState<string | null>(initialCountry ?? null);

  const openEntry = countrySafety.find((entry) => entry.country === openCountry) ?? null;
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useDialogA11y(Boolean(openEntry), () => setOpenCountry(null), dialogRef);

  return (
    <section className="bg-bg-soft px-gutter py-xl">
      <div className="mx-auto max-w-container-max">
        <h2 className="text-2xl font-semibold text-text-primary">국가별 주의사항</h2>
        <p className="mt-xs text-sm text-text-secondary">
          외교부 등 공식 출처를 바탕으로 정리한 안전정보이며, 최종 확인일 기준 7일이
          지나면 최신 여부를 다시 확인해야 합니다.
        </p>

        <div className="mt-lg grid grid-cols-1 gap-md sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((entry) => {
            const stale = daysSince(entry.source.lastVerified) > STALE_THRESHOLD_DAYS;
            return (
              <button
                key={entry.id}
                type="button"
                onClick={() => setOpenCountry(entry.country)}
                className="flex flex-col gap-sm rounded-md border border-border-hairline bg-bg-canvas p-md text-left hover:shadow-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-text-primary">{entry.country}</h3>
                  <span
                    className={`rounded-pill px-sm py-2xs text-xs font-semibold ${
                      stale
                        ? "bg-semantic-warning/10 text-semantic-warning"
                        : "bg-semantic-success/10 text-semantic-success"
                    }`}
                  >
                    {stale ? "재확인 필요" : "최신 확인됨"}
                  </span>
                </div>
                <p className="line-clamp-2 text-sm text-text-secondary">{entry.security}</p>
                <span className="text-xs text-text-muted">
                  확인일 {entry.source.lastVerified}
                </span>
              </button>
            );
          })}
        </div>

        {openEntry && (
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${openEntry.country} 안전정보`}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
            onClick={() => setOpenCountry(null)}
          >
            <div
              className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-t-md bg-bg-canvas p-lg shadow-card sm:rounded-md"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-md">
                <h3 className="text-xl font-semibold text-text-primary">
                  {openEntry.country} 안전정보
                </h3>
                <button
                  type="button"
                  onClick={() => setOpenCountry(null)}
                  aria-label="닫기"
                  className="rounded-sm px-xs text-text-muted hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                >
                  ✕
                </button>
              </div>

              <p className="mt-sm rounded-sm bg-bg-soft p-sm text-xs text-text-secondary">
                본 안전정보는 참고용 안내이며, 실제 여행 전 외교부 등 공식 채널에서 최신
                정보를 다시 확인해야 합니다.
              </p>

              <dl className="mt-md grid grid-cols-1 gap-md sm:grid-cols-2">
                {CATEGORY_LABELS.map(({ key, label }) => (
                  <div key={key}>
                    <dt className="text-sm font-semibold text-text-primary">{label}</dt>
                    <dd className="mt-2xs text-sm text-text-secondary">{openEntry[key]}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-lg flex flex-wrap items-center justify-between gap-sm border-t border-border-hairline pt-md text-xs text-text-muted">
                <span>
                  출처: {openEntry.source.name} · 확인일 {openEntry.source.lastVerified} · 작성:{" "}
                  {openEntry.source.editor}
                </span>
                <a
                  href={openEntry.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-sm font-semibold text-accent-coral underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                >
                  원문 보기 →
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
