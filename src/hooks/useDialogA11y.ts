"use client";

import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const APP_SHELL_ID = "app-shell";

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
}

/**
 * Drawer/Modal 공용 접근성 훅.
 * 열려 있는 동안: 포커스 트랩(Tab/Shift+Tab 내부 순환), Esc로 닫기, 배경(#app-shell) inert
 * + aria-hidden, 배경 스크롤 잠금. 열릴 때 내부로 포커스 이동, 닫힐 때 트리거로 포커스 복귀.
 */
export function useDialogA11y(
  open: boolean,
  onClose: () => void,
  dialogRef: RefObject<HTMLElement | null>,
) {
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;

    const dialog = dialogRef.current;
    const focusable = dialog ? getFocusable(dialog) : [];
    (focusable[0] ?? dialog)?.focus();

    const appShell = document.getElementById(APP_SHELL_ID);
    appShell?.setAttribute("inert", "");
    appShell?.setAttribute("aria-hidden", "true");

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialog) return;

      // 매 Tab/Shift+Tab을 직접 처리한다 — 경계(첫/마지막) 요소에서만 개입하고
      // 중간 이동은 브라우저 기본 동작(및 배경 inert)에 맡기지 않는다. inert
      // 적용이 지연되거나 우회되는 환경이 있어도 트랩이 항상 동작하게 하기 위함.
      event.preventDefault();

      const current = getFocusable(dialog);
      if (current.length === 0) return;

      const activeIndex = current.indexOf(document.activeElement as HTMLElement);
      let nextIndex: number;
      if (event.shiftKey) {
        nextIndex = activeIndex <= 0 ? current.length - 1 : activeIndex - 1;
      } else {
        nextIndex = activeIndex === -1 || activeIndex === current.length - 1 ? 0 : activeIndex + 1;
      }

      current[nextIndex].focus();
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      appShell?.removeAttribute("inert");
      appShell?.removeAttribute("aria-hidden");
      document.body.style.overflow = previousOverflow;
      previouslyFocused.current?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
}
