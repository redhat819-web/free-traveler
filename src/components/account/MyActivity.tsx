"use client";

/**
 * SCR-005 내 활동 — 내 글 수정/마감/삭제, 참가 요청 승인/거절, 차단 목록·해제.
 * mates 테이블은 RLS로 공개 조회가 허용되어 있어(mates_select_public) 클라이언트에서
 * author_id로 직접 필터링한다(src/lib/db 새 함수 추가는 이 Task 범위 밖).
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/db/browser-client";
import { closeMate, deleteMate, updateMate } from "@/lib/db/mates";
import {
  listApplicationsForMate,
  updateApplicationStatus,
} from "@/lib/db/applications";
import { deleteBlock, listMyBlocks } from "@/lib/db/blocks";
import { useToast } from "@/components/shared/Toast";
import type { Mate, MateApplication, MateBlock } from "@/lib/db/types";

interface MyActivityProps {
  userId: string;
}

interface ApplicationWithMate extends MateApplication {
  mateTitle: string;
}

export function MyActivity({ userId }: MyActivityProps) {
  const { showToast } = useToast();
  const [myMates, setMyMates] = useState<Mate[]>([]);
  const [applications, setApplications] = useState<ApplicationWithMate[]>([]);
  const [blocks, setBlocks] = useState<MateBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const loadAll = async () => {
    setLoadError(false);
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("mates")
        .select("*")
        .eq("author_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      const mates = (data ?? []) as Mate[];
      setMyMates(mates);

      const applicationsByMate = await Promise.all(
        mates.map(async (mate) => {
          const list = await listApplicationsForMate(mate.id);
          return list.map((app) => ({ ...app, mateTitle: mate.title }));
        }),
      );
      setApplications(applicationsByMate.flat());

      const blockList = await listMyBlocks();
      setBlocks(blockList);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await loadAll();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const hasActiveApplicants = (mateId: string) =>
    applications.some(
      (app) =>
        app.mate_id === mateId &&
        (app.status === "pending" || app.status === "accepted"),
    );

  const startEdit = (mate: Mate) => {
    setEditingId(mate.id);
    setEditTitle(mate.title);
    setEditDescription(mate.description);
  };

  const handleSaveEdit = async (mateId: string) => {
    const formData = new FormData();
    formData.set("title", editTitle);
    formData.set("description", editDescription);
    try {
      await updateMate(mateId, formData);
      showToast("동행 글을 수정했습니다.", "success");
      setEditingId(null);
      await loadAll();
    } catch {
      showToast("수정에 실패했습니다.", "danger");
    }
  };

  const handleClose = async (mate: Mate) => {
    if (hasActiveApplicants(mate.id)) {
      const confirmed = window.confirm(
        "이 모집글에는 진행 중인 참가 요청이 있습니다. 마감하면 참가자에게 영향을 줄 수 있습니다. 계속하시겠습니까?",
      );
      if (!confirmed) return;
    }
    try {
      await closeMate(mate.id);
      showToast("동행 글을 마감했습니다.", "success");
      await loadAll();
    } catch {
      showToast("마감에 실패했습니다.", "danger");
    }
  };

  const handleDelete = async (mate: Mate) => {
    if (hasActiveApplicants(mate.id)) {
      const confirmed = window.confirm(
        "이 모집글에는 진행 중인 참가 요청이 있습니다. 삭제하면 참가자에게 영향을 줄 수 있습니다. 계속하시겠습니까?",
      );
      if (!confirmed) return;
    } else {
      const confirmed = window.confirm("이 동행 글을 삭제하시겠습니까?");
      if (!confirmed) return;
    }
    try {
      await deleteMate(mate.id);
      showToast("동행 글을 삭제했습니다.", "success");
      await loadAll();
    } catch {
      showToast("삭제에 실패했습니다.", "danger");
    }
  };

  const handleDecision = async (
    applicationId: string,
    status: "accepted" | "rejected",
  ) => {
    try {
      await updateApplicationStatus(applicationId, status);
      showToast(
        status === "accepted"
          ? "참가 요청을 승인했습니다."
          : "참가 요청을 거절했습니다.",
        "success",
      );
      await loadAll();
    } catch {
      showToast("처리에 실패했습니다.", "danger");
    }
  };

  const handleUnblock = async (blockId: string) => {
    try {
      await deleteBlock(blockId);
      showToast("차단을 해제했습니다.", "success");
      await loadAll();
    } catch {
      showToast("차단 해제에 실패했습니다.", "danger");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-sm">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-16 animate-pulse rounded-md bg-bg-strong"
          />
        ))}
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="rounded-md border border-border-hairline bg-bg-soft p-md text-sm text-text-secondary">
        내 활동 정보를 불러오지 못했습니다.
        <button
          type="button"
          onClick={loadAll}
          className="ml-sm rounded-sm font-semibold text-accent-coral focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
          다시 시도
        </button>
      </div>
    );
  }

  const pendingApplications = applications.filter(
    (app) => app.status === "pending",
  );

  return (
    <div className="flex flex-col gap-lg">
      <section>
        <h2 className="text-lg font-semibold text-text-primary">내 동행 글</h2>
        {myMates.length === 0 ? (
          <div className="mt-sm rounded-md border border-border-hairline bg-bg-soft p-lg text-center">
            <p className="text-sm font-semibold text-text-primary">
              아직 작성한 동행 글이 없습니다.
            </p>
            <p className="mt-xs text-sm text-text-secondary">
              동행 조건(국가·지역·기간·인원)을 정리해 글을 작성하면 다른
              여행자의 참가 요청을 받을 수 있습니다.
            </p>
            <Link
              href="/travel-tools"
              className="mt-sm inline-block min-h-[44px] rounded-pill bg-accent-coral px-lg py-sm text-sm font-semibold text-bg-canvas hover:bg-accent-coral-active focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            >
              동행 글 작성하기
            </Link>
          </div>
        ) : (
          <ul className="mt-sm flex flex-col gap-sm">
            {myMates.map((mate) => (
              <li
                key={mate.id}
                className="rounded-md border border-border-hairline bg-bg-soft p-sm text-sm"
              >
                {editingId === mate.id ? (
                  <div className="flex flex-col gap-xs">
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      aria-label="동행 글 제목"
                      className="min-h-[44px] rounded-sm border border-border-hairline bg-bg-canvas px-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                    />
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      rows={3}
                      aria-label="동행 글 소개"
                      className="rounded-sm border border-border-hairline bg-bg-canvas p-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                    />
                    <div className="flex gap-sm">
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(mate.id)}
                        className="min-h-[44px] rounded-pill bg-accent-coral px-md text-sm font-semibold text-bg-canvas hover:bg-accent-coral-active focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                      >
                        저장
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="min-h-[44px] rounded-pill border border-border-hairline px-md text-sm text-text-secondary hover:bg-bg-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-sm">
                      <span className="font-semibold text-text-primary">
                        {mate.title}
                      </span>
                      <span className="rounded-pill bg-bg-strong px-sm py-xs text-xs font-semibold text-text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring">
                        {mate.status === "closed" ? "CLOSED" : "모집중"}
                      </span>
                    </div>
                    <p className="mt-xs text-xs text-text-secondary">
                      {mate.country} · {mate.region} · {mate.start_date}~
                      {mate.end_date}
                    </p>
                    <div className="mt-xs flex flex-wrap gap-sm">
                      <button
                        type="button"
                        onClick={() => startEdit(mate)}
                        className="min-h-[44px] rounded-pill border border-border-hairline px-md text-sm text-text-secondary hover:bg-bg-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                      >
                        수정
                      </button>
                      {mate.status !== "closed" && (
                        <button
                          type="button"
                          onClick={() => handleClose(mate)}
                          className="min-h-[44px] rounded-pill border border-border-hairline px-md text-sm text-text-secondary hover:bg-bg-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                        >
                          마감
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDelete(mate)}
                        className="min-h-[44px] rounded-pill border border-semantic-danger px-md text-sm text-semantic-danger hover:bg-accent-coral-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                      >
                        삭제
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-text-primary">
          참가 요청 관리
        </h2>
        {pendingApplications.length === 0 ? (
          <p className="mt-sm text-sm text-text-secondary">
            대기 중인 참가 요청이 없습니다.
          </p>
        ) : (
          <ul className="mt-sm flex flex-col gap-sm">
            {pendingApplications.map((app) => (
              <li
                key={app.id}
                className="rounded-md border border-border-hairline bg-bg-soft p-sm text-sm"
              >
                <p className="font-semibold text-text-primary">
                  {app.mateTitle}
                </p>
                {app.message && (
                  <p className="mt-xs text-text-secondary">{app.message}</p>
                )}
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
                    className="min-h-[44px] rounded-pill border border-border-hairline px-md text-sm text-text-secondary hover:bg-bg-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                  >
                    거절
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-text-primary">차단 목록</h2>
        {blocks.length === 0 ? (
          <p className="mt-sm text-sm text-text-secondary">
            차단한 사용자가 없습니다.
          </p>
        ) : (
          <ul className="mt-sm flex flex-col gap-sm">
            {blocks.map((block) => (
              <li
                key={block.id}
                className="flex items-center justify-between rounded-md border border-border-hairline bg-bg-soft p-sm text-sm"
              >
                <span className="text-text-secondary">
                  차단됨: {block.blocked_id}
                </span>
                <button
                  type="button"
                  onClick={() => handleUnblock(block.id)}
                  className="min-h-[44px] rounded-pill border border-border-hairline px-md text-sm text-text-secondary hover:bg-bg-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                >
                  차단 해제
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
