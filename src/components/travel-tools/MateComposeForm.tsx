"use client";

/**
 * SCR-003 동행 모집글 작성 Form.
 * 로그인하지 않은 사용자에게는 안내만 표시한다(작성 자체는 CMP-SCR005-AUTH 로그인 완료 후에만 가능).
 * 제목·설명에서 전화번호/이메일/메신저 ID 패턴이 발견되면 제출을 차단한다(REQ-FUNC-032).
 */

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/db/browser-client";
import { createMate } from "@/lib/db/mates";
import { useToast } from "@/components/shared/Toast";

const CONTACT_PATTERNS: RegExp[] = [
  /01[0-9][-.\s]?\d{3,4}[-.\s]?\d{4}/, // 휴대폰 번호
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, // 이메일
  /(카카오\s?톡|카톡|kakao\s?talk|kakaotalk)\s?(id|아이디)?\s?[:：]?\s?[a-zA-Z0-9_.]{2,}/i, // 카카오톡 ID
  /(인스타|instagram|insta)\s?(id|아이디)?\s?[:：]?\s?@?[a-zA-Z0-9_.]{2,}/i, // 인스타그램 ID
  /(라인|line)\s?(id|아이디)?\s?[:：]?\s?[a-zA-Z0-9_.]{2,}/i, // 라인 ID
];

function containsContactInfo(text: string): boolean {
  return CONTACT_PATTERNS.some((pattern) => pattern.test(text));
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

const TRAVEL_STYLES = [
  "동행 위주",
  "자유여행",
  "맛집 탐방",
  "액티비티",
  "사진 촬영",
  "힐링",
];

interface FormState {
  title: string;
  country: string;
  region: string;
  startDate: string;
  endDate: string;
  capacity: string;
  styles: string[];
  description: string;
  agreed: boolean;
}

const INITIAL_FORM: FormState = {
  title: "",
  country: "",
  region: "",
  startDate: "",
  endDate: "",
  capacity: "2",
  styles: [],
  description: "",
  agreed: false,
};

export function MateComposeForm() {
  const { showToast } = useToast();
  const [checkingSession, setCheckingSession] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setCheckingSession(false);
      }
    })();
  }, []);

  if (checkingSession) {
    return (
      <div
        role="status"
        aria-label="로그인 상태를 확인하는 중"
        className="h-40 animate-pulse rounded-md border border-border-hairline bg-bg-soft"
      />
    );
  }

  if (!user) {
    return (
      <div className="rounded-md border border-border-hairline bg-bg-soft p-lg text-center">
        <p className="text-sm text-text-secondary">
          동행 모집글을 작성하려면 먼저 로그인해야 합니다.
        </p>
        <a
          href="/account"
          className="mt-md inline-block rounded-pill bg-accent-coral px-lg py-sm text-sm font-semibold text-bg-canvas hover:bg-accent-coral-active focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
          로그인/가입하러 가기 →
        </a>
      </div>
    );
  }

  const toggleStyle = (style: string) => {
    setForm((prev) => ({
      ...prev,
      styles: prev.styles.includes(style)
        ? prev.styles.filter((s) => s !== style)
        : [...prev.styles, style],
    }));
  };

  return (
    <form
      className="flex flex-col gap-md"
      onSubmit={async (event) => {
        event.preventDefault();
        const nextErrors: Record<string, string> = {};

        if (!form.title.trim()) nextErrors.title = "제목을 입력하세요.";
        if (!form.country.trim()) nextErrors.country = "국가를 입력하세요.";
        if (!form.region.trim()) nextErrors.region = "지역을 입력하세요.";
        if (!form.startDate) nextErrors.startDate = "시작일을 입력하세요.";
        if (!form.endDate) nextErrors.endDate = "종료일을 입력하세요.";
        if (form.startDate && form.startDate < todayIso()) {
          nextErrors.startDate = "시작일은 오늘 이후여야 합니다.";
        }
        if (form.startDate && form.endDate && form.endDate < form.startDate) {
          nextErrors.endDate = "종료일은 시작일 이후여야 합니다.";
        }
        if (Number(form.capacity) < 2)
          nextErrors.capacity = "모집 인원은 2명 이상이어야 합니다.";
        if (!form.description.trim())
          nextErrors.description = "소개를 입력하세요.";
        if (!form.agreed)
          nextErrors.agreed = "안전수칙에 동의해야 작성할 수 있습니다.";

        if (
          containsContactInfo(form.title) ||
          containsContactInfo(form.description)
        ) {
          nextErrors.description =
            "전화번호·이메일·메신저 ID로 보이는 내용은 등록할 수 없습니다. 연락 방법은 참가 승인 후 안전하게 나눌 수 있습니다.";
        }

        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;

        setSubmitting(true);
        try {
          const formData = new FormData();
          formData.set("title", form.title);
          formData.set("country", form.country);
          formData.set("region", form.region);
          formData.set(
            "description",
            `${form.description}${form.styles.length ? `\n\n선호 스타일: ${form.styles.join(", ")}` : ""}`,
          );
          formData.set("start_date", form.startDate);
          formData.set("end_date", form.endDate);
          formData.set("capacity", form.capacity);

          await createMate(formData);
          setSubmitted(true);
          setForm(INITIAL_FORM);
          showToast("동행 모집글이 등록되었습니다.", "success");
        } catch (error) {
          showToast(
            error instanceof Error
              ? error.message
              : "모집글 등록에 실패했습니다.",
            "danger",
          );
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {submitted && (
        <p className="rounded-sm bg-semantic-success/10 p-sm text-sm text-semantic-success">
          모집글이 등록되었습니다. 동행 찾기 화면에서 확인할 수 있습니다.
        </p>
      )}

      <label className="flex flex-col gap-xs text-sm text-text-secondary">
        제목
        <input
          type="text"
          value={form.title}
          maxLength={100}
          onChange={(event) => setForm({ ...form, title: event.target.value })}
          className="rounded-sm border border-border-hairline bg-bg-soft px-sm py-xs text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        />
        {errors.title && (
          <span className="text-xs text-semantic-danger" role="alert">
            {errors.title}
          </span>
        )}
      </label>

      <div className="grid grid-cols-1 gap-md sm:grid-cols-2">
        <label className="flex flex-col gap-xs text-sm text-text-secondary">
          국가
          <input
            type="text"
            value={form.country}
            maxLength={50}
            onChange={(event) =>
              setForm({ ...form, country: event.target.value })
            }
            className="rounded-sm border border-border-hairline bg-bg-soft px-sm py-xs text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          />
          {errors.country && (
            <span className="text-xs text-semantic-danger" role="alert">
              {errors.country}
            </span>
          )}
        </label>

        <label className="flex flex-col gap-xs text-sm text-text-secondary">
          지역
          <input
            type="text"
            value={form.region}
            maxLength={50}
            onChange={(event) =>
              setForm({ ...form, region: event.target.value })
            }
            className="rounded-sm border border-border-hairline bg-bg-soft px-sm py-xs text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          />
          {errors.region && (
            <span className="text-xs text-semantic-danger" role="alert">
              {errors.region}
            </span>
          )}
        </label>

        <label className="flex flex-col gap-xs text-sm text-text-secondary">
          시작일
          <input
            type="date"
            value={form.startDate}
            min={todayIso()}
            onChange={(event) =>
              setForm({ ...form, startDate: event.target.value })
            }
            className="rounded-sm border border-border-hairline bg-bg-soft px-sm py-xs text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          />
          {errors.startDate && (
            <span className="text-xs text-semantic-danger" role="alert">
              {errors.startDate}
            </span>
          )}
        </label>

        <label className="flex flex-col gap-xs text-sm text-text-secondary">
          종료일
          <input
            type="date"
            value={form.endDate}
            min={form.startDate || todayIso()}
            onChange={(event) =>
              setForm({ ...form, endDate: event.target.value })
            }
            className="rounded-sm border border-border-hairline bg-bg-soft px-sm py-xs text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          />
          {errors.endDate && (
            <span className="text-xs text-semantic-danger" role="alert">
              {errors.endDate}
            </span>
          )}
        </label>

        <label className="flex flex-col gap-xs text-sm text-text-secondary">
          모집 인원
          <input
            type="number"
            min={2}
            max={20}
            value={form.capacity}
            onChange={(event) =>
              setForm({ ...form, capacity: event.target.value })
            }
            className="rounded-sm border border-border-hairline bg-bg-soft px-sm py-xs text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          />
          {errors.capacity && (
            <span className="text-xs text-semantic-danger" role="alert">
              {errors.capacity}
            </span>
          )}
        </label>
      </div>

      <div>
        <span className="text-sm text-text-secondary">선호 스타일(선택)</span>
        <div className="mt-xs flex flex-wrap gap-sm">
          {TRAVEL_STYLES.map((style) => (
            <button
              key={style}
              type="button"
              aria-pressed={form.styles.includes(style)}
              onClick={() => toggleStyle(style)}
              className={`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring rounded-pill px-md py-xs text-sm ${
                form.styles.includes(style)
                  ? "bg-accent-coral-soft text-text-primary"
                  : "bg-bg-strong text-text-secondary"
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      <label className="flex flex-col gap-xs text-sm text-text-secondary">
        소개
        <textarea
          value={form.description}
          maxLength={1000}
          rows={4}
          onChange={(event) =>
            setForm({ ...form, description: event.target.value })
          }
          className="rounded-sm border border-border-hairline bg-bg-soft px-sm py-xs text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        />
        {errors.description && (
          <span className="text-xs text-semantic-danger" role="alert">
            {errors.description}
          </span>
        )}
      </label>

      <label className="flex items-start gap-sm rounded-sm border border-accent-coral bg-accent-coral-soft p-sm text-sm text-text-primary">
        <input
          type="checkbox"
          checked={form.agreed}
          onChange={(event) =>
            setForm({ ...form, agreed: event.target.checked })
          }
          className="mt-xs"
        />
        <span>
          전화번호·SNS 등 개인 연락처를 게시글에 직접 남기지 않으며, 동행 시
          안전수칙을 준수하는 데 동의합니다.
        </span>
      </label>
      {errors.agreed && (
        <span className="text-xs text-semantic-danger" role="alert">
          {errors.agreed}
        </span>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="self-start rounded-pill bg-accent-coral px-lg py-sm text-sm font-semibold text-bg-canvas hover:bg-accent-coral-active disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
      >
        {submitting ? "등록 중..." : "동행 모집글 등록하기"}
      </button>
    </form>
  );
}
