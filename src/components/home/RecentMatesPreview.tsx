/**
 * SCR-001 Section 6 — 최근 동행 이야기 미리보기(모집중 3개) 또는 완성형 Empty State.
 * mates 테이블 조회는 공개 SELECT RLS 정책(select: true)을 사용하므로 로그인 여부와 무관하게 노출한다.
 * 신청자 개인 연락처는 이 미리보기에 포함하지 않는다(mate_applications 조회 없음).
 */

import { listOpenMates } from "@/lib/db/mates";

export async function RecentMatesPreview() {
  let mates: Awaited<ReturnType<typeof listOpenMates>> = [];
  try {
    mates = (await listOpenMates()).slice(0, 3);
  } catch {
    mates = [];
  }

  return (
    <section className="bg-bg-soft px-gutter py-xl">
      <div className="mx-auto max-w-container-max">
        <h2 className="text-2xl font-semibold text-text-primary">
          최근 동행 이야기
        </h2>
        <p className="mt-xs text-sm text-text-secondary">
          함께 여행할 동행을 찾고 있는 최신 모집글을 확인해보세요.
        </p>

        {mates.length > 0 ? (
          <div className="mt-lg grid grid-cols-1 gap-md sm:grid-cols-3">
            {mates.map((mate) => (
              <a
                key={mate.id}
                href="/mates"
                className="flex flex-col gap-sm rounded-md border border-border-hairline bg-bg-canvas p-md hover:shadow-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
              >
                <span className="text-xs text-text-muted">
                  {mate.country} · {mate.region}
                </span>
                <h3 className="text-base font-semibold text-text-primary">
                  {mate.title}
                </h3>
                <span className="text-sm text-semantic-info">
                  모집중 · 정원 {mate.capacity}명
                </span>
              </a>
            ))}
          </div>
        ) : (
          <div className="mt-lg rounded-md border border-border-hairline bg-bg-canvas p-lg text-center">
            <p className="text-sm text-text-secondary">
              아직 모집중인 동행 이야기가 없습니다. 첫 동행 모집글을
              작성해보세요.
            </p>
            <p className="mt-xs text-xs text-text-muted">
              여행 스타일이 맞는 동행을 찾고 싶다면, 국가·기간·인원을 정해
              모집글을 올리면 됩니다.
            </p>
            <div className="mt-md flex flex-wrap justify-center gap-sm">
              <a
                href="/travel-tools"
                className="rounded-pill bg-accent-coral px-md py-xs text-sm font-semibold text-bg-canvas hover:bg-accent-coral-active focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
              >
                동행 글 작성하기
              </a>
              <a
                href="/mates"
                className="rounded-pill border border-border-hairline px-md py-xs text-sm text-text-primary hover:bg-bg-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
              >
                전체 동행 보기
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
