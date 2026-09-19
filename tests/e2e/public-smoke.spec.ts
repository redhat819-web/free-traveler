import { test, expect } from "@playwright/test";

// 로컬 dev 서버 대상일 때 기본 baseURL(127.0.0.1)로 접속하면 Turbopack HMR 웹소켓
// 핸드셰이크가 실패해 페이지가 자동 새로고침되는 현상이 있어 localhost로 접속한다.
// PLAYWRIGHT_BASE_URL(Vercel Preview 등)이 지정된 경우는 그대로 둔다.
if (!process.env.PLAYWRIGHT_BASE_URL) {
  test.use({ baseURL: "http://localhost:3000" });
}

test.describe("E2E-PUBLIC-SMOKE", () => {
  test("홈 진입 → 국내/해외 탭 전환 → 여행지 상세 Drawer → 안전정보 전환", async ({
    page,
  }) => {
    await page.goto("/");

    const tabs = page.getByRole("tablist", { name: "국내/해외 전환" });
    await expect(tabs.getByRole("tab", { name: "국내" })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    await tabs.getByRole("tab", { name: "해외" }).click();
    await expect(tabs.getByRole("tab", { name: "해외" })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    await page.getByRole("button", { name: /오사카/ }).click();

    const drawer = page.getByRole("dialog", { name: /상세 정보/ });
    await expect(drawer).toBeVisible();
    await expect(drawer.getByRole("heading", { name: "오사카" })).toBeVisible();

    await drawer.getByRole("button", { name: "국가 안전정보 보기 →" }).click();
    await expect(
      drawer.getByRole("heading", { name: "일본 안전정보" }),
    ).toBeVisible();
    await expect(drawer.getByRole("heading", { name: "치안" })).toBeVisible();

    await drawer
      .getByRole("button", { name: "← 여행지 정보로 돌아가기" })
      .click();
    await expect(drawer.getByRole("heading", { name: "오사카" })).toBeVisible();
  });

  test("About 페이지 렌더", async ({ page }) => {
    await page.goto("/about");

    await expect(page.getByText(/free_traveler/i).first()).toBeVisible();
    await expect(page.getByText(/\d+회/).first()).toBeVisible();
    await expect(page.getByText(/\d+개국/).first()).toBeVisible();
  });

  test("동행 목록 비로그인 열람", async ({ page }) => {
    await page.goto("/mates");

    await expect(
      page.getByRole("heading", { name: "믿을 수 있는 동행을 찾아보세요" }),
    ).toBeVisible();
    await expect(
      page.getByText("동행 목록을 불러오지 못했습니다."),
    ).not.toBeVisible();
  });

  test("존재하지 않는 라우트는 404를 표시한다", async ({ page }) => {
    const response = await page.goto("/this-route-does-not-exist");

    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole("heading", { name: "페이지를 찾을 수 없습니다" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "메인으로 이동" }),
    ).toBeVisible();
  });
});
