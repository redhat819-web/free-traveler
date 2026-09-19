"use client";

/**
 * SCR-001 여행지 상세 Drawer.
 * Desktop 우측 40% 슬라이드 / Mobile 하단 풀시트. "국가 안전정보 보기"를 누르면
 * 같은 Drawer 안에서 여행지 상세 뷰 ↔ 안전정보 뷰를 전환한다(별도 라우트를 만들지 않는다).
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { destinations } from "@/data/destinations";
import { countrySafety } from "@/data/safety";
import { FavoriteButton } from "./FavoriteButton";
import { ShareButton } from "@/components/shared/ShareButton";
import { openDestinationDrawer } from "./DestinationGrid";
import { useDialogA11y } from "@/hooks/useDialogA11y";

type DrawerView = "destination" | "safety";

function readDestinationIdFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get("destination");
}

function closeDestinationDrawer() {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  url.searchParams.delete("destination");
  const next = url.search ? `${url.pathname}${url.search}` : url.pathname;
  window.history.pushState(null, "", next);
  window.dispatchEvent(
    new CustomEvent<string | null>("destination-drawer:select", {
      detail: null,
    }),
  );
}

/**
 * page.tsx가 Server Component이므로 함수 prop을 받지 않고, URL(`?destination=id`)과
 * CustomEvent(`destination-drawer:select`)만으로 DestinationGrid와 통신하는 자체 관리형 Drawer.
 */
export function DestinationDrawer() {
  const [destinationId, setDestinationId] = useState<string | null>(() =>
    readDestinationIdFromUrl(),
  );
  const [view, setView] = useState<DrawerView>("destination");

  useEffect(() => {
    function handleSelect(event: Event) {
      const detail = (event as CustomEvent<string | null>).detail;
      setDestinationId(detail ?? null);
      setView("destination");
    }
    function handlePopState() {
      setDestinationId(readDestinationIdFromUrl());
      setView("destination");
    }
    window.addEventListener("destination-drawer:select", handleSelect);
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("destination-drawer:select", handleSelect);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const destination = destinationId
    ? (destinations.find((item) => item.id === destinationId) ?? null)
    : null;

  const related = useMemo(() => {
    if (!destination) return [];
    return destinations
      .filter(
        (item) =>
          item.id !== destination.id && item.scope === destination.scope,
      )
      .filter(
        (item) =>
          item.country === destination.country ||
          item.region === destination.region,
      )
      .slice(0, 6);
  }, [destination]);

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const onClose = closeDestinationDrawer;

  useDialogA11y(
    Boolean(destination),
    () => {
      onClose();
      setView("destination");
    },
    dialogRef,
  );

  if (!destination) return null;

  const safety =
    countrySafety.find((entry) => entry.country === destination.country) ??
    null;

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${destination.city} 상세 정보`}
      className="fixed inset-0 z-50 flex items-end justify-end bg-black/40 sm:items-stretch"
      onClick={() => {
        onClose();
        setView("destination");
      }}
    >
      <div
        className="max-h-[90vh] w-full overflow-y-auto rounded-t-md bg-bg-canvas shadow-card sm:h-full sm:max-h-none sm:w-[40%] sm:min-w-[420px] sm:rounded-none"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border-hairline p-lg">
          <h2 className="text-lg font-semibold text-text-primary">
            {view === "destination"
              ? destination.city
              : `${destination.country} 안전정보`}
          </h2>
          <button
            type="button"
            aria-label="닫기"
            onClick={() => {
              onClose();
              setView("destination");
            }}
            className="rounded-sm px-xs text-text-muted hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          >
            ✕
          </button>
        </div>

        {view === "destination" ? (
          <div className="flex flex-col gap-lg p-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted">
                {destination.country} · {destination.region}
              </span>
              <div className="flex gap-sm">
                <FavoriteButton destinationId={destination.id} />
                <ShareButton
                  title={destination.city}
                  url={
                    typeof window !== "undefined"
                      ? `${window.location.origin}/?destination=${destination.id}`
                      : `/?destination=${destination.id}`
                  }
                />
              </div>
            </div>

            <p className="text-sm text-text-secondary">{destination.summary}</p>

            <DetailBlock title="주요 명소">
              <ul className="list-inside list-disc text-sm text-text-secondary">
                {destination.attractions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </DetailBlock>

            <DetailBlock title="추천 일정">
              <p className="text-sm text-text-secondary">
                <strong className="text-text-primary">1일 코스</strong>{" "}
                {destination.itinerary1Day}
              </p>
              <p className="mt-xs text-sm text-text-secondary">
                <strong className="text-text-primary">3일 코스</strong>{" "}
                {destination.itinerary3Day}
              </p>
            </DetailBlock>

            <DetailBlock title="예산 · 교통">
              <p className="text-sm text-text-secondary">
                {destination.budgetPerPersonKRW}
              </p>
              <p className="mt-xs text-sm text-text-secondary">
                {destination.transport}
              </p>
            </DetailBlock>

            <DetailBlock title="음식">
              <ul className="list-inside list-disc text-sm text-text-secondary">
                {destination.food.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </DetailBlock>

            <DetailBlock title="현지 에티켓">
              <p className="text-sm text-text-secondary">
                {destination.etiquette}
              </p>
            </DetailBlock>

            <p className="text-xs text-text-muted">
              출처: {destination.source}
            </p>

            {safety && (
              <button
                type="button"
                onClick={() => setView("safety")}
                className="self-start rounded-pill border border-accent-coral px-md py-xs text-sm font-semibold text-accent-coral hover:bg-accent-coral-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
              >
                국가 안전정보 보기 →
              </button>
            )}

            {related.length > 0 && (
              <DetailBlock title="관련 여행지">
                <div className="flex flex-col gap-sm">
                  {related.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => openDestinationDrawer(item.id)}
                      className="rounded-sm border border-border-hairline p-sm text-left text-sm text-text-secondary hover:bg-bg-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                    >
                      <span className="font-semibold text-text-primary">
                        {item.city}
                      </span>
                      {" · "}
                      {item.country}
                    </button>
                  ))}
                </div>
              </DetailBlock>
            )}

            <a
              href="/travel-tools"
              className="self-start rounded-pill bg-accent-coral px-md py-xs text-sm font-semibold text-bg-canvas hover:bg-accent-coral-active focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            >
              여행 조건부터 정리하기
            </a>
          </div>
        ) : (
          safety && (
            <div className="flex flex-col gap-md p-lg">
              <button
                type="button"
                onClick={() => setView("destination")}
                className="self-start rounded-sm text-sm font-semibold text-accent-coral underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
              >
                ← 여행지 정보로 돌아가기
              </button>

              <p className="rounded-sm bg-bg-soft p-sm text-xs text-text-secondary">
                본 안전정보는 참고용 안내이며, 실제 여행 전 외교부 등 공식
                채널에서 최신 정보를 다시 확인해야 합니다.
              </p>

              <DetailBlock title="치안">
                <p className="text-sm text-text-secondary">{safety.security}</p>
              </DetailBlock>
              <DetailBlock title="사기">
                <p className="text-sm text-text-secondary">{safety.scam}</p>
              </DetailBlock>
              <DetailBlock title="법규">
                <p className="text-sm text-text-secondary">{safety.law}</p>
              </DetailBlock>
              <DetailBlock title="교통">
                <p className="text-sm text-text-secondary">{safety.traffic}</p>
              </DetailBlock>
              <DetailBlock title="재난">
                <p className="text-sm text-text-secondary">{safety.disaster}</p>
              </DetailBlock>
              <DetailBlock title="보건">
                <p className="text-sm text-text-secondary">{safety.health}</p>
              </DetailBlock>
              <DetailBlock title="문화">
                <p className="text-sm text-text-secondary">{safety.culture}</p>
              </DetailBlock>
              <DetailBlock title="긴급연락처">
                <p className="text-sm text-text-secondary">
                  {safety.emergencyContacts}
                </p>
              </DetailBlock>

              <div className="flex flex-wrap items-center justify-between gap-sm border-t border-border-hairline pt-md text-xs text-text-muted">
                <span>
                  출처: {safety.source.name} · 확인일{" "}
                  {safety.source.lastVerified}
                </span>
                <a
                  href={safety.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-sm font-semibold text-accent-coral underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                >
                  원문 보기 →
                </a>
              </div>
            </div>
          )
        )}
      </div>
    </div>,
    document.body,
  );
}

function DetailBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
      <div className="mt-xs">{children}</div>
    </div>
  );
}
