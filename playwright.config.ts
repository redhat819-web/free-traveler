import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";
const isPreviewTarget = Boolean(process.env.PLAYWRIGHT_BASE_URL);

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: isPreviewTarget
    ? undefined
    : {
        // 프로덕션 빌드로 실행한다 — next dev는 라우트별 최초 요청 시 JIT
        // 컴파일이 일어나, fullyParallel로 여러 라우트를 동시에 처음 두드리면
        // 컴파일 경합으로 액션 타임아웃(기본 30s)을 넘기는 경우가 있었다
        // (배포 환경과도 next start 쪽이 더 가깝다).
        command: "npm run build && npm run start",
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
      },
});
