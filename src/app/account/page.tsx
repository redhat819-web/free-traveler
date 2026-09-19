"use client";

/**
 * SCR-005 계정·관리 화면 조립.
 * 새 Component를 만들지 않고, 이미 만들어진 CMP-SCR005-* Component를 이 Page Entry에서
 * 조립만 한다(CLAUDE.md 규칙 9). Guest/Member/Admin 역할 판별은 이 파일에서만 관리한다.
 */

import { useEffect, useState } from "react";
import { createClient } from "@/lib/db/browser-client";
import { AuthPanel } from "@/components/account/AuthPanel";
import { ProfileForm } from "@/components/account/ProfileForm";
import { MyActivity } from "@/components/account/MyActivity";
import { AdminPanel } from "@/components/account/AdminPanel";
import { PolicyPages } from "@/components/account/PolicyPages";
import type { MemberProfile } from "@/lib/db/types";

type Role = "guest" | "member" | "admin";

function RoleSkeleton() {
  return (
    <div
      role="status"
      aria-label="계정 상태를 확인하는 중"
      className="mx-auto grid max-w-container-max gap-md px-gutter py-lg sm:grid-cols-3"
    >
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-40 animate-pulse rounded-md bg-bg-strong" />
      ))}
    </div>
  );
}

export default function AccountPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionError, setSessionError] = useState(false);

  const loadSession = async () => {
    setSessionError(false);
    setLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);

      if (user) {
        const { data } = await supabase
          .from("member_profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();
        setProfile((data as MemberProfile) ?? null);
      } else {
        setProfile(null);
      }
    } catch {
      setSessionError(true);
    } finally {
      setLoading(false);
    }
  };

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
        // env 미설정 시 loadSession에서 이미 오류를 처리했으므로 무시한다.
      }
    })();
    return () => unsubscribe?.();
  }, []);

  const role: Role = !userId
    ? "guest"
    : profile?.role === "admin"
      ? "admin"
      : "member";

  const ROLE_INTRO: Record<Role, { title: string; description: string }> = {
    guest: {
      title: "계정이 필요하신가요?",
      description:
        "로그인하면 동행 모집글 작성, 참가 요청, 신고·차단 기능을 이용할 수 있습니다.",
    },
    member: {
      title: `${profile?.nickname ?? "회원"}님, 환영합니다`,
      description:
        "프로필과 내 활동을 관리하고, 안전 정책을 다시 확인할 수 있습니다.",
    },
    admin: {
      title: `${profile?.nickname ?? "관리자"}님, 관리자로 로그인했습니다`,
      description:
        "신고 처리와 외부 URL 허용목록을 이곳에서 관리할 수 있습니다.",
    },
  };

  return (
    <>
      <section className="bg-bg-canvas px-gutter py-lg">
        <div className="mx-auto max-w-container-max text-center">
          <h1 className="text-2xl font-semibold text-text-primary">
            {loading ? "계정" : ROLE_INTRO[role].title}
          </h1>
          {!loading && (
            <p className="mt-xs text-sm text-text-secondary">
              {ROLE_INTRO[role].description}
            </p>
          )}
        </div>
      </section>

      {loading ? (
        <RoleSkeleton />
      ) : sessionError ? (
        <section className="bg-bg-canvas px-gutter py-lg">
          <div className="mx-auto max-w-container-max rounded-md border border-border-hairline bg-bg-soft p-lg text-center">
            <p className="text-sm font-semibold text-text-primary">
              계정 상태를 확인하지 못했습니다.
            </p>
            <button
              type="button"
              onClick={loadSession}
              className="mt-sm min-h-[44px] rounded-pill bg-accent-coral px-lg text-sm font-semibold text-bg-canvas hover:bg-accent-coral-active"
            >
              다시 시도
            </button>
          </div>
        </section>
      ) : (
        <section className="bg-bg-canvas px-gutter py-lg">
          <div className="mx-auto flex max-w-container-max flex-col gap-lg">
            <AuthPanel />

            {userId && (
              <div className="grid grid-cols-1 gap-lg lg:grid-cols-2">
                <div className="rounded-md border border-border-hairline bg-bg-soft p-lg">
                  <h2 className="text-lg font-semibold text-text-primary">
                    프로필
                  </h2>
                  <div className="mt-sm">
                    <ProfileForm userId={userId} />
                  </div>
                </div>

                <div className="rounded-md border border-border-hairline bg-bg-soft p-lg">
                  <MyActivity userId={userId} />
                </div>
              </div>
            )}

            {role === "admin" && (
              <div className="rounded-md border border-border-hairline bg-bg-soft p-lg">
                <h2 className="text-lg font-semibold text-text-primary">
                  관리자
                </h2>
                <div className="mt-sm">
                  <AdminPanel />
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="bg-bg-soft px-gutter py-lg">
        <div className="mx-auto max-w-container-max">
          <h2 className="text-lg font-semibold text-text-primary">정책 안내</h2>
          <div className="mt-sm">
            <PolicyPages />
          </div>
        </div>
      </section>
    </>
  );
}
