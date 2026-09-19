/**
 * SCR-002 여행 타임라인 — 연도·장소·한 줄 요약을 세로 타임라인으로 표시한다(8개 항목, 6개 이상 요건 충족).
 */

import { representative } from "@/data/representative";

export function TravelTimeline() {
  return (
    <section className="bg-bg-soft px-gutter py-xl">
      <div className="mx-auto max-w-container-max">
        <h2 className="text-2xl font-semibold text-text-primary">여행 타임라인</h2>
        <p className="mt-xs text-sm text-text-secondary">
          10년간의 여행 기록을 시간 순서로 정리했습니다.
        </p>

        <ol className="mt-lg flex flex-col gap-lg border-l-2 border-border-hairline pl-lg">
          {representative.timeline.map((entry) => (
            <li key={entry.year} className="relative">
              <span className="absolute -left-[calc(1.5rem+5px)] top-1 h-2.5 w-2.5 rounded-pill bg-accent-coral" />
              <span className="text-sm font-semibold text-accent-coral">{entry.year}</span>
              <h3 className="mt-xs text-base font-semibold text-text-primary">{entry.title}</h3>
              <p className="mt-xs text-sm text-text-secondary">{entry.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
