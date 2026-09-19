import type { Metadata } from "next";
import { ToolsIntro } from "@/components/travel-tools/ToolsIntro";
import { ToolTabs } from "@/components/travel-tools/ToolTabs";
import { SearchTips } from "@/components/travel-tools/SearchTips";

const PAGE_TITLE = "여행 준비(항공·숙소·동행)";
const PAGE_DESCRIPTION =
  "항공·숙소 조건을 정리해 외부 사이트로 안내받고, 동행을 함께 구해보세요.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/travel-tools" },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: "/travel-tools",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  url: "/travel-tools",
};

export default function TravelTools() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolsIntro />
      <ToolTabs />
      <SearchTips />
    </>
  );
}
