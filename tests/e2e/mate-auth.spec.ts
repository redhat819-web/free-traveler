import { test, expect, type Page } from "@playwright/test";

/**
 * E2E-MATE-AUTH — 로그인(작성자/참가자) → 동행글 작성 → 참가 요청 → 승인 → 신고 접수
 * 1회 전체 경로 Smoke.
 *
 * Supabase는 기본적으로 회원가입 후 이메일 확인이 필요해 Playwright가 단독으로
 * 회원가입→로그인까지 자동 완료할 수 없다. 그래서 이 Task는 사전에 이메일 확인이
 * 끝난 테스트 계정 2개(작성자/참가자)를 환경변수로 주입받아 로그인부터 검증한다.
 * 계정이 없으면 실행 자체를 건너뛴다(auth-smoke.spec.ts와 동일한 관례).
 */

const AUTHOR_EMAIL = process.env.PLAYWRIGHT_TEST_USER_EMAIL;
const AUTHOR_PASSWORD = process.env.PLAYWRIGHT_TEST_USER_PASSWORD;
const PARTICIPANT_EMAIL = process.env.PLAYWRIGHT_TEST_USER2_EMAIL;
const PARTICIPANT_PASSWORD = process.env.PLAYWRIGHT_TEST_USER2_PASSWORD;

const hasBothTestUsers = Boolean(
  AUTHOR_EMAIL && AUTHOR_PASSWORD && PARTICIPANT_EMAIL && PARTICIPANT_PASSWORD,
);

if (!process.env.PLAYWRIGHT_BASE_URL) {
  test.use({ baseURL: "http://localhost:3000" });
}

async function login(page: Page, email: string, password: string) {
  await page.goto("/account");
  await page.getByRole("tab", { name: "로그인" }).click();
  const form = page.locator("form:visible");
  await form.getByLabel("이메일").fill(email);
  await form.getByLabel("비밀번호").fill(password);
  await form.getByRole("button", { name: "로그인" }).click();

  // 프로필이 아직 없는 계정이면 최소 프로필(닉네임/연령대/성인 확인)을 완성한다.
  const completeProfileHeading = page.getByRole("heading", { name: "프로필 완성하기" });
  if (await completeProfileHeading.isVisible({ timeout: 5000 }).catch(() => false)) {
    const profileForm = page.locator("form:visible");
    await profileForm.getByLabel("닉네임").fill(`e2e-${Date.now()}`);
    await profileForm.getByLabel("만 19세 이상 성인임을 확인합니다.").check();
    await profileForm.getByRole("button", { name: "프로필 완성하기" }).click();
  }

  await expect(page.getByRole("button", { name: "로그아웃" })).toBeVisible({ timeout: 10000 });
}

test.describe("E2E-MATE-AUTH", () => {
  test.skip(
    !hasBothTestUsers,
    "PLAYWRIGHT_TEST_USER_EMAIL/PASSWORD, PLAYWRIGHT_TEST_USER2_EMAIL/PASSWORD(이메일 확인 완료된 테스트 계정 2개) 미설정으로 건너뜁니다.",
  );

  test("작성자 로그인 → 동행글 작성 → 참가자 로그인 → 참가 요청 → 신고 접수 → 작성자 승인", async ({
    browser,
  }) => {
    const title = `E2E 동행 모집 ${Date.now()}`;

    // 1) 작성자 로그인(+ 필요 시 성인 확인 포함 프로필 완성) → 동행 모집글 작성
    const authorContext = await browser.newContext();
    const authorPage = await authorContext.newPage();
    await login(authorPage, AUTHOR_EMAIL!, AUTHOR_PASSWORD!);

    await authorPage.goto("/travel-tools");
    await authorPage.getByRole("tab", { name: "동행 구하기" }).click();
    const composeForm = authorPage.locator("form:visible");

    const today = new Date();
    const startDate = new Date(today.getTime() + 86400000).toISOString().slice(0, 10);
    const endDate = new Date(today.getTime() + 3 * 86400000).toISOString().slice(0, 10);

    await composeForm.getByLabel("제목").fill(title);
    await composeForm.getByLabel("국가").fill("테스트국가");
    await composeForm.getByLabel("지역").fill("테스트지역");
    await composeForm.getByLabel("시작일").fill(startDate);
    await composeForm.getByLabel("종료일").fill(endDate);
    await composeForm.getByLabel("소개").fill("E2E-MATE-AUTH 자동화 테스트용 모집글입니다.");
    await composeForm.getByRole("checkbox").check();
    await composeForm.getByRole("button", { name: "동행 모집글 등록하기" }).click();

    await expect(authorPage.getByText("모집글이 등록되었습니다.")).toBeVisible();

    // 2) 참가자 로그인 → 방금 등록된 모집글에 참가 요청 + 신고 접수
    const participantContext = await browser.newContext();
    const participantPage = await participantContext.newPage();
    await login(participantPage, PARTICIPANT_EMAIL!, PARTICIPANT_PASSWORD!);

    await participantPage.goto("/mates");
    await participantPage.getByRole("button", { name: new RegExp(title) }).click();

    const joinForm = participantPage.locator("form").filter({ hasText: "참가 요청 보내기" });
    await joinForm.getByLabel(/참가 요청 메시지/).fill("함께 하고 싶습니다!");
    await joinForm.getByRole("button", { name: "참가 요청 보내기" }).click();
    await expect(participantPage.getByText("참가 요청을 보냈습니다.")).toBeVisible();

    await participantPage.getByRole("button", { name: "신고하기" }).click();
    await participantPage.getByLabel("스팸/광고").check();
    await participantPage.getByRole("button", { name: "신고 제출" }).click();
    await expect(participantPage.getByText("신고가 접수되었습니다.")).toBeVisible();
    await expect(participantPage.getByText(/신고 번호:/)).toBeVisible();

    // 3) 작성자가 참가 요청을 승인
    await authorPage.goto("/mates");
    await authorPage.getByRole("button", { name: new RegExp(title) }).click();
    await expect(authorPage.getByText("참가 요청 목록")).toBeVisible();
    await authorPage.getByRole("button", { name: "승인" }).first().click();
    await expect(authorPage.getByText("참가 요청을 승인했습니다.")).toBeVisible();

    await authorContext.close();
    await participantContext.close();
  });
});
