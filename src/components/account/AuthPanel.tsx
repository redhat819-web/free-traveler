"use client";

/**
 * SCR-005 Guest 인증 패널.
 * 이메일 가입·로그인·비밀번호 재설정(Guest), 프로필 완성/성인 확인/탈퇴(로그인 후)를 다룬다.
 * Member/Admin 탭 전체 조립은 PAGE-SCR005(CMP-SCR005-PROFILE 등)의 범위이며,
 * 이 컴포넌트는 인증 자체와 최소 프로필 완성 단계까지만 담당한다.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/db/browser-client";
import { useToast } from "@/components/shared/Toast";
import { handleTabListKeyDown } from "@/hooks/useTabListKeyboard";
import type { AgeGroup, MemberProfile } from "@/lib/db/types";

type GuestMode = "login" | "signup" | "reset";

const GUEST_MODE_TABS: { key: GuestMode; label: string }[] = [
  { key: "login", label: "로그인" },
  { key: "signup", label: "가입하기" },
  { key: "reset", label: "비밀번호 재설정" },
];

const AGE_GROUP_OPTIONS: { value: AgeGroup; label: string }[] = [
  { value: "10s", label: "10대" },
  { value: "20s", label: "20대" },
  { value: "30s", label: "30대" },
  { value: "40s", label: "40대" },
  { value: "50s", label: "50대" },
  { value: "60_plus", label: "60대 이상" },
];

export function AuthPanel() {
  const { showToast } = useToast();
  const [envError, setEnvError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [mode, setMode] = useState<GuestMode>("login");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const guestModeTabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const loadSession = useCallback(async () => {
    try {
      const supabase = createClient();
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      setUser(currentUser);

      if (currentUser) {
        const { data } = await supabase
          .from("member_profiles")
          .select("*")
          .eq("id", currentUser.id)
          .maybeSingle();
        setProfile((data as MemberProfile) ?? null);
      } else {
        setProfile(null);
      }
    } catch (error) {
      setEnvError(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    (async () => {
      await loadSession();

      try {
        const supabase = createClient();
        const { data } = supabase.auth.onAuthStateChange(() => {
          void loadSession();
        });
        unsubscribe = () => data.subscription.unsubscribe();
      } catch {
        // env 미설정 시 loadSession에서 이미 envError를 설정했으므로 여기서는 무시한다.
      }
    })();

    return () => unsubscribe?.();
  }, [loadSession]);

  if (envError) {
    return (
      <div className="rounded-md border border-semantic-warning bg-bg-soft p-lg text-sm text-semantic-warning">
        <p className="font-semibold">개발 환경 설정이 필요합니다</p>
        <p className="mt-xs text-text-secondary">{envError}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        role="status"
        aria-label="계정 정보를 불러오는 중"
        className="grid gap-md sm:grid-cols-3"
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-40 animate-pulse rounded-md border border-border-hairline bg-bg-soft"
          />
        ))}
      </div>
    );
  }

  if (user) {
    return (
      <MemberEntry
        user={user}
        profile={profile}
        onProfileCreated={loadSession}
        showToast={showToast}
      />
    );
  }

  return (
    <div>
      <div
        className="flex gap-sm overflow-x-auto pb-sm"
        role="tablist"
        aria-label="계정 기능 선택"
        onKeyDown={(event) =>
          handleTabListKeyDown(
            event,
            guestModeTabRefs.current,
            GUEST_MODE_TABS.findIndex((tab) => tab.key === mode),
            (index) => {
              setMode(GUEST_MODE_TABS[index].key);
              setFormError(null);
            },
          )
        }
      >
        {GUEST_MODE_TABS.map((tab, index) => (
          <button
            key={tab.key}
            ref={(el) => {
              guestModeTabRefs.current[index] = el;
            }}
            type="button"
            role="tab"
            aria-selected={mode === tab.key}
            tabIndex={mode === tab.key ? 0 : -1}
            onClick={() => {
              setMode(tab.key);
              setFormError(null);
            }}
            className={`rounded-pill px-md py-xs text-sm whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring ${
              mode === tab.key
                ? "bg-accent-coral-soft text-text-primary"
                : "bg-bg-strong text-text-secondary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-md grid gap-md">
        <AuthCard
          title="로그인"
          description="이미 가입한 이메일과 비밀번호로 로그인합니다."
          active={mode === "login"}
        >
          <LoginForm
            submitting={submitting}
            setSubmitting={setSubmitting}
            setFormError={setFormError}
            showToast={showToast}
          />
        </AuthCard>

        <AuthCard
          title="가입하기"
          description="이메일과 비밀번호로 새 계정을 만듭니다. 확인 메일의 링크를 눌러야 로그인할 수 있습니다."
          active={mode === "signup"}
        >
          <SignupForm
            submitting={submitting}
            setSubmitting={setSubmitting}
            setFormError={setFormError}
            showToast={showToast}
          />
        </AuthCard>

        <AuthCard
          title="비밀번호 재설정"
          description="가입한 이메일로 비밀번호 재설정 링크를 보내드립니다."
          active={mode === "reset"}
        >
          <ResetForm
            submitting={submitting}
            setSubmitting={setSubmitting}
            setFormError={setFormError}
            showToast={showToast}
          />
        </AuthCard>
      </div>

      {formError && (
        <p className="mt-md text-sm text-semantic-danger" role="alert">
          {formError}
        </p>
      )}

      <p className="mt-lg text-sm text-text-muted">
        로그인하면 동행 모집글 작성·참가 요청·차단·신고 기능을 이용할 수
        있습니다. 미인증 이메일 계정은 동행 글쓰기 권한이 없습니다.
      </p>
    </div>
  );
}

function AuthCard({
  title,
  description,
  active,
  children,
}: {
  title: string;
  description: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-md border p-lg ${
        active
          ? "border-accent-coral bg-bg-canvas"
          : "hidden border-border-hairline bg-bg-soft"
      }`}
    >
      <h3 className="text-base font-semibold text-text-primary">{title}</h3>
      <p className="mt-xs text-sm text-text-secondary">{description}</p>
      <div className="mt-md">{children}</div>
    </div>
  );
}

interface FormProps {
  submitting: boolean;
  setSubmitting: (v: boolean) => void;
  setFormError: (v: string | null) => void;
  showToast: (message: string, variant?: "success" | "danger" | "info") => void;
}

function LoginForm({
  submitting,
  setSubmitting,
  setFormError,
  showToast,
}: FormProps) {
  return (
    <form
      className="flex flex-col gap-sm"
      onSubmit={async (event) => {
        event.preventDefault();
        setFormError(null);
        setSubmitting(true);
        const formData = new FormData(event.currentTarget);
        try {
          const supabase = createClient();
          const { error } = await supabase.auth.signInWithPassword({
            email: String(formData.get("email") ?? ""),
            password: String(formData.get("password") ?? ""),
          });
          if (error) throw error;
          showToast("로그인되었습니다.", "success");
        } catch (error) {
          setFormError(
            error instanceof Error ? error.message : "로그인에 실패했습니다.",
          );
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <FieldInput name="email" type="email" label="이메일" required />
      <FieldInput
        name="password"
        type="password"
        label="비밀번호"
        required
        minLength={8}
      />
      <SubmitButton submitting={submitting} label="로그인" />
    </form>
  );
}

function SignupForm({
  submitting,
  setSubmitting,
  setFormError,
  showToast,
}: FormProps) {
  return (
    <form
      className="flex flex-col gap-sm"
      onSubmit={async (event) => {
        event.preventDefault();
        setFormError(null);
        setSubmitting(true);
        const formData = new FormData(event.currentTarget);
        try {
          const supabase = createClient();
          const { error } = await supabase.auth.signUp({
            email: String(formData.get("email") ?? ""),
            password: String(formData.get("password") ?? ""),
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback?next=/account`,
            },
          });
          if (error) throw error;
          showToast(
            "확인 메일을 보냈습니다. 메일함을 확인해주세요.",
            "success",
          );
          event.currentTarget.reset();
        } catch (error) {
          setFormError(
            error instanceof Error ? error.message : "가입에 실패했습니다.",
          );
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <FieldInput name="email" type="email" label="이메일" required />
      <FieldInput
        name="password"
        type="password"
        label="비밀번호"
        required
        minLength={8}
      />
      <SubmitButton submitting={submitting} label="가입하기" />
    </form>
  );
}

function ResetForm({
  submitting,
  setSubmitting,
  setFormError,
  showToast,
}: FormProps) {
  return (
    <form
      className="flex flex-col gap-sm"
      onSubmit={async (event) => {
        event.preventDefault();
        setFormError(null);
        setSubmitting(true);
        const formData = new FormData(event.currentTarget);
        try {
          const supabase = createClient();
          const { error } = await supabase.auth.resetPasswordForEmail(
            String(formData.get("email") ?? ""),
            {
              redirectTo: `${window.location.origin}/auth/callback?next=/account`,
            },
          );
          if (error) throw error;
          showToast("재설정 링크를 이메일로 보냈습니다.", "success");
          event.currentTarget.reset();
        } catch (error) {
          setFormError(
            error instanceof Error
              ? error.message
              : "재설정 요청에 실패했습니다.",
          );
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <FieldInput name="email" type="email" label="이메일" required />
      <SubmitButton submitting={submitting} label="재설정 링크 보내기" />
    </form>
  );
}

function MemberEntry({
  user,
  profile,
  onProfileCreated,
  showToast,
}: {
  user: User;
  profile: MemberProfile | null;
  onProfileCreated: () => Promise<void>;
  showToast: (message: string, variant?: "success" | "danger" | "info") => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  if (!profile) {
    return (
      <div className="max-w-[28rem] rounded-md border border-border-hairline bg-bg-soft p-lg">
        <h3 className="text-base font-semibold text-text-primary">
          프로필 완성하기
        </h3>
        <p className="mt-xs text-sm text-text-secondary">
          동행 기능을 사용하려면 닉네임과 연령대를 등록하고 성인 여부를 확인해야
          합니다. 정확한 생년월일은 저장하지 않습니다.
        </p>
        <form
          className="mt-md flex flex-col gap-sm"
          onSubmit={async (event) => {
            event.preventDefault();
            setFormError(null);
            setSubmitting(true);
            const formData = new FormData(event.currentTarget);
            const isAdultChecked = formData.get("is_adult") === "on";
            if (!isAdultChecked) {
              setFormError("성인 확인에 동의해야 프로필을 완성할 수 있습니다.");
              setSubmitting(false);
              return;
            }
            try {
              const supabase = createClient();
              const { error } = await supabase.from("member_profiles").insert({
                id: user.id,
                nickname: String(formData.get("nickname") ?? "").trim(),
                age_group: String(formData.get("age_group") ?? "20s"),
                is_adult: true,
                adult_verified_at: new Date().toISOString(),
              });
              if (error) throw error;
              showToast("프로필이 등록되었습니다.", "success");
              await onProfileCreated();
            } catch (error) {
              setFormError(
                error instanceof Error
                  ? error.message
                  : "프로필 등록에 실패했습니다.",
              );
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <FieldInput
            name="nickname"
            type="text"
            label="닉네임"
            required
            maxLength={30}
          />
          <label className="flex flex-col gap-xs text-sm text-text-secondary">
            연령대
            <select
              name="age_group"
              required
              defaultValue="20s"
              className="rounded-sm border border-border-hairline bg-bg-soft px-sm py-xs text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            >
              {AGE_GROUP_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-start gap-sm text-sm text-text-secondary">
            <input type="checkbox" name="is_adult" className="mt-xs" />만 19세
            이상 성인임을 확인합니다.
          </label>
          {formError && (
            <p className="text-sm text-semantic-danger" role="alert">
              {formError}
            </p>
          )}
          <SubmitButton submitting={submitting} label="프로필 완성하기" />
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-[28rem] rounded-md border border-border-hairline bg-bg-soft p-lg">
      <h3 className="text-base font-semibold text-text-primary">
        {profile.nickname}님
      </h3>
      <p className="mt-xs text-sm text-text-secondary">
        성인 확인: {profile.is_adult ? "완료" : "미완료"}
      </p>

      {formError && (
        <p className="mt-sm text-sm text-semantic-danger" role="alert">
          {formError}
        </p>
      )}

      <div className="mt-md flex flex-wrap gap-sm">
        <button
          type="button"
          className="rounded-sm border border-border-hairline px-md py-xs text-sm text-text-primary hover:bg-bg-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          onClick={async () => {
            const supabase = createClient();
            await supabase.auth.signOut();
            showToast("로그아웃되었습니다.", "info");
          }}
        >
          로그아웃
        </button>

        <button
          type="button"
          disabled={submitting}
          className="rounded-sm border border-semantic-danger px-md py-xs text-sm text-semantic-danger hover:bg-accent-coral-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:opacity-50"
          onClick={async () => {
            const confirmed = window.confirm(
              "탈퇴하면 닉네임과 프로필 정보가 즉시 비식별화됩니다. 계속하시겠습니까?",
            );
            if (!confirmed) return;

            setSubmitting(true);
            setFormError(null);
            try {
              const supabase = createClient();
              const { error: updateError } = await supabase
                .from("member_profiles")
                .update({
                  nickname: "탈퇴한 사용자",
                  travel_style: [],
                  gender: null,
                  is_adult: false,
                  adult_verified_at: null,
                })
                .eq("id", user.id);
              if (updateError) throw updateError;

              const { error: signOutError } = await supabase.auth.signOut();
              if (signOutError) throw signOutError;

              showToast("탈퇴 처리되었습니다.", "info");
            } catch (error) {
              setFormError(
                error instanceof Error
                  ? error.message
                  : "탈퇴 처리에 실패했습니다.",
              );
            } finally {
              setSubmitting(false);
            }
          }}
        >
          탈퇴하기
        </button>
      </div>
    </div>
  );
}

function FieldInput({
  name,
  type,
  label,
  required,
  minLength,
  maxLength,
}: {
  name: string;
  type: string;
  label: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
}) {
  return (
    <label className="flex flex-col gap-xs text-sm text-text-secondary">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        className="rounded-sm border border-border-hairline bg-bg-soft px-sm py-xs text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
      />
    </label>
  );
}

function SubmitButton({
  submitting,
  label,
}: {
  submitting: boolean;
  label: string;
}) {
  return (
    <button
      type="submit"
      disabled={submitting}
      className="rounded-sm bg-accent-coral px-md py-sm text-sm font-semibold text-bg-canvas hover:bg-accent-coral-active focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:opacity-50"
    >
      {submitting ? "처리 중..." : label}
    </button>
  );
}
