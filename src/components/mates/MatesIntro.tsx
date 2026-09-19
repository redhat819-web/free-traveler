import Link from "next/link";

/**
 * SCR-004 Intro(축소형 Hero) — 제목 + 설명 2문장 + "새 동행 글 작성하기" CTA.
 * SCR-001 Hero와 달리 뷰포트 대부분을 차지하지 않고, 바로 다음 Section(Filter)이 보이게 한다.
 */
export function MatesIntro() {
  return (
    <section className="bg-bg-canvas px-gutter py-lg">
      <div className="mx-auto max-w-container-max text-center">
        <h1 className="text-2xl font-semibold text-text-primary sm:text-3xl">
          믿을 수 있는 동행을 찾아보세요
        </h1>
        <p className="mt-xs text-sm text-text-secondary">
          국가·지역·기간이 맞는 동행 모집글을 둘러보고 참가를 요청할 수
          있습니다. 안전을 위해 신고·차단 기능도 함께 제공합니다.
        </p>

        <Link
          href="/travel-tools"
          className="mt-md inline-flex min-h-[44px] items-center justify-center rounded-pill bg-accent-coral px-lg text-sm font-semibold text-bg-canvas hover:bg-accent-coral-active focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
          새 동행 글 작성하기
        </Link>
      </div>
    </section>
  );
}
