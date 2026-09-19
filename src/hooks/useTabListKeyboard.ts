"use client";

import type { KeyboardEvent } from "react";

/**
 * WAI-ARIA Tabs 패턴의 좌우 화살표/Home/End 키보드 내비게이션 + roving tabindex 헬퍼.
 * 탭 그룹 컴포넌트의 onKeyDown에서 호출한다.
 */
export function handleTabListKeyDown(
  event: KeyboardEvent<HTMLElement>,
  tabRefs: (HTMLElement | null)[],
  currentIndex: number,
  onSelectIndex: (index: number) => void,
) {
  const count = tabRefs.length;
  if (count === 0) return;

  let nextIndex: number | null = null;

  if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % count;
  else if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + count) % count;
  else if (event.key === "Home") nextIndex = 0;
  else if (event.key === "End") nextIndex = count - 1;

  if (nextIndex === null) return;

  event.preventDefault();
  onSelectIndex(nextIndex);
  tabRefs[nextIndex]?.focus();
}
