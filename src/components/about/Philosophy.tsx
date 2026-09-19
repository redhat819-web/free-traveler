/**
 * SCR-002 소개·철학 — 자기소개(왜 시작했는지)와 여행 철학을 좌우 분할로 보여준다.
 */

import { representative } from "@/data/representative";

export function Philosophy() {
  return (
    <section className="bg-bg-canvas px-gutter py-xl">
      <div className="mx-auto grid max-w-container-max grid-cols-1 gap-lg lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold text-text-primary">
            이 서비스를 시작한 이유
          </h2>
          <p className="mt-md text-base leading-relaxed text-text-secondary">
            {representative.introduction}
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-text-primary">
            여행을 대하는 철학
          </h2>
          <p className="mt-md text-base leading-relaxed text-text-secondary">
            {representative.philosophy}
          </p>
        </div>
      </div>
    </section>
  );
}
