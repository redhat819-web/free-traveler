"use client";

/**
 * SCR-004 동행 조회 화면 조립.
 * 새 Component를 만들지 않고, 이미 만들어진 CMP-SCR004-* Component를 이 Page Entry에서
 * 조립만 한다(CLAUDE.md 규칙 9). 목록/상세/필터 상태는 이 파일에서만 관리한다.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { listOpenMates } from "@/lib/db/mates";
import { createClient } from "@/lib/db/browser-client";
import { isMateClosed } from "@/lib/mate-state";
import { MatesIntro } from "@/components/mates/MatesIntro";
import {
  MateFilterBar,
  DEFAULT_MATE_FILTER,
  type MateFilterState,
} from "@/components/mates/MateFilterBar";
import { MatePostList } from "@/components/mates/MatePostList";
import { MateDetailPanel } from "@/components/mates/MateDetailPanel";
import { JoinRequestForm } from "@/components/mates/JoinRequestForm";
import { ReportForm } from "@/components/mates/ReportForm";
import { BlockButton } from "@/components/mates/BlockButton";
import type { Mate } from "@/lib/db/types";

const HOW_TO_JOIN_STEPS = [
  { step: "1", title: "모집글 선택", description: "조건에 맞는 동행 모집글을 목록에서 선택합니다." },
  { step: "2", title: "참가 요청", description: "비공개 메시지와 함께 참가 요청을 보냅니다." },
  { step: "3", title: "승인 확인", description: "작성자의 승인/거절 결과를 확인합니다." },
];

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function countMatches(mates: Mate[], filters: MateFilterState, today: string): number {
  return mates.filter((mate) => {
    if (filters.country && mate.country !== filters.country) return false;
    if (filters.region && mate.region !== filters.region) return false;
    if (filters.startDate && mate.end_date < filters.startDate) return false;
    if (filters.endDate && mate.start_date > filters.endDate) return false;

    const closed = isMateClosed(mate, today);
    if (filters.status === "open" && closed) return false;
    if (filters.status === "closed" && !closed) return false;
    return true;
  }).length;
}

function ListDetailSkeleton() {
  return (
    <div className="mx-auto grid max-w-container-max grid-cols-1 gap-md px-gutter py-lg lg:grid-cols-[40%_60%]">
      <div className="grid grid-cols-1 gap-sm sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-32 animate-pulse rounded-md bg-bg-strong" />
        ))}
      </div>
      <div className="hidden h-64 animate-pulse rounded-md bg-bg-strong lg:block" />
    </div>
  );
}

export default function MatesPage() {
  const [mates, setMates] = useState<Mate[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [filters, setFilters] = useState<MateFilterState>(DEFAULT_MATE_FILTER);
  const [filterResetKey, setFilterResetKey] = useState(0);
  const [selectedMate, setSelectedMate] = useState<Mate | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  const loadMates = async () => {
    setLoadError(false);
    setLoading(true);
    try {
      const list = await listOpenMates();
      setMates(list);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await loadMates();
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUserId(user?.id ?? null);
      } finally {
        setSessionLoading(false);
      }
    })();
  }, []);

  const today = todayIso();
  const resultCount = countMatches(mates, filters, today);

  return (
    <>
      <MatesIntro />

      {loading || sessionLoading ? (
        <ListDetailSkeleton />
      ) : loadError ? (
        <section className="bg-bg-canvas px-gutter py-lg">
          <div className="mx-auto max-w-container-max rounded-md border border-border-hairline bg-bg-soft p-lg text-center">
            <p className="text-sm font-semibold text-text-primary">
              동행 목록을 불러오지 못했습니다.
            </p>
            <button
              type="button"
              onClick={loadMates}
              className="mt-sm min-h-[44px] rounded-pill bg-accent-coral px-lg text-sm font-semibold text-bg-canvas hover:bg-accent-coral-active"
            >
              다시 시도
            </button>
          </div>
        </section>
      ) : (
        <>
          <MateFilterBar
            key={filterResetKey}
            resultCount={resultCount}
            onFilterChange={setFilters}
          />

          {resultCount === 0 && (
            <section className="bg-bg-canvas px-gutter pb-md">
              <div className="mx-auto flex max-w-container-max flex-wrap items-center justify-center gap-sm">
                <button
                  type="button"
                  onClick={() => {
                    setFilters(DEFAULT_MATE_FILTER);
                    setFilterResetKey((key) => key + 1);
                  }}
                  className="min-h-[44px] rounded-pill border border-border-hairline px-md text-sm font-semibold text-text-primary hover:bg-bg-strong"
                >
                  검색 조건 초기화
                </button>
                <Link
                  href="/travel-tools"
                  className="min-h-[44px] rounded-pill bg-accent-coral px-md text-sm font-semibold text-bg-canvas hover:bg-accent-coral-active"
                >
                  동행 글 작성하기
                </Link>
              </div>
            </section>
          )}

          <section className="bg-bg-canvas px-gutter py-lg">
            <div className="mx-auto grid max-w-container-max grid-cols-1 gap-md lg:grid-cols-[40%_60%]">
              <MatePostList
                mates={mates}
                filters={filters}
                onSelect={setSelectedMate}
                selectedId={selectedMate?.id ?? null}
              />

              <MateDetailPanel
                mate={selectedMate}
                todayIso={today}
                onClose={() => setSelectedMate(null)}
              >
                {selectedMate && !userId && (
                  <div className="rounded-md border border-border-hairline bg-bg-soft p-md text-sm text-text-secondary">
                    참가 요청·신고·차단은 로그인 후 이용할 수 있습니다.{" "}
                    <Link href="/account" className="font-semibold text-accent-coral">
                      로그인/가입하기
                    </Link>
                  </div>
                )}

                {selectedMate && userId && (
                  <div className="flex flex-col gap-md">
                    <JoinRequestForm
                      mateId={selectedMate.id}
                      currentUserId={userId}
                      isAuthor={userId === selectedMate.author_id}
                    />
                    {userId !== selectedMate.author_id && (
                      <div className="flex flex-wrap gap-sm">
                        <ReportForm targetMateId={selectedMate.id} />
                        <BlockButton
                          targetMemberId={selectedMate.author_id}
                          targetLabel="작성자"
                          onBlocked={() => setSelectedMate(null)}
                        />
                      </div>
                    )}
                  </div>
                )}
              </MateDetailPanel>
            </div>
          </section>
        </>
      )}

      <section className="bg-bg-soft px-gutter py-lg">
        <div className="mx-auto max-w-container-max">
          <h2 className="text-lg font-semibold text-text-primary">참가 신청 방법</h2>
          <ol className="mt-md grid grid-cols-1 gap-md sm:grid-cols-3">
            {HOW_TO_JOIN_STEPS.map((item) => (
              <li
                key={item.step}
                className="rounded-md border border-border-hairline bg-bg-canvas p-md text-left"
              >
                <span className="text-xs font-semibold text-accent-coral">STEP {item.step}</span>
                <h3 className="mt-xs text-sm font-semibold text-text-primary">{item.title}</h3>
                <p className="mt-xs text-xs text-text-secondary">{item.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-bg-canvas px-gutter py-lg">
        <div className="mx-auto flex max-w-container-max flex-col items-center gap-sm rounded-md border border-border-hairline bg-bg-soft p-lg text-center">
          <h2 className="text-lg font-semibold text-text-primary">안전하게 동행을 구해보세요</h2>
          <p className="max-w-2xl text-sm text-text-secondary">
            연락처는 참가 요청이 승인된 이후에만 별도 채널로 직접 나눠주세요. 부적절한 활동은
            신고 버튼으로 즉시 알려주시고, 불편한 상대는 차단할 수 있습니다.
          </p>
          <Link
            href="/travel-tools"
            className="mt-xs min-h-[44px] rounded-pill bg-accent-coral px-lg py-sm text-sm font-semibold text-bg-canvas hover:bg-accent-coral-active"
          >
            새 동행 글 작성하기
          </Link>
        </div>
      </section>
    </>
  );
}
