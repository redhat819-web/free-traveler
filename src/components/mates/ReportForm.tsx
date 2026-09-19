"use client";

/**
 * SCR-004 신고 버튼/폼 — 사유 코드 + 설명, 접수 즉시 신고 ID 표시.
 * 신고 큐 상태(OPEN/REVIEWING/RESOLVED/DISMISSED) 변경은 Admin 화면(CMP-SCR005-ADMIN)에서 처리한다.
 * created_at(접수 시각)은 DB 기본값으로, 처리 시각은 resolved_at으로 서버에 기록된다.
 */

import { useState } from "react";
import { createClient } from "@/lib/db/browser-client";
import { useToast } from "@/components/shared/Toast";

const REASON_CODES = [
  { value: "spam", label: "스팸/광고" },
  { value: "harassment", label: "괴롭힘/혐오 발언" },
  { value: "fraud", label: "사기 의심" },
  { value: "contact_leak", label: "연락처 공개 시도" },
  { value: "other", label: "기타" },
];

const MAX_DESCRIPTION_LENGTH = 1000;

interface ReportFormProps {
  targetMateId?: string;
  targetMemberId?: string;
}

export function ReportForm({ targetMateId, targetMemberId }: ReportFormProps) {
  const [open, setOpen] = useState(false);
  const [reasonCode, setReasonCode] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reportId, setReportId] = useState<string | null>(null);
  const { showToast } = useToast();

  const resetAndClose = () => {
    setOpen(false);
    setReasonCode("");
    setDescription("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!reasonCode) return;

    setSubmitting(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("로그인이 필요합니다.");

      const { data, error } = await supabase
        .from("mate_reports")
        .insert({
          reporter_id: user.id,
          target_mate_id: targetMateId ?? null,
          target_member_id: targetMemberId ?? null,
          reason_code: reasonCode,
          description: description || null,
        })
        .select("id")
        .single();

      if (error) throw error;

      setReportId(data.id as string);
      showToast("신고가 접수되었습니다.", "success");
    } catch {
      showToast("신고 접수에 실패했습니다. 다시 시도해주세요.", "danger");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="min-h-[44px] rounded-pill border border-border-hairline px-md text-sm font-semibold text-text-secondary hover:bg-bg-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
      >
        신고하기
      </button>
    );
  }

  if (reportId) {
    return (
      <div className="rounded-md border border-border-hairline bg-bg-soft p-md text-sm">
        <p className="font-semibold text-text-primary">
          신고가 접수되었습니다.
        </p>
        <p className="mt-xs text-text-secondary">신고 번호: {reportId}</p>
        <button
          type="button"
          onClick={resetAndClose}
          className="mt-sm min-h-[44px] rounded-pill border border-border-hairline px-md text-sm font-semibold text-text-secondary hover:bg-bg-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
          닫기
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-sm rounded-md border border-border-hairline bg-bg-soft p-md"
    >
      <fieldset className="flex flex-col gap-xs">
        <legend className="text-sm font-semibold text-text-primary">
          신고 사유
        </legend>
        {REASON_CODES.map((reason) => (
          <label
            key={reason.value}
            className="flex items-center gap-xs text-sm text-text-secondary"
          >
            <input
              type="radio"
              name="reason_code"
              value={reason.value}
              checked={reasonCode === reason.value}
              onChange={(e) => setReasonCode(e.target.value)}
              className="h-[18px] w-[18px]"
            />
            {reason.label}
          </label>
        ))}
      </fieldset>

      <label className="flex flex-col gap-xs text-sm text-text-secondary">
        상세 설명({description.length}/{MAX_DESCRIPTION_LENGTH}자)
        <textarea
          value={description}
          maxLength={MAX_DESCRIPTION_LENGTH}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="rounded-sm border border-border-hairline bg-bg-canvas p-sm text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        />
      </label>

      <div className="flex gap-sm">
        <button
          type="button"
          onClick={resetAndClose}
          disabled={submitting}
          className="min-h-[44px] rounded-pill px-md text-sm font-semibold text-text-secondary hover:bg-bg-strong disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={submitting || !reasonCode}
          className="min-h-[44px] rounded-pill bg-semantic-danger px-md text-sm font-semibold text-bg-canvas disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
          {submitting ? "접수하는 중..." : "신고 제출"}
        </button>
      </div>
    </form>
  );
}
