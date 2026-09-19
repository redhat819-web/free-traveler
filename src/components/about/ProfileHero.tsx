/**
 * SCR-002 대표 Hero — 대표 이미지 1장 + 한 문장 소개.
 * 이미지 alt에 실제 상황을 설명하고, 하단에 출처를 표시한다.
 */

import Image from "next/image";
import { representative } from "@/data/representative";

export function ProfileHero() {
  return (
    <section className="bg-bg-canvas px-gutter py-xl">
      <div className="mx-auto flex max-w-container-max flex-col items-center gap-lg text-center">
        <div className="relative aspect-[16/9] w-full max-w-3xl overflow-hidden rounded-md bg-bg-strong">
          <Image
            src={representative.heroPhoto.url}
            alt={representative.heroPhoto.alt}
            fill
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-cover"
            priority
          />
        </div>
        <p className="max-w-2xl text-lg font-semibold text-text-primary">
          {representative.tagline}
        </p>
        <p className="text-xs text-text-muted">
          사진 출처: Unsplash (무료 라이선스)
        </p>
      </div>
    </section>
  );
}
