"use client";

/**
 * SCR-004 차단 버튼 — 차단 확인 Modal 후 mate_blocks에 기록한다.
 * 차단 후 상호 글·프로필·요청 비노출은 RLS(supabase/rls_policies.sql)로 서버에서 강제한다.
 */

import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { createBlock } from "@/lib/db/blocks";
import { useToast } from "@/components/shared/Toast";
import { useDialogA11y } from "@/hooks/useDialogA11y";

interface BlockButtonProps {
  targetMemberId: string;
  targetLabel: string;
  onBlocked?: () => void;
}

export function BlockButton({
  targetMemberId,
  targetLabel,
  onBlocked,
}: BlockButtonProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useDialogA11y(open, () => setOpen(false), dialogRef);

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await createBlock(targetMemberId);
      showToast(`${targetLabel}님을 차단했습니다.`, "success");
      setOpen(false);
      onBlocked?.();
    } catch {
      showToast("차단에 실패했습니다. 다시 시도해주세요.", "danger");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="min-h-[44px] rounded-pill border border-semantic-danger px-md text-sm font-semibold text-semantic-danger hover:bg-accent-coral-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
      >
        차단하기
      </button>

      {open &&
        createPortal(
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="block-confirm-title"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-gutter"
          >
            <div className="w-full max-w-[24rem] rounded-md bg-bg-canvas p-lg shadow-lg">
              <h2
                id="block-confirm-title"
                className="text-lg font-semibold text-text-primary"
              >
                {targetLabel}님을 차단하시겠어요?
              </h2>
              <p className="mt-xs text-sm text-text-secondary">
                차단하면 이 사용자의 동행 글·프로필·참가 요청이 서로에게 더 이상
                보이지 않습니다.
              </p>

              <div className="mt-md flex justify-end gap-sm">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  disabled={submitting}
                  className="min-h-[44px] rounded-pill px-md text-sm font-semibold text-text-secondary hover:bg-bg-strong disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={submitting}
                  className="min-h-[44px] rounded-pill bg-semantic-danger px-md text-sm font-semibold text-bg-canvas disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                >
                  {submitting ? "차단하는 중..." : "차단"}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
