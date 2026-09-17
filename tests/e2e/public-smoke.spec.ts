import { test, expect } from "@playwright/test";

test.describe("E2E-PUBLIC-SMOKE", () => {
  test("E2E-001 메인 페이지의 추천 여행지와 주요 CTA", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: /인기 여행지|추천 여행지/ }).first(),
    ).toBeVisible();

    const destinationCards = page.getByTestId("destination-card");
    await expect(destinationCards.first()).toBeVisible();

    await expect(
      page.getByRole("link", { name: /대표 소개 보러가기|대표 소개/ }),
    ).toBeVisible();
  });

  test("E2E-002 대표 소개의 free_traveler, 50회 이상, 30개국 이상", async ({
    page,
  }) => {
    await page.goto("/about");

    await expect(page.getByText(/free_traveler/i).first()).toBeVisible();
    await expect(page.getByText(/50\+|50회 이상/).first()).toBeVisible();
    await expect(page.getByText(/30\+|30개국 이상/).first()).toBeVisible();
  });

  test("E2E-003 여행 도구의 항공 외부 이동 안내와 href", async ({ page }) => {
    await page.goto("/travel-tools");

    await page.getByRole("tab", { name: /항공/ }).click();

    await expect(
      page.getByText(/입력값은 외부 사이트로 전달되지 않습니다/),
    ).toBeVisible();

    const outboundLink = page.getByRole("link", {
      name: /항공권 찾아보기|외부.*이동|이동하기/,
    });
    await expect(outboundLink).toBeVisible();
    await expect(outboundLink).toHaveAttribute("href", /^https?:\/\//);
    await expect(outboundLink).toHaveAttribute("target", "_blank");
    await expect(outboundLink).toHaveAttribute("rel", /noopener/);
    await expect(outboundLink).toHaveAttribute("rel", /noreferrer/);
  });

  test("E2E-004 여행 도구의 숙소 외부 이동 안내와 href", async ({ page }) => {
    await page.goto("/travel-tools");

    await page.getByRole("tab", { name: /숙소|숙박/ }).click();

    await expect(
      page.getByText(/입력값은 외부 사이트로 전달되지 않습니다/),
    ).toBeVisible();

    const outboundLink = page.getByRole("link", {
      name: /숙소 찾아보기|외부.*이동|이동하기/,
    });
    await expect(outboundLink).toBeVisible();
    await expect(outboundLink).toHaveAttribute("href", /^https?:\/\//);
    await expect(outboundLink).toHaveAttribute("target", "_blank");
    await expect(outboundLink).toHaveAttribute("rel", /noopener/);
    await expect(outboundLink).toHaveAttribute("rel", /noreferrer/);
  });

  test("E2E-005 비로그인 동행글 작성의 로그인 안내", async ({ page }) => {
    await page.goto("/travel-tools");

    await page.getByRole("tab", { name: /동행/ }).click();

    await expect(
      page
        .getByRole("heading", { name: /로그인|성인 확인/ })
        .or(page.getByText(/로그인.*필요|로그인 후 이용/)),
    ).toBeVisible();

    await expect(page.getByRole("link", { name: /로그인|계정/ })).toBeVisible();
  });
});
