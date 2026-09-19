import type { Metadata } from "next";
import Link from "next/link";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/shared/Toast";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "free_traveler",
    template: "%s | free_traveler",
  },
  description: "무료 여행 정보 서비스 free_traveler",
  openGraph: {
    siteName: "free_traveler",
    type: "website",
    locale: "ko_KR",
  },
};

const NAV_ITEMS = [
  { href: "/", label: "메인" },
  { href: "/about", label: "대표 소개" },
  { href: "/travel-tools", label: "여행 준비" },
  { href: "/mates", label: "동행 찾기" },
] as const;

function Wordmark() {
  return (
    <Link
      href="/"
      className="rounded-sm text-lg font-bold text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
    >
      free_traveler
    </Link>
  );
}

function DesktopNav() {
  return (
    <nav aria-label="주요 화면" className="hidden items-center gap-lg md:flex">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="text-sm text-text-secondary hover:text-accent-coral focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function AccountLink() {
  return (
    <Link
      href="/account"
      className="rounded-pill border border-border-hairline px-md py-xs text-sm text-text-primary hover:border-accent-coral hover:text-accent-coral focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
    >
      계정
    </Link>
  );
}

function MobileNavSheet() {
  return (
    <details className="md:hidden">
      <summary
        aria-label="메뉴 열기"
        className="list-none rounded-sm border border-border-hairline p-sm text-text-primary [&::-webkit-details-marker]:hidden"
      >
        <span aria-hidden="true">☰</span>
      </summary>
      <nav
        aria-label="주요 화면(모바일)"
        className="mt-sm flex flex-col gap-sm rounded-md border border-border-hairline bg-bg-soft p-md"
      >
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-sm text-text-secondary hover:text-accent-coral"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </details>
  );
}

function Header() {
  return (
    <header className="border-b border-border-hairline bg-bg-canvas">
      <div className="mx-auto flex max-w-container-max items-center justify-between gap-md px-gutter py-md">
        <Wordmark />
        <DesktopNav />
        <div className="flex items-center gap-sm">
          <AccountLink />
          <MobileNavSheet />
        </div>
      </div>
    </header>
  );
}

const FOOTER_POLICY_ITEMS = [
  "이용약관",
  "개인정보처리방침",
  "안전 수칙",
  "면책 고지",
];

function Footer() {
  return (
    <footer className="border-t border-border-hairline bg-bg-soft">
      <div className="mx-auto grid max-w-container-max grid-cols-1 gap-lg px-gutter py-xl md:grid-cols-3">
        <div className="flex flex-col gap-sm">
          <span className="text-lg font-bold text-text-primary">
            free_traveler
          </span>
          <p className="text-sm text-text-secondary">
            10년간 50회 넘게 여행하며 기록한 여행지·안전정보를 무료로 나누는
            개인 여행자의 서비스입니다.
          </p>
        </div>
        <nav aria-label="바로가기" className="flex flex-col gap-sm">
          <span className="text-sm font-bold text-text-primary">바로가기</span>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-text-secondary hover:text-accent-coral"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-sm">
          <span className="text-sm font-bold text-text-primary">고지</span>
          <ul className="flex flex-col gap-xs text-sm text-text-secondary">
            {FOOTER_POLICY_ITEMS.map((label) => (
              <li key={label}>{label}</li>
            ))}
          </ul>
          <p className="text-sm text-text-muted">
            © 2026 free_traveler. 예약·결제를 대행하지 않는 정보 제공 전용
            서비스입니다.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ko"
      className={`${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-bg-canvas text-text-primary">
        <ToastProvider>
          <div id="app-shell" className="flex min-h-full flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
