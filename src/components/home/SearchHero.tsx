"use client";

/**
 * SCR-001 Section 1 — 여행지 검색 Hero.
 * 뷰포트 60~70% 높이로 다음 Section 시작이 첫 화면에 살짝 보이도록 한다(D-001/UI_CONTRACT SCR-001 규칙).
 * 키워드는 여행지 국가/도시/테마 통합 검색(부분 일치)이며, DestinationGrid의 검색어 상태와 연동한다.
 */

import { useState } from "react";

export function SearchHero({
  onSearch,
}: {
  onSearch?: (keyword: string) => void;
}) {
  const [keyword, setKeyword] = useState("");

  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center gap-lg bg-bg-canvas px-gutter py-xl text-center lg:min-h-[65vh]">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold text-text-primary sm:text-4xl">
          다음 여행지, 직접 걸어본 사람의 기록으로 고르세요
        </h1>
        <p className="mt-md text-base text-text-secondary">
          국내외 여행지의 동선·예산·안전정보를 한 곳에서 확인하고,
          나라·도시·테마로 원하는 곳을 바로 찾아보세요.
        </p>
      </div>

      <form
        role="search"
        className="flex w-full max-w-[36rem] items-center gap-sm"
        onSubmit={(event) => {
          event.preventDefault();
          onSearch?.(keyword.trim());
        }}
      >
        <input
          type="search"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="국가, 도시, 테마로 검색 (예: 제주, 오사카, 해변)"
          aria-label="여행지 검색"
          maxLength={50}
          className="w-full rounded-pill border border-border-hairline bg-bg-soft px-lg py-sm text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        />
        <button
          type="submit"
          className="whitespace-nowrap rounded-pill bg-accent-coral px-lg py-sm text-sm font-semibold text-bg-canvas hover:bg-accent-coral-active focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
          검색
        </button>
      </form>

      <a
        href="/travel-tools"
        className="rounded-sm text-sm font-semibold text-accent-coral underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
      >
        여행 조건부터 정리하기 →
      </a>
    </section>
  );
}
