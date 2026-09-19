/**
 * SCR-002 기억에 남는 여행지 + CTA — 4개 Card와 다른 화면으로 이동하는 CTA 2개.
 * 문의/SNS 링크는 src/data/representative.ts에 값이 없으므로(빈 값) 렌더링하지 않는다.
 * 만약 값이 추가되면 https/mailto 프로토콜만 렌더링해야 한다.
 * country/city가 destinations.ts와 일치하는 Card는 SCR-001의 해당 여행지 Drawer로 연결한다
 * (UI_CONTRACT SCR-002 "다른 화면으로의 이동" 규칙).
 */

import Image from "next/image";
import { destinations } from "@/data/destinations";
import { representative } from "@/data/representative";

export function MemorableDestinations() {
  return (
    <section className="bg-bg-canvas px-gutter py-xl">
      <div className="mx-auto max-w-container-max">
        <h2 className="text-2xl font-semibold text-text-primary">가장 기억에 남는 여행지</h2>
        <p className="mt-xs text-sm text-text-secondary">
          수많은 여행 중에서도 유독 마음에 남은 네 곳을 꼽아봤습니다.
        </p>

        <div className="mt-lg grid grid-cols-1 gap-md sm:grid-cols-2">
          {representative.memorableDestinations.map((item) => {
            const matched = destinations.find(
              (d) => d.country === item.country && d.city === item.city,
            );
            const href = matched ? `/?destination=${matched.id}` : undefined;

            const card = (
              <>
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-bg-strong">
                  <Image
                    src={item.image.url}
                    alt={item.image.alt}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-xs p-md">
                  <span className="text-xs text-text-muted">
                    {item.country} · {item.city}
                  </span>
                  <p className="text-sm text-text-secondary">{item.memory}</p>
                </div>
              </>
            );

            const className =
              "flex flex-col overflow-hidden rounded-md border border-border-hairline bg-bg-soft";

            return href ? (
              <a
                key={`${item.country}-${item.city}`}
                href={href}
                className={`${className} hover:shadow-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring`}
              >
                {card}
              </a>
            ) : (
              <div key={`${item.country}-${item.city}`} className={className}>
                {card}
              </div>
            );
          })}
        </div>

        <div className="mt-lg flex flex-wrap justify-center gap-sm">
          <a
            href="/travel-tools"
            className="rounded-pill bg-accent-coral px-lg py-sm text-sm font-semibold text-bg-canvas hover:bg-accent-coral-active focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          >
            나도 여행 준비하기
          </a>
          <a
            href="/mates"
            className="rounded-pill border border-border-hairline px-lg py-sm text-sm text-text-primary hover:bg-bg-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          >
            동행 찾아보기
          </a>
        </div>
      </div>
    </section>
  );
}
