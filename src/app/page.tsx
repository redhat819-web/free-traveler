import type { Metadata } from "next";
import { SearchHero } from "@/components/home/SearchHero";
import { DestinationGrid } from "@/components/home/DestinationGrid";
import { DestinationDrawer } from "@/components/home/DestinationDrawer";
import { SafetyPanel } from "@/components/home/SafetyPanel";
import { RecentMatesPreview } from "@/components/home/RecentMatesPreview";
import { representative } from "@/data/representative";

const THEME_CHIPS = ["미식", "역사 유적", "해변", "자연 경관", "야경", "힐링"];

const PAGE_TITLE = "국내·해외 여행지, 안전정보, 동행 찾기";
const PAGE_DESCRIPTION =
  "무료로 여행지 정보와 국가별 안전정보를 확인하고, 함께 떠날 동행을 찾아보세요.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: "/",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "free_traveler",
  url: "/",
  description: PAGE_DESCRIPTION,
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SearchHero />

      <div id="destinations">
        <DestinationGrid />
      </div>

      <section className="bg-bg-soft px-gutter py-xl">
        <div className="mx-auto max-w-container-max">
          <h2 className="text-2xl font-semibold text-text-primary">
            여행 동기로 찾아보기
          </h2>
          <p className="mt-xs text-sm text-text-secondary">
            어떤 이유로 떠나고 싶은지부터 정하면 여행지를 고르기가 훨씬
            쉬워집니다.
          </p>
          <div className="mt-lg flex flex-wrap gap-sm">
            {THEME_CHIPS.map((theme) => (
              <a
                key={theme}
                href={`/?theme=${encodeURIComponent(theme)}#destinations`}
                className="rounded-pill bg-bg-strong px-lg py-sm text-sm font-medium text-text-primary hover:bg-accent-coral-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
              >
                {theme}
              </a>
            ))}
          </div>
        </div>
      </section>

      <SafetyPanel />

      <RecentMatesPreview />

      <section className="bg-bg-canvas px-gutter py-xl">
        <div className="mx-auto flex max-w-container-max flex-col items-center gap-md rounded-md border border-border-hairline bg-bg-soft p-xl text-center">
          <h2 className="text-2xl font-semibold text-text-primary">
            {representative.name}
          </h2>
          <p className="max-w-2xl text-base text-text-secondary">
            {representative.tagline}
          </p>
          <div className="flex gap-lg">
            {representative.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-semibold text-accent-coral">
                  {stat.value}
                </p>
                <p className="text-xs text-text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-sm flex flex-wrap justify-center gap-sm">
            <a
              href="/about"
              className="rounded-pill bg-accent-coral px-lg py-sm text-sm font-semibold text-bg-canvas hover:bg-accent-coral-active"
            >
              대표 소개 보러가기
            </a>
            <a
              href="/travel-tools"
              className="rounded-pill border border-border-hairline px-lg py-sm text-sm text-text-primary hover:bg-bg-strong"
            >
              여행 준비하기
            </a>
            <a
              href="/mates"
              className="rounded-pill border border-border-hairline px-lg py-sm text-sm text-text-primary hover:bg-bg-strong"
            >
              동행 찾기
            </a>
          </div>
        </div>
      </section>

      <DestinationDrawer />
    </>
  );
}
