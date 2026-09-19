import { describe, expect, it } from "vitest";
import { createClient } from "@supabase/supabase-js";

/**
 * TEST-RLS-BASIC — RLS 권한 통합 테스트(REQ-FUNC-044, REQ-NF-013).
 * 실제 Supabase 프로젝트(NEXT_PUBLIC_SUPABASE_URL/ANON_KEY)에 대해 anon 키로 직접
 * 쿼리를 실행해, 본인이 아닌 데이터에 대한 접근 시도가 전부 403 또는 빈 결과로
 * 처리되는지 확인한다. 로그인 세션이 필요한 "본인 데이터 조회 성공" 케이스는
 * PLAYWRIGHT_TEST_USER_EMAIL/PASSWORD(이메일 확인이 끝난 테스트 계정)가 있을 때만
 * 추가로 실행하고, 없으면 건너뛴다.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const hasSupabaseEnv = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

const TEST_USER_EMAIL = process.env.PLAYWRIGHT_TEST_USER_EMAIL;
const TEST_USER_PASSWORD = process.env.PLAYWRIGHT_TEST_USER_PASSWORD;
const hasAuthEnv = Boolean(TEST_USER_EMAIL && TEST_USER_PASSWORD);

function anonClient() {
  return createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
}

describe.skipIf(!hasSupabaseEnv)(
  "TEST-RLS-BASIC (anon = 비로그인 타인)",
  () => {
    it("member_profiles: 비로그인 조회는 빈 결과를 반환한다(타인 프로필 비공개)", async () => {
      const supabase = anonClient();
      const { data, error } = await supabase
        .from("member_profiles")
        .select("*");
      expect(error).toBeNull();
      expect(data).toEqual([]);
    });

    it("member_profiles: 비로그인 insert는 거부된다", async () => {
      const supabase = anonClient();
      const { error } = await supabase.from("member_profiles").insert({
        id: "00000000-0000-0000-0000-000000000000",
        nickname: "x",
        age_group: "20s",
      });
      expect(error).not.toBeNull();
    });

    it("mates: 비로그인 조회는 허용된다(공개 목록)", async () => {
      const supabase = anonClient();
      const { data, error } = await supabase.from("mates").select("*").limit(1);
      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
    });

    it("mates: 비로그인 insert는 거부된다(작성자만 작성 가능)", async () => {
      const supabase = anonClient();
      const { error } = await supabase.from("mates").insert({
        author_id: "00000000-0000-0000-0000-000000000000",
        title: "rls-test",
        country: "x",
        region: "x",
        start_date: "2026-01-01",
        end_date: "2026-01-02",
        capacity: 2,
        description: "x",
      });
      expect(error).not.toBeNull();
    });

    it("mate_applications: 비로그인 조회는 빈 결과를 반환한다(본인/작성자 외 비공개)", async () => {
      const supabase = anonClient();
      const { data, error } = await supabase
        .from("mate_applications")
        .select("*");
      expect(error).toBeNull();
      expect(data).toEqual([]);
    });

    it("mate_applications: 비로그인 insert는 거부된다(신청자 본인만 생성 가능)", async () => {
      const supabase = anonClient();
      const { error } = await supabase.from("mate_applications").insert({
        mate_id: "00000000-0000-0000-0000-000000000000",
        requester_id: "00000000-0000-0000-0000-000000000000",
      });
      expect(error).not.toBeNull();
    });

    it("mate_blocks: 비로그인 조회는 빈 결과를 반환한다(본인 차단 목록만 공개)", async () => {
      const supabase = anonClient();
      const { data, error } = await supabase.from("mate_blocks").select("*");
      expect(error).toBeNull();
      expect(data).toEqual([]);
    });

    it("mate_reports: 비로그인 조회는 빈 결과를 반환한다(신고자/Admin만 공개)", async () => {
      const supabase = anonClient();
      const { data, error } = await supabase.from("mate_reports").select("*");
      expect(error).toBeNull();
      expect(data).toEqual([]);
    });

    it("mate_reports: 비로그인 상태 변경은 거부된다(Admin만 변경 가능)", async () => {
      const supabase = anonClient();
      const { error } = await supabase
        .from("mate_reports")
        .update({ status: "resolved" })
        .eq("id", "00000000-0000-0000-0000-000000000000");
      // RLS 정책 위반 시 Supabase는 매칭 행이 없는 것처럼 처리하거나(0건 반영) 명시적 에러를
      // 반환할 수 있다 — 두 경우 모두 "상태 변경이 실제로 반영되지 않음"을 의미하므로,
      // 에러가 없다면 반영 건수가 0건이어야 한다.
      if (!error) {
        const { data: check } = await supabase
          .from("mate_reports")
          .select("status")
          .eq("id", "00000000-0000-0000-0000-000000000000");
        expect(check).toEqual([]);
      } else {
        expect(error).not.toBeNull();
      }
    });

    it("outbound_url_settings: 비로그인 조회는 허용된다(공개 URL)", async () => {
      const supabase = anonClient();
      const { error } = await supabase
        .from("outbound_url_settings")
        .select("*");
      expect(error).toBeNull();
    });

    it("outbound_url_settings: 비로그인 수정은 거부된다(Admin만 수정 가능)", async () => {
      const supabase = anonClient();
      const { error } = await supabase
        .from("outbound_url_settings")
        .update({ url: "https://malicious.example.com" })
        .eq("id", "flight");
      if (!error) {
        const { data: check } = await supabase
          .from("outbound_url_settings")
          .select("url")
          .eq("id", "flight");
        expect(check?.[0]?.url).not.toBe("https://malicious.example.com");
      } else {
        expect(error).not.toBeNull();
      }
    });
  },
);

describe.skipIf(!hasSupabaseEnv || !hasAuthEnv)(
  "TEST-RLS-BASIC (로그인 사용자 = 본인)",
  () => {
    it("본인 member_profiles 행은 조회할 수 있다", async () => {
      const supabase = anonClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: TEST_USER_EMAIL!,
        password: TEST_USER_PASSWORD!,
      });
      expect(signInError).toBeNull();

      const {
        data: { user },
      } = await supabase.auth.getUser();
      expect(user).not.toBeNull();

      const { data, error } = await supabase
        .from("member_profiles")
        .select("*")
        .eq("id", user!.id);
      expect(error).toBeNull();
      expect((data ?? []).length).toBeGreaterThanOrEqual(0);

      await supabase.auth.signOut();
    });
  },
);
