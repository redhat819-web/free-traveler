"use client";

/**
 * SCR-005 Member 프로필 — 닉네임·연령대·여행 스타일 필수, 성별 선택.
 * createMyProfile/updateMyProfile(src/lib/db/profiles.ts)은 nickname·age_group만 다루므로,
 * travel_style·gender는 본인 행에 한해 RLS(member_profiles_update_own)로 허용된 직접 갱신으로 저장한다.
 */

import { useEffect, useState } from "react";
import { createClient } from "@/lib/db/browser-client";
import {
  createMyProfile,
  getMyProfile,
  updateMyProfile,
} from "@/lib/db/profiles";
import { useToast } from "@/components/shared/Toast";
import type { AgeGroup, Gender, MemberProfile } from "@/lib/db/types";

const AGE_GROUP_OPTIONS: { value: AgeGroup; label: string }[] = [
  { value: "10s", label: "10대" },
  { value: "20s", label: "20대" },
  { value: "30s", label: "30대" },
  { value: "40s", label: "40대" },
  { value: "50s", label: "50대" },
  { value: "60_plus", label: "60대 이상" },
];

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: "male", label: "남성" },
  { value: "female", label: "여성" },
  { value: "other", label: "그 외" },
  { value: "prefer_not_to_say", label: "선택 안 함" },
];

const STYLE_OPTIONS = [
  "힐링",
  "액티비티",
  "맛집 탐방",
  "사진 촬영",
  "쇼핑",
  "배낭여행",
];

interface ProfileFormProps {
  userId: string;
}

export function ProfileForm({ userId }: ProfileFormProps) {
  const { showToast } = useToast();
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [nickname, setNickname] = useState("");
  const [ageGroup, setAgeGroup] = useState<AgeGroup | "">("");
  const [gender, setGender] = useState<Gender | "">("");
  const [travelStyle, setTravelStyle] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = async () => {
    try {
      const data = await getMyProfile();
      setProfile(data);
      if (data) {
        setNickname(data.nickname);
        setAgeGroup(data.age_group);
        setGender(data.gender ?? "");
        setTravelStyle(data.travel_style ?? []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await loadProfile();
    })();
  }, [userId]);

  const toggleStyle = (style: string) => {
    setTravelStyle((current) =>
      current.includes(style)
        ? current.filter((item) => item !== style)
        : [...current, style],
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!nickname.trim()) {
      setError("닉네임을 입력하세요.");
      return;
    }
    if (!ageGroup) {
      setError("연령대를 선택하세요.");
      return;
    }
    if (travelStyle.length === 0) {
      setError("여행 스타일을 하나 이상 선택하세요.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.set("nickname", nickname.trim());
      formData.set("age_group", ageGroup);

      if (profile) {
        await updateMyProfile(formData);
      } else {
        await createMyProfile(formData);
      }

      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("member_profiles")
        .update({ travel_style: travelStyle, gender: gender || null })
        .eq("id", userId);
      if (updateError) throw updateError;

      showToast("프로필을 저장했습니다.", "success");
      await loadProfile();
    } catch {
      showToast("프로필 저장에 실패했습니다. 다시 시도해주세요.", "danger");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="h-40 animate-pulse rounded-md bg-bg-strong" />;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-md">
      <label className="flex flex-col gap-xs text-sm text-text-secondary">
        닉네임
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={30}
          className="min-h-[44px] rounded-sm border border-border-hairline bg-bg-canvas px-sm text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        />
      </label>

      <label className="flex flex-col gap-xs text-sm text-text-secondary">
        연령대
        <select
          value={ageGroup}
          onChange={(e) => setAgeGroup(e.target.value as AgeGroup)}
          className="min-h-[44px] rounded-sm border border-border-hairline bg-bg-canvas px-sm text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
          <option value="">선택하세요</option>
          {AGE_GROUP_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <div className="flex flex-col gap-xs">
        <span className="text-sm text-text-secondary">여행 스타일</span>
        <div className="flex flex-wrap gap-xs">
          {STYLE_OPTIONS.map((style) => (
            <button
              key={style}
              type="button"
              aria-pressed={travelStyle.includes(style)}
              onClick={() => toggleStyle(style)}
              className={`min-h-[44px] rounded-pill px-sm text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring ${
                travelStyle.includes(style)
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
        성별(선택)
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value as Gender)}
          className="min-h-[44px] rounded-sm border border-border-hairline bg-bg-canvas px-sm text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
          <option value="">선택 안 함</option>
          {GENDER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      {error && (
        <p className="text-sm text-semantic-danger" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="min-h-[44px] self-start rounded-pill bg-accent-coral px-lg py-sm text-sm font-semibold text-bg-canvas hover:bg-accent-coral-active disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
      >
        {submitting ? "저장하는 중..." : "프로필 저장"}
      </button>
    </form>
  );
}
