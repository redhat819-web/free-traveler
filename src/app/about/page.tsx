import type { Metadata } from "next";
import { ProfileHero } from "@/components/about/ProfileHero";
import { TravelStats } from "@/components/about/TravelStats";
import { Philosophy } from "@/components/about/Philosophy";
import { TravelTimeline } from "@/components/about/TravelTimeline";
import { VisitedCountryChips } from "@/components/about/VisitedCountryChips";
import { PhotoGallery } from "@/components/about/PhotoGallery";
import { MemorableDestinations } from "@/components/about/MemorableDestinations";
import { representative } from "@/data/representative";

const PAGE_TITLE = "대표 소개";
const PAGE_DESCRIPTION = representative.tagline;

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: "/about",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  name: `${representative.name} 소개`,
  description: PAGE_DESCRIPTION,
  url: "/about",
};

export default function About() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProfileHero />
      <TravelStats />
      <Philosophy />
      <TravelTimeline />
      <VisitedCountryChips />
      <PhotoGallery />
      <MemorableDestinations />
    </>
  );
}
