"use client";

/**
 * SCR-001 Section 2/3 — 국내/해외 인기 여행지 Card Grid.
 * 국내/해외 탭 전환 + 국가·계절·테마 AND 필터. URL query에는 허용된 키만 반영한다(임의 query 주입 방지).
 * 여행 "기간" 필터는 데이터 모델의 season(계절) 값으로 대신한다 — src/data/destinations.ts에 별도 기간 필드가 없다.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { destinations, type Destination, type DestinationScope } from "@/data/destinations";
import { FavoriteButton } from "./FavoriteButton";
import { handleTabListKeyDown } from "@/hooks/useTabListKeyboard";

const ALLOWED_QUERY_KEYS = ["scope", "country", "season", "theme", "q"] as const;
const SCOPE_TABS: DestinationScope[] = ["domestic", "overseas"];

function readQueryFromUrl(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const result: Record<string, string> = {};
  for (const key of ALLOWED_QUERY_KEYS) {
    const value = params.get(key);
    if (value) result[key] = value;
  }
  return result;
}

function writeQueryToUrl(state: Record<string, string>) {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  for (const key of ALLOWED_QUERY_KEYS) {
    params.delete(key);
  }
  for (const key of ALLOWED_QUERY_KEYS) {
    const value = state[key];
    if (value) params.set(key, value);
  }
  const query = params.toString();
  const next = query ? `${window.location.pathname}?${query}` : window.location.pathname;
  window.history.replaceState(null, "", next);
}

/**
 * Server Component인 page.tsx는 Client Component에 함수 prop을 전달할 수 없으므로,
 * DestinationGrid ↔ DestinationDrawer는 URL(`?destination=id`)과 CustomEvent로만 통신한다.
 */
export function openDestinationDrawer(destinationId: string) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  url.searchParams.set("destination", destinationId);
  window.history.pushState(null, "", `${url.pathname}?${url.searchParams.toString()}`);
  window.dispatchEvent(new CustomEvent<string>("destination-drawer:select", { detail: destinationId }));
}

export function DestinationGrid({
  externalKeyword,
  onSelect,
}: {
  externalKeyword?: string;
  onSelect?: (destination: Destination) => void;
}) {
  const [scope, setScope] = useState<DestinationScope>(() => {
    const initial = readQueryFromUrl().scope;
    return initial === "overseas" ? "overseas" : "domestic";
  });
  const [country, setCountry] = useState(() => readQueryFromUrl().country ?? "");
  const [season, setSeason] = useState(() => readQueryFromUrl().season ?? "");
  const [theme, setTheme] = useState(() => readQueryFromUrl().theme ?? "");
  const [localKeyword, setLocalKeyword] = useState(() => readQueryFromUrl().q ?? "");

  const keyword = externalKeyword !== undefined ? externalKeyword : localKeyword;

  useEffect(() => {
    writeQueryToUrl({ scope, country, season, theme, q: keyword });
  }, [scope, country, season, theme, keyword]);

  const scoped = useMemo(
    () => destinations.filter((item) => item.scope === scope),
    [scope],
  );

  const countryOptions = useMemo(
    () => Array.from(new Set(scoped.map((item) => item.country))).sort(),
    [scoped],
  );
  const seasonOptions = useMemo(
    () => Array.from(new Set(scoped.flatMap((item) => item.season))).sort(),
    [scoped],
  );
  const themeOptions = useMemo(
    () => Array.from(new Set(scoped.flatMap((item) => item.theme))).sort(),
    [scoped],
  );

  const filtered = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    return scoped.filter((item) => {
      if (country && item.country !== country) return false;
      if (season && !item.season.includes(season)) return false;
      if (theme && !item.theme.includes(theme)) return false;
      if (normalizedKeyword) {
        const haystack = [item.country, item.city, ...item.theme, item.summary]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(normalizedKeyword)) return false;
      }
      return true;
    });
  }, [scoped, country, season, theme, keyword]);

  const resetFilters = () => {
    setCountry("");
    setSeason("");
    setTheme("");
    setLocalKeyword("");
  };

  const scopeTabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  return (
    <section className="bg-bg-canvas px-gutter py-xl">
      <div className="mx-auto max-w-container-max">
        <div className="flex flex-wrap items-center justify-between gap-md">
          <div>
            <h2 className="text-2xl font-semibold text-text-primary">
              {scope === "domestic" ? "국내 인기 여행지" : "해외 인기 여행지"}
            </h2>
            <p className="mt-xs text-sm text-text-secondary">
              실제로 다녀온 여행지의 동선과 예산을 국가·계절·테마로 골라볼 수 있습니다.
            </p>
          </div>

          <div
            className="flex gap-sm"
            role="tablist"
            aria-label="국내/해외 전환"
            onKeyDown={(event) =>
              handleTabListKeyDown(
                event,
                scopeTabRefs.current,
                SCOPE_TABS.indexOf(scope),
                (index) => setScope(SCOPE_TABS[index]),
              )
            }
          >
            <button
              ref={(el) => {
                scopeTabRefs.current[0] = el;
              }}
              type="button"
              role="tab"
              aria-selected={scope === "domestic"}
              tabIndex={scope === "domestic" ? 0 : -1}
              onClick={() => setScope("domestic")}
              className={`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring rounded-pill px-md py-xs text-sm ${
                scope === "domestic"
                  ? "bg-accent-coral-soft text-text-primary"
                  : "bg-bg-strong text-text-secondary"
              }`}
            >
              국내
            </button>
            <button
              ref={(el) => {
                scopeTabRefs.current[1] = el;
              }}
              type="button"
              role="tab"
              aria-selected={scope === "overseas"}
              tabIndex={scope === "overseas" ? 0 : -1}
              onClick={() => setScope("overseas")}
              className={`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring rounded-pill px-md py-xs text-sm ${
                scope === "overseas"
                  ? "bg-accent-coral-soft text-text-primary"
                  : "bg-bg-strong text-text-secondary"
              }`}
            >
              해외
            </button>
          </div>
        </div>

        <div className="mt-md flex flex-wrap gap-sm">
          <FilterSelect label="국가" value={country} onChange={setCountry} options={countryOptions} />
          <FilterSelect label="계절" value={season} onChange={setSeason} options={seasonOptions} />
          <FilterSelect label="테마" value={theme} onChange={setTheme} options={themeOptions} />
        </div>

        {filtered.length === 0 ? (
          <div className="mt-lg rounded-md border border-border-hairline bg-bg-soft p-lg text-center">
            <p className="text-sm text-text-secondary">
              조건에 맞는 여행지가 없습니다. 필터를 완화해보세요.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-sm rounded-pill bg-accent-coral px-md py-xs text-sm font-semibold text-bg-canvas hover:bg-accent-coral-active focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            >
              필터 초기화
            </button>
          </div>
        ) : (
          <div className="mt-lg grid grid-cols-1 gap-md sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((destination) => (
              <div
                key={destination.id}
                role="button"
                tabIndex={0}
                onClick={() => {
                  onSelect?.(destination);
                  openDestinationDrawer(destination.id);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelect?.(destination);
                    openDestinationDrawer(destination.id);
                  }
                }}
                className="group flex cursor-pointer flex-col overflow-hidden rounded-md border border-border-hairline bg-bg-canvas text-left transition-shadow hover:shadow-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-bg-strong">
                  <Image
                    src={destination.image.url}
                    alt={destination.image.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                  <div className="absolute right-sm top-sm">
                    <FavoriteButton destinationId={destination.id} />
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-xs p-md">
                  <span className="text-xs text-text-muted">
                    {destination.country} · {destination.region}
                  </span>
                  <h3 className="text-base font-semibold text-text-primary">
                    {destination.city}
                  </h3>
                  <p className="line-clamp-2 text-sm text-text-secondary">
                    {destination.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="flex items-center gap-xs text-sm text-text-secondary">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-sm border border-border-hairline bg-bg-soft px-sm py-xs text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
      >
        <option value="">전체</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
