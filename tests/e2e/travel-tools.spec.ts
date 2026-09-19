import { test, expect } from "@playwright/test";

// 로컬 dev 서버 대상일 때 기본 baseURL(127.0.0.1)로 접속하면 Turbopack HMR 웹소켓
// 핸드셰이크가 실패해 페이지가 자동 새로고침되며 폼 상태가 초기화되는 현상이 있어
// localhost로 접속한다. PLAYWRIGHT_BASE_URL(Vercel Preview 등)이 지정된 경우는 그대로 둔다.
if (!process.env.PLAYWRIGHT_BASE_URL) {
  test.use({ baseURL: "http://localhost:3000" });
}

test.describe("E2E-TRAVEL-TOOLS", () => {
  test("탭 전환 시 항공 입력 상태가 유지된다", async ({ page }) => {
    await page.goto("/travel-tools");

    await page.getByRole("tab", { name: "항공편" }).click();
    const flightForm = page.locator("form:visible");
    const countrySelect = flightForm.locator("select").nth(0);
    const regionSelect = flightForm.locator("select").nth(1);
    await countrySelect.selectOption("일본");
    await regionSelect.selectOption("오사카");

    await page.getByRole("tab", { name: "숙소" }).click();
    await expect(page.getByRole("tab", { name: "숙소" })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    await page.getByRole("tab", { name: "항공편" }).click();
    await expect(countrySelect).toHaveValue("일본");
    await expect(regionSelect).toHaveValue("오사카");
  });

  test("항공 조건 입력 → 검증 오류 → 요약 → 외부 이동 버튼 속성 확인", async ({
    page,
  }) => {
    await page.goto("/travel-tools");
    await page.getByRole("tab", { name: "항공편" }).click();

    const flightForm = page.locator("form:visible");
    await flightForm.getByRole("button", { name: "조건 요약 보기" }).click();
    await expect(flightForm.getByRole("alert").first()).toBeVisible();

    await flightForm.locator("select").nth(0).selectOption("일본");
    await flightForm.locator("select").nth(1).selectOption("오사카");
    const today = new Date();
    const departure = new Date(today.getTime() + 86400000)
      .toISOString()
      .slice(0, 10);
    const returnDate = new Date(today.getTime() + 2 * 86400000)
      .toISOString()
      .slice(0, 10);
    await flightForm.getByLabel("출발일").fill(departure);
    await flightForm.getByLabel("귀국일").fill(returnDate);
    await flightForm.getByRole("button", { name: "조건 요약 보기" }).click();

    await expect(page.getByText("입력 요약")).toBeVisible();

    const outboundLink = page.getByRole("link", { name: /항공편 보러 가기/ });
    await expect(outboundLink).toBeVisible();
    await expect(outboundLink).toHaveAttribute("target", "_blank");
    await expect(outboundLink).toHaveAttribute("rel", /noopener/);
    await expect(outboundLink).toHaveAttribute("rel", /noreferrer/);
  });

  test("숙소 조건 입력 → 검증 오류 → 요약 → 외부 이동 버튼 속성 확인", async ({
    page,
  }) => {
    await page.goto("/travel-tools");
    await page.getByRole("tab", { name: "숙소" }).click();

    const hotelForm = page.locator("form:visible");
    await hotelForm.getByRole("button", { name: "조건 요약 보기" }).click();
    await expect(hotelForm.getByRole("alert").first()).toBeVisible();

    await hotelForm.locator("select").nth(0).selectOption("일본");
    await hotelForm.locator("select").nth(1).selectOption("오사카");
    const today = new Date();
    const checkIn = new Date(today.getTime() + 86400000)
      .toISOString()
      .slice(0, 10);
    const checkOut = new Date(today.getTime() + 2 * 86400000)
      .toISOString()
      .slice(0, 10);
    await hotelForm.getByLabel("체크인").fill(checkIn);
    await hotelForm.getByLabel("체크아웃").fill(checkOut);
    await hotelForm.getByRole("button", { name: "조건 요약 보기" }).click();

    await expect(page.getByText("입력 요약")).toBeVisible();

    const outboundLink = page.getByRole("link", { name: /숙소 보러 가기/ });
    await expect(outboundLink).toBeVisible();
    await expect(outboundLink).toHaveAttribute("target", "_blank");
    await expect(outboundLink).toHaveAttribute("rel", /noopener/);
    await expect(outboundLink).toHaveAttribute("rel", /noreferrer/);
  });
});
