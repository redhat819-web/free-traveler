/**
 * SCR-003 Intro(축소형 Hero) — 제목 + 이용 순서 3단계 요약.
 * SCR-001 Hero와 달리 뷰포트 대부분을 차지하지 않고, 바로 다음 Section(탭)이 보이게 한다.
 */

const STEPS = [
  {
    step: "1",
    title: "조건 입력",
    description: "국가·지역·날짜를 입력하면 됩니다.",
  },
  {
    step: "2",
    title: "요약 확인",
    description: "입력한 조건이 한눈에 요약됩니다.",
  },
  {
    step: "3",
    title: "외부에서 검색",
    description: "새 탭에서 실제 항공·숙소를 찾습니다.",
  },
];

export function ToolsIntro() {
  return (
    <section className="bg-bg-canvas px-gutter py-lg">
      <div className="mx-auto max-w-container-max text-center">
        <h1 className="text-2xl font-semibold text-text-primary sm:text-3xl">
          여행 준비, 조건만 정리하면 나머지는 밖에서
        </h1>
        <p className="mt-xs text-sm text-text-secondary">
          항공·숙소는 실시간 가격 비교나 예약을 대신하지 않고, 조건을 정리해
          외부 사이트로 안내합니다.
        </p>

        <ol className="mt-lg grid grid-cols-1 gap-md sm:grid-cols-3">
          {STEPS.map((item) => (
            <li
              key={item.step}
              className="rounded-md border border-border-hairline bg-bg-soft p-md text-left"
            >
              <span className="text-xs font-semibold text-accent-coral">
                STEP {item.step}
              </span>
              <h2 className="mt-xs text-sm font-semibold text-text-primary">
                {item.title}
              </h2>
              <p className="mt-xs text-xs text-text-secondary">
                {item.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
