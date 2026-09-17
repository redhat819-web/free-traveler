import { test, expect } from "@playwright/test";

const TEST_USER_EMAIL = process.env.PLAYWRIGHT_TEST_USER_EMAIL;
const TEST_USER_PASSWORD = process.env.PLAYWRIGHT_TEST_USER_PASSWORD;
const hasAuthEnv = Boolean(TEST_USER_EMAIL && TEST_USER_PASSWORD);

test.describe("E2E-MATE-AUTH", () => {
  test.skip(
    !hasAuthEnv,
    "PLAYWRIGHT_TEST_USER_EMAIL / PLAYWRIGHT_TEST_USER_PASSWORD 미설정으로 인증 Smoke를 건너뜁니다.",
  );

  test.beforeEach(async ({ page }) => {
    await page.goto("/account");
    await page.getByRole("tab", { name: /로그인/ }).click();
    await page.getByLabel(/이메일/).fill(TEST_USER_EMAIL!);
    await page.getByLabel(/비밀번호/).fill(TEST_USER_PASSWORD!);
    await page.getByRole("button", { name: /로그인/ }).click();
  });

  test("E2E-006 로그인 사용자의 동행글 작성과 목록·상세 확인", async ({
    page,
  }) => {
    await page.goto("/travel-tools");
    await page.getByRole("tab", { name: /동행/ }).click();

    const title = `Playwright Smoke ${Date.now()}`;
    await page.getByLabel(/제목/).fill(title);
    await page
      .getByLabel(/국가|지역/)
      .first()
      .fill("일본");
    await page.getByLabel(/안전수칙/).check();
    await page.getByRole("button", { name: /작성 완료|등록/ }).click();

    await page.goto("/mates");
    await expect(
      page.getByRole("link", { name: new RegExp(title) }),
    ).toBeVisible();

    await page.getByRole("link", { name: new RegExp(title) }).click();
    await expect(
      page.getByRole("heading", { name: new RegExp(title) }),
    ).toBeVisible();
  });

  test("E2E-007 동행글 신청과 계정 화면의 내 활동 확인", async ({ page }) => {
    await page.goto("/mates");

    const firstMateCard = page.getByTestId("mate-card").first();
    await expect(firstMateCard).toBeVisible();
    await firstMateCard.click();

    await page.getByRole("button", { name: /참가 요청|신청하기/ }).click();
    await expect(page.getByText(/요청.*완료|신청.*완료/)).toBeVisible();

    await page.goto("/account");
    await page.getByRole("tab", { name: /내 활동/ }).click();
    await expect(page.getByText(/참가 요청/)).toBeVisible();
  });
});
