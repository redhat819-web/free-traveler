/**
 * SCR-002 방문 국가 Chip — 30개국을 권역(region)별로 그룹지어 보여준다.
 */

import { representative } from "@/data/representative";

export function VisitedCountryChips() {
  const grouped = new Map<string, string[]>();
  for (const { country, region } of representative.visitedCountries) {
    const list = grouped.get(region) ?? [];
    list.push(country);
    grouped.set(region, list);
  }

  return (
    <section className="bg-bg-canvas px-gutter py-xl">
      <div className="mx-auto max-w-container-max">
        <h2 className="text-2xl font-semibold text-text-primary">방문한 국가</h2>
        <p className="mt-xs text-sm text-text-secondary">
          지금까지 발자취를 남긴 국가를 권역별로 모아봤습니다.
        </p>

        <div className="mt-lg flex flex-col gap-md">
          {Array.from(grouped.entries()).map(([region, countries]) => (
            <div key={region}>
              <h3 className="text-sm font-semibold text-text-muted">{region}</h3>
              <div className="mt-sm flex flex-wrap gap-sm">
                {countries.map((country) => (
                  <span
                    key={country}
                    className="flex min-h-11 items-center rounded-pill bg-bg-strong px-lg text-sm font-medium text-text-primary"
                  >
                    {country}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
