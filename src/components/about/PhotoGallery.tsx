/**
 * SCR-002 여행 사진 Gallery — 서로 다른 장소 9장(8장 이상 요건 충족).
 * Desktop 4x2, Mobile 1~2열. 로드 실패 시 alt 텍스트가 남는 플레이스홀더로 대체한다.
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import { representative } from "@/data/representative";

export function PhotoGallery() {
  const [failed, setFailed] = useState<Set<number>>(new Set());

  return (
    <section className="bg-bg-soft px-gutter py-xl">
      <div className="mx-auto max-w-container-max">
        <h2 className="text-2xl font-semibold text-text-primary">여행 사진</h2>
        <p className="mt-xs text-sm text-text-secondary">
          직접 다녀온 곳에서 남긴 순간들입니다.
        </p>

        <div className="mt-lg grid grid-cols-1 gap-sm sm:grid-cols-2 lg:grid-cols-4">
          {representative.gallery.map((photo, index) => (
            <div
              key={photo.url}
              className="relative aspect-square overflow-hidden rounded-md bg-bg-strong"
            >
              {failed.has(index) ? (
                <div className="flex h-full w-full items-center justify-center p-sm text-center text-xs text-text-muted">
                  {photo.alt}
                </div>
              ) : (
                <Image
                  src={photo.url}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                  onError={() => setFailed((prev) => new Set(prev).add(index))}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
