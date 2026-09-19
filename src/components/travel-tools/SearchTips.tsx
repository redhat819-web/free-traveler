/**
 * SCR-003 비전달 고지 + 찾기 Tip — 입력값 비전달 고지 문구 + Tip Card 3개.
 */

const TIPS = [
  {
    title: "가격 비교 사이트를 함께 쓰세요",
    description:
      "외부 사이트로 이동한 뒤에도 2~3개 검색엔진을 비교하면 더 저렴한 조건을 찾을 수 있습니다.",
  },
  {
    title: "날짜를 하루씩 앞뒤로 조정해보세요",
    description:
      "출발일이나 체크인 날짜를 하루만 옮겨도 요금이 크게 달라지는 경우가 많습니다.",
  },
  {
    title: "왕복/편도를 각각 검색해보세요",
    description: "항공편은 왕복 대신 편도 두 번을 조합하면 더 저렴할 때가 있습니다.",
  },
];

export function SearchTips() {
  return (
    <section className="bg-bg-canvas px-gutter py-lg">
      <div className="mx-auto max-w-container-max">
        <p className="rounded-md border border-border-hairline bg-bg-soft p-md text-sm text-text-secondary">
          입력한 국가·지역·날짜는 서버나 외부 사이트로 전달되지 않으며, 이 화면을 벗어나면
          사라집니다.
        </p>

        <div className="mt-md grid grid-cols-1 gap-md sm:grid-cols-3">
          {TIPS.map((tip) => (
            <div
              key={tip.title}
              className="rounded-md border border-border-hairline bg-bg-soft p-md"
            >
              <h3 className="text-sm font-semibold text-text-primary">{tip.title}</h3>
              <p className="mt-xs text-xs text-text-secondary">{tip.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
