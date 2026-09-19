"use client";

import { useState } from "react";
import { useToast } from "@/components/shared/Toast";

export function ShareButton({ title, url }: { title: string; url: string }) {
  const { showToast } = useToast();
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      disabled={pending}
      aria-label="공유하기"
      onClick={async (event) => {
        event.stopPropagation();
        setPending(true);
        try {
          if (navigator.share) {
            await navigator.share({ title, url });
          } else {
            await navigator.clipboard.writeText(url);
            showToast("링크가 복사되었습니다.", "success");
          }
        } catch {
          try {
            await navigator.clipboard.writeText(url);
            showToast("링크가 복사되었습니다.", "success");
          } catch {
            showToast("공유에 실패했습니다.", "danger");
          }
        } finally {
          setPending(false);
        }
      }}
      className="flex h-11 w-11 items-center justify-center rounded-pill border border-border-hairline bg-bg-canvas text-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:opacity-50"
    >
      <span aria-hidden="true">⇪</span>
    </button>
  );
}
