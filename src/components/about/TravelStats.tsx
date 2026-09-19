/**
 * SCR-002 여행 지표 카드 — 좌우 2분할 통계 + 1줄 설명.
 * 수치는 src/data/representative.ts의 stats와 항상 일치시킨다(전역 대표명·수치 일치 Visual AC).
 */

import { representative } from "@/data/representative";

export function TravelStats() {
  return (
    <section className="bg-bg-soft px-gutter py-lg">
      <div className="mx-auto flex max-w-container-max flex-col items-center gap-sm text-center">
        <div className="grid w-full max-w-[28rem] grid-cols-2 gap-md">
          {representative.stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-xs rounded-md border border-border-hairline bg-bg-canvas p-lg"
            >
              <p className="text-3xl font-bold text-accent-coral">{stat.value}</p>
              <p className="text-sm text-text-secondary">{stat.label}</p>
            </div>
          ))}
        </div>
        <p className="max-w-[28rem] text-sm text-text-muted">10년간 쌓아온 기록입니다.</p>
      </div>
    </section>
  );
}
