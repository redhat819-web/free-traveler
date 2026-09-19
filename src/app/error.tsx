"use client";

import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="bg-bg-canvas px-gutter py-xl">
      <div className="mx-auto flex max-w-container-max flex-col items-center gap-md py-xl text-center">
        <p className="text-sm font-semibold text-semantic-danger">오류가 발생했습니다</p>
        <h1 className="text-2xl font-semibold text-text-primary">
          일시적인 문제로 페이지를 표시할 수 없습니다
        </h1>
        <p className="max-w-md text-sm text-text-secondary">
          잠시 후 다시 시도해 주세요. 문제가 계속되면 메인 화면에서 다시 접속해 보세요.
        </p>
        <div className="mt-sm flex flex-wrap justify-center gap-sm">
          <button
            type="button"
            onClick={reset}
            className="min-h-[44px] rounded-pill bg-accent-coral px-lg py-sm text-sm font-semibold text-bg-canvas hover:bg-accent-coral-active focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          >
            다시 시도
          </button>
          <Link
            href="/"
            className="min-h-[44px] rounded-pill border border-border-hairline px-lg py-sm text-sm font-semibold text-text-primary hover:bg-bg-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          >
            메인으로 이동
          </Link>
        </div>
      </div>
    </section>
  );
}
