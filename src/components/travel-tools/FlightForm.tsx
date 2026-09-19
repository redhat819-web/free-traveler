"use client";

/**
 * SCR-003 항공 조건 Form + 요약 + 외부 이동.
 * 입력값(국가/지역/날짜)은 브라우저 state에만 존재하며 서버·DB·분석 이벤트·외부 URL query로
 * 전달하지 않는다(CLAUDE.md 규칙 12).
 */

import { useEffect, useState } from "react";
import { listOutboundUrlSettings } from "@/lib/db/settings";

const COUNTRY_REGIONS: Record<string, string[]> = {
  일본: ["오사카", "도쿄", "삿포로", "후쿠오카"],
  베트남: ["다낭", "호이안", "호치민"],
  태국: ["방콕", "치앙마이", "푸켓"],
  프랑스: ["파리", "니스"],
  이탈리아: ["로마", "베네치아", "밀라노"],
  미국: ["뉴욕", "로스앤젤레스", "샌프란시스코"],
};

const DEFAULT_FLIGHT_URL = "https://www.google.com/travel/flights";

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

interface FormState {
  country: string;
  region: string;
  departureDate: string;
  returnDate: string;
}

interface FormErrors {
  country?: string;
  region?: string;
  departureDate?: string;
  returnDate?: string;
}

function validate(state: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!state.country) errors.country = "국가를 선택하세요.";
  if (!state.region) errors.region = "지역을 선택하세요.";
  if (!state.departureDate) errors.departureDate = "출발일을 입력하세요.";
  if (!state.returnDate) errors.returnDate = "귀국일을 입력하세요.";

  if (state.departureDate && state.departureDate < todayIso()) {
    errors.departureDate = "출발일은 오늘 이후여야 합니다.";
  }
  if (
    state.departureDate &&
    state.returnDate &&
    state.returnDate < state.departureDate
  ) {
    errors.returnDate = "귀국일은 출발일 이후여야 합니다.";
  }
  return errors;
}

export function FlightForm() {
  const [form, setForm] = useState<FormState>({
    country: "",
    region: "",
    departureDate: "",
    returnDate: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [outboundUrl, setOutboundUrl] = useState(DEFAULT_FLIGHT_URL);
  const [urlError, setUrlError] = useState(false);

  const loadUrl = async () => {
    setUrlError(false);
    try {
      const settings = await listOutboundUrlSettings();
      const flight = settings.find((s) => s.id === "flight");
      if (flight?.url) setOutboundUrl(flight.url);
    } catch {
      setUrlError(true);
    }
  };

  useEffect(() => {
    (async () => {
      await loadUrl();
    })();
  }, []);

  const countries = Object.keys(COUNTRY_REGIONS);
  const regions = form.country ? COUNTRY_REGIONS[form.country] : [];

  return (
    <div className="flex flex-col gap-lg">
      <form
        className="grid grid-cols-1 gap-md sm:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          const result = validate(form);
          setErrors(result);
          setSubmitted(Object.keys(result).length === 0);
        }}
      >
        <label className="flex flex-col gap-xs text-sm text-text-secondary">
          국가
          <select
            value={form.country}
            onChange={(event) => {
              setForm({ ...form, country: event.target.value, region: "" });
              setSubmitted(false);
            }}
            className="rounded-sm border border-border-hairline bg-bg-soft px-sm py-xs text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          >
            <option value="">선택하세요</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          {errors.country && (
            <span className="text-xs text-semantic-danger" role="alert">
              {errors.country}
            </span>
          )}
        </label>

        <label className="flex flex-col gap-xs text-sm text-text-secondary">
          지역
          <select
            value={form.region}
            disabled={!form.country}
            onChange={(event) => {
              setForm({ ...form, region: event.target.value });
              setSubmitted(false);
            }}
            className="rounded-sm border border-border-hairline bg-bg-soft px-sm py-xs text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:opacity-50"
          >
            <option value="">
              {form.country ? "선택하세요" : "국가를 먼저 선택하세요"}
            </option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
          {errors.region && (
            <span className="text-xs text-semantic-danger" role="alert">
              {errors.region}
            </span>
          )}
        </label>

        <label className="flex flex-col gap-xs text-sm text-text-secondary">
          출발일
          <input
            type="date"
            value={form.departureDate}
            min={todayIso()}
            onChange={(event) => {
              setForm({ ...form, departureDate: event.target.value });
              setSubmitted(false);
            }}
            className="rounded-sm border border-border-hairline bg-bg-soft px-sm py-xs text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          />
          {errors.departureDate && (
            <span className="text-xs text-semantic-danger" role="alert">
              {errors.departureDate}
            </span>
          )}
        </label>

        <label className="flex flex-col gap-xs text-sm text-text-secondary">
          귀국일
          <input
            type="date"
            value={form.returnDate}
            min={form.departureDate || todayIso()}
            onChange={(event) => {
              setForm({ ...form, returnDate: event.target.value });
              setSubmitted(false);
            }}
            className="rounded-sm border border-border-hairline bg-bg-soft px-sm py-xs text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          />
          {errors.returnDate && (
            <span className="text-xs text-semantic-danger" role="alert">
              {errors.returnDate}
            </span>
          )}
        </label>

        <div className="sm:col-span-2">
          <button
            type="submit"
            className="rounded-pill bg-accent-coral px-lg py-sm text-sm font-semibold text-bg-canvas hover:bg-accent-coral-active focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          >
            조건 요약 보기
          </button>
        </div>
      </form>

      {submitted && (
        <div className="grid grid-cols-1 gap-md rounded-md border border-border-hairline bg-bg-soft p-lg sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold text-text-primary">
              입력 요약
            </h3>
            <dl className="mt-xs flex flex-col gap-xs text-sm text-text-secondary">
              <div>
                <dt className="inline font-medium text-text-primary">여행지</dt>
                <dd className="inline">
                  {" "}
                  {form.country} · {form.region}
                </dd>
              </div>
              <div>
                <dt className="inline font-medium text-text-primary">기간</dt>
                <dd className="inline">
                  {" "}
                  {form.departureDate} ~ {form.returnDate}
                </dd>
              </div>
            </dl>
          </div>

          <div className="flex flex-col items-start gap-sm">
            {urlError ? (
              <>
                <p className="text-sm text-semantic-danger">
                  외부 항공권 검색 사이트 정보를 불러오지 못했습니다.
                </p>
                <button
                  type="button"
                  onClick={() => void loadUrl()}
                  className="rounded-pill border border-border-hairline px-md py-xs text-sm text-text-primary hover:bg-bg-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                >
                  다시 시도
                </button>
              </>
            ) : (
              <a
                href={outboundUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-pill bg-accent-coral px-lg py-sm text-sm font-semibold text-bg-canvas hover:bg-accent-coral-active focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
              >
                항공편 보러 가기 →
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
