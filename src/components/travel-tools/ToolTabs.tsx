"use client";

/**
 * SCR-003 항공편/숙소/동행 구하기 3탭 셸.
 * 탭 전환은 언마운트하지 않고 hidden 속성으로 숨기는 방식으로 구현해,
 * 탭을 오갈 때도 각 Form의 입력 상태가 유지되도록 한다(Functional AC "탭별 폼 상태 분리 유지").
 * 외부 링크 버튼으로 대체하지 않고 실제 내부 Component를 그대로 조립한다(CLAUDE.md 규칙 11).
 */

import { useRef, useState } from "react";
import { FlightForm } from "./FlightForm";
import { HotelForm } from "./HotelForm";
import { MateComposeForm } from "./MateComposeForm";
import { handleTabListKeyDown } from "@/hooks/useTabListKeyboard";

type Tab = "flight" | "hotel" | "mate";

const TABS: { key: Tab; label: string }[] = [
  { key: "flight", label: "항공편" },
  { key: "hotel", label: "숙소" },
  { key: "mate", label: "동행 구하기" },
];

export function ToolTabs() {
  const [active, setActive] = useState<Tab>("flight");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeIndex = TABS.findIndex((tab) => tab.key === active);

  return (
    <section className="bg-bg-canvas px-gutter py-lg">
      <div className="mx-auto max-w-container-max">
        <div
          className="flex gap-lg overflow-x-auto border-b border-border-hairline"
          role="tablist"
          aria-label="여행 준비 탭"
          onKeyDown={(event) =>
            handleTabListKeyDown(event, tabRefs.current, activeIndex, (index) =>
              setActive(TABS[index].key),
            )
          }
        >
          {TABS.map((tab, index) => (
            <button
              key={tab.key}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              id={`tool-tab-${tab.key}`}
              type="button"
              role="tab"
              aria-selected={active === tab.key}
              aria-controls={`tool-tabpanel-${tab.key}`}
              tabIndex={active === tab.key ? 0 : -1}
              onClick={() => setActive(tab.key)}
              className={`whitespace-nowrap border-b-2 px-xs py-sm text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring ${
                active === tab.key
                  ? "border-accent-coral text-text-primary"
                  : "border-transparent text-text-secondary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          id="tool-tabpanel-flight"
          role="tabpanel"
          aria-labelledby="tool-tab-flight"
          className="mt-lg"
          hidden={active !== "flight"}
        >
          <FlightForm />
        </div>
        <div
          id="tool-tabpanel-hotel"
          role="tabpanel"
          aria-labelledby="tool-tab-hotel"
          className="mt-lg"
          hidden={active !== "hotel"}
        >
          <HotelForm />
        </div>
        <div
          id="tool-tabpanel-mate"
          role="tabpanel"
          aria-labelledby="tool-tab-mate"
          className="mt-lg"
          hidden={active !== "mate"}
        >
          <MateComposeForm />
        </div>
      </div>
    </section>
  );
}
