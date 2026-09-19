import Link from "next/link";

export default function NotFound() {
  return (
    <section className="bg-bg-canvas px-gutter py-xl">
      <div className="mx-auto flex max-w-container-max flex-col items-center gap-md py-xl text-center">
        <p className="text-sm font-semibold text-accent-coral">404</p>
        <h1 className="text-2xl font-semibold text-text-primary">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="max-w-md text-sm text-text-secondary">
          주소가 잘못되었거나 삭제된 페이지일 수 있습니다. 아래 버튼으로 메인
          화면으로 돌아가세요.
        </p>
        <Link
          href="/"
          className="mt-sm min-h-[44px] rounded-pill bg-accent-coral px-lg py-sm text-sm font-semibold text-bg-canvas hover:bg-accent-coral-active focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
          메인으로 이동
        </Link>
      </div>
    </section>
  );
}
