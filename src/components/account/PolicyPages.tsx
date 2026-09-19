"use client";

/**
 * SCR-005 정책 페이지 — 이용약관/개인정보처리방침/동행 안전수칙/콘텐츠 면책 고지.
 * 정적 데이터(src/data/policies.ts)만 사용하며 별도 DB Table을 만들지 않는다.
 */

import { useRef, useState } from "react";
import { policies } from "@/data/policies";
import { handleTabListKeyDown } from "@/hooks/useTabListKeyboard";

export function PolicyPages() {
  const [activeId, setActiveId] = useState(policies[0].id);
  const active =
    policies.find((policy) => policy.id === activeId) ?? policies[0];
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeIndex = policies.findIndex((policy) => policy.id === activeId);

  return (
    <div>
      <div
        className="flex flex-wrap gap-xs"
        role="tablist"
        aria-label="정책 문서"
        onKeyDown={(event) =>
          handleTabListKeyDown(event, tabRefs.current, activeIndex, (index) =>
            setActiveId(policies[index].id),
          )
        }
      >
        {policies.map((policy, index) => (
          <button
            key={policy.id}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            id={`policy-tab-${policy.id}`}
            type="button"
            role="tab"
            aria-selected={activeId === policy.id}
            aria-controls={`policy-tabpanel-${policy.id}`}
            tabIndex={activeId === policy.id ? 0 : -1}
            onClick={() => setActiveId(policy.id)}
            className={`min-h-[44px] rounded-pill px-md text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring ${
              activeId === policy.id
                ? "bg-accent-coral-soft text-text-primary"
                : "bg-bg-strong text-text-secondary"
            }`}
          >
            {policy.title}
          </button>
        ))}
      </div>

      <div
        id={`policy-tabpanel-${active.id}`}
        role="tabpanel"
        aria-labelledby={`policy-tab-${active.id}`}
        className="mt-md rounded-md border border-border-hairline bg-bg-soft p-md"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">
            {active.title}
          </h2>
          <span className="text-xs text-text-secondary">
            v{active.version} · {active.effectiveDate} 시행
          </span>
        </div>

        <div className="mt-sm flex flex-col gap-md">
          {active.sections.map((section) => (
            <div key={section.heading}>
              <h3 className="text-sm font-semibold text-text-primary">
                {section.heading}
              </h3>
              <ul className="mt-xs flex flex-col gap-xs">
                {section.body.map((line) => (
                  <li key={line} className="text-sm text-text-secondary">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
