"use client";

/**
 * SCR-004 참가 요청 Form — 500자 이내 비공개 메시지, PENDING 저장.
 * 동일 글 중복 PENDING/ACCEPTED 차단은 클라이언트에서 기존 요청을 조회해 막는다.
 * 비작성자의 상태 변경 시도는 RLS(supabase/rls_policies.sql)가 서버에서 403으로 거부한다.
 */

import { useEffect, useState } from "react";
import {
  createApplication,
  listApplicationsForMate,
  updateApplicationStatus,
} from "@/lib/db/applications";
import { useToast } from "@/components/shared/Toast";
import { hasActiveApplication } from "@/lib/mate-state";
import type { MateApplication, MateApplicationStatus } from "@/lib/db/types";

const MAX_MESSAGE_LENGTH = 500;

const STATUS_LABEL: Record<MateApplicationStatus, string> = {
  pending: "대기",
  accepted: "승인",
  rejected: "거절",
};

interface JoinRequestFormProps {
  mateId: string;
  currentUserId: string | null;
  isAuthor: boolean;
}

export function JoinRequestForm({ mateId, currentUserId, isAuthor }: JoinRequestFormProps) {
  const [applications, setApplications] = useState<MateApplication[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const { showToast } = useToast();

  const loadApplications = async () => {
    setLoadError(false);
    setLoading(true);
    try {
      const list = await listApplicationsForMate(mateId);
      setApplications(list);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await loadApplications();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mateId]);

  const myApplication = applications.find((app) => app.requester_id === currentUserId);
  const hasActiveRequest =
    !!currentUserId && hasActiveApplication(applications, currentUserId);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.set("message", message);
      await createApplication(mateId, formData);
      showToast("참가 요청을 보냈습니다.", "success");
      setMessage("");
      await loadApplications();
    } catch {
      showToast("참가 요청에 실패했습니다. 다시 시도해주세요.", "danger");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDecision = async (applicationId: string, status: MateApplicationStatus) => {
    try {
      await updateApplicationStatus(applicationId, status);
      showToast(status === "accepted" ? "참가 요청을 승인했습니다." : "참가 요청을 거절했습니다.", "success");
      await loadApplications();
    } catch {
      showToast("처리에 실패했습니다. 다시 시도해주세요.", "danger");
    }
  };

  if (loadError) {
    return (
      <div className="rounded-md border border-border-hairline bg-bg-soft p-md text-sm text-text-secondary">
        참가 요청 정보를 불러오지 못했습니다.
        <button
          type="button"
          onClick={loadApplications}
          className="ml-sm rounded-sm font-semibold text-accent-coral focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (isAuthor) {
    return (
      <div>
        <h3 className="text-sm font-semibold text-text-primary">참가 요청 목록</h3>
        {loading ? (
          <p className="mt-xs text-sm text-text-secondary">불러오는 중...</p>
        ) : applications.length === 0 ? (
          <p className="mt-xs text-sm text-text-secondary">아직 들어온 참가 요청이 없습니다.</p>
        ) : (
          <ul className="mt-sm flex flex-col gap-sm">
            {applications.map((app) => (
              <li
                key={app.id}
                className="rounded-md border border-border-hairline bg-bg-soft p-sm text-sm"
              >
                <span className="inline-block rounded-pill bg-bg-strong px-sm py-xs text-xs font-semibold text-text-secondary">
                  {STATUS_LABEL[app.status]}
                </span>
                {app.message && <p className="mt-xs text-text-secondary">{app.message}</p>}
                {app.status === "pending" && (
                  <div className="mt-xs flex gap-sm">
                    <button
                      type="button"
                      onClick={() => handleDecision(app.id, "accepted")}
                      className="min-h-[44px] rounded-pill bg-accent-coral px-md text-sm font-semibold text-bg-canvas hover:bg-accent-coral-active focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                    >
                      승인
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDecision(app.id, "rejected")}
                      className="min-h-[44px] rounded-pill border border-border-hairline px-md text-sm font-semibold text-text-secondary hover:bg-bg-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                    >
                      거절
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  if (myApplication) {
    return (
      <div className="rounded-md border border-border-hairline bg-bg-soft p-md text-sm">
        <span className="inline-block rounded-pill bg-accent-coral-soft px-sm py-xs text-xs font-semibold text-accent-coral">
          내 참가 요청: {STATUS_LABEL[myApplication.status]}
        </span>
        {hasActiveRequest && (
          <p className="mt-xs text-text-secondary">
            이미 이 모집글에 참가 요청을 보냈습니다. 결과를 기다려주세요.
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-sm">
      <label className="flex flex-col gap-xs text-sm text-text-secondary">
        참가 요청 메시지({message.length}/{MAX_MESSAGE_LENGTH}자)
        <textarea
          value={message}
          maxLength={MAX_MESSAGE_LENGTH}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="rounded-sm border border-border-hairline bg-bg-canvas p-sm text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          placeholder="작성자에게 전달할 비공개 메시지를 입력하세요."
        />
      </label>
      <button
        type="submit"
        disabled={submitting}
        className="min-h-[44px] self-start rounded-pill bg-accent-coral px-lg py-sm text-sm font-semibold text-bg-canvas hover:bg-accent-coral-active disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
      >
        {submitting ? "요청 보내는 중..." : "참가 요청 보내기"}
      </button>
    </form>
  );
}
