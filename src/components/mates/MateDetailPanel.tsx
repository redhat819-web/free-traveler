"use client";

/**
 * SCR-004 목록+상세 분할(Desktop 좌40/우60) / Drawer(Mobile 하단 풀시트).
 * 이메일·전화번호 등 연락처는 어떤 필드로도 표시하지 않는다(참가 요청 승인 후 별도 채널로만).
 */

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { isMateClosed } from "@/lib/mate-state";
import { useDialogA11y } from "@/hooks/useDialogA11y";
import type { Mate } from "@/lib/db/types";

const DESKTOP_MEDIA_QUERY = "(min-width: 1024px)";

/** Desktop(2단 레이아웃)에서는 이 패널이 Modal이 아니므로, Mobile 바텀시트일 때만 Dialog 취급한다. */
function useIsMobileViewport(): boolean {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window === "undefined" ? true : window.matchMedia(DESKTOP_MEDIA_QUERY).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const handleChange = () => setIsDesktop(mql.matches);
    handleChange();
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  return !isDesktop;
}

interface MateDetailPanelProps {
  mate: Mate | null;
  authorNickname?: string;
  todayIso?: string;
  onClose?: () => void;
  children?: React.ReactNode;
}

export function MateDetailPanel({
  mate,
  authorNickname,
  todayIso,
  onClose,
  children,
}: MateDetailPanelProps) {
  const isMobile = useIsMobileViewport();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const isMobileModal = isMobile && Boolean(mate);

  useDialogA11y(isMobileModal, () => onClose?.(), dialogRef);

  if (!mate) {
    return (
      <div className="hidden rounded-md border border-border-hairline bg-bg-soft p-lg text-center text-sm text-text-secondary lg:block">
        왼쪽 목록에서 동행 모집글을 선택하면 상세 내용을 볼 수 있습니다.
      </div>
    );
  }

  const today = todayIso ?? new Date().toISOString().slice(0, 10);
  const closed = isMateClosed(mate, today);

  const content = (
    <div className="max-h-[85vh] overflow-y-auto rounded-t-md bg-bg-canvas p-lg shadow-lg lg:max-h-none lg:rounded-md lg:border lg:border-border-hairline lg:shadow-none">
      <div className="flex items-start justify-between gap-md">
        <div>
          <span
            className={`inline-block rounded-pill px-sm py-xs text-xs font-semibold ${
              closed
                ? "bg-bg-strong text-text-secondary"
                : "bg-accent-coral-soft text-accent-coral"
            }`}
          >
            {closed ? "CLOSED" : "모집중"}
          </span>
          <h2 className="mt-xs text-lg font-semibold text-text-primary">{mate.title}</h2>
          <p className="mt-xs text-sm text-text-secondary">
            작성자: {authorNickname ?? "알 수 없음"}
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="상세 닫기"
            className="min-h-[44px] min-w-[44px] rounded-sm text-text-secondary hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring lg:hidden"
          >
            ✕
          </button>
        )}
      </div>

      <dl className="mt-md grid grid-cols-2 gap-sm text-sm">
        <div>
          <dt className="text-text-secondary">국가 · 지역</dt>
          <dd className="mt-xs font-semibold text-text-primary">
            {mate.country} · {mate.region}
          </dd>
        </div>
        <div>
          <dt className="text-text-secondary">기간</dt>
          <dd className="mt-xs font-semibold text-text-primary">
            {mate.start_date} ~ {mate.end_date}
          </dd>
        </div>
        <div>
          <dt className="text-text-secondary">모집 인원</dt>
          <dd className="mt-xs font-semibold text-text-primary">{mate.capacity}명</dd>
        </div>
      </dl>

      <div className="mt-md">
        <h3 className="text-sm font-semibold text-text-primary">소개</h3>
        <p className="mt-xs whitespace-pre-wrap text-sm text-text-secondary">
          {mate.description}
        </p>
      </div>

      {children && <div className="mt-md">{children}</div>}
    </div>
  );

  const panel = (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 lg:hidden" onClick={onClose} />
      <div
        ref={dialogRef}
        role={isMobileModal ? "dialog" : undefined}
        aria-modal={isMobileModal ? "true" : undefined}
        aria-label={isMobileModal ? `${mate.title} 상세 정보` : undefined}
        className="fixed inset-x-0 bottom-0 z-50 lg:static lg:z-auto"
      >
        {content}
      </div>
    </>
  );

  // Mobile 바텀시트(Modal)일 때는 #app-shell 밖(document.body)으로 포털링해야
  // useDialogA11y가 배경에 거는 inert/aria-hidden이 이 패널 자신까지 가리지 않는다.
  // Desktop 2단 레이아웃에서는 비Modal 인라인 패널이므로 그대로 렌더링한다.
  return isMobileModal ? createPortal(panel, document.body) : panel;
}
