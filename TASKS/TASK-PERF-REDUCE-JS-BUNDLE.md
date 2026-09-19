# PERF-REDUCE-JS-BUNDLE — 미사용 JS·TBT 개선 (기록용, 미착수)

- **Task ID:** `PERF-REDUCE-JS-BUNDLE`
- **Category:** PERF
- **Status:** NOT_STARTED — 착수 금지, 기록만
- **기록일:** 2026-09-19 (`MANUAL-CHECK-PERF-SEO` 측정 중 발견)

## 배경

`MANUAL-CHECK-PERF-SEO`의 공식 AC(LCP/CLS/INP/SEO 메타, REQ-NF-001/002/003/030,
REQ-FUNC-070)는 전부 통과했다. 다만 참고 지표인 REQ-NF-007(Lighthouse Performance
≥85, 이 Task의 공식 Requirement Ref 밖)에서 3개 Route가 미달했고, 원인이 공통적으로
보여 별도 기록한다.

## 측정 결과 (프로덕션 빌드, Moto G Power 에뮬레이션, Slow 4G)

| Route | Lighthouse Performance |
|---|---:|
| `/` | 80 |
| `/about` | 88 |
| `/mates` | 93 |
| `/travel-tools` | **72 (최저)** |
| `/account` | 79 |

### 홈(`/`) 진단 상세

- Total Blocking Time **890ms** (다른 지표는 양호한데 이것만 나쁨)
- Reduce unused JavaScript: **1,422 KiB** 절감 가능
- Minify JavaScript: 113 KiB
- Improve image delivery: 249 KiB
- Minimize main-thread work: 3.1s, 긴 작업(long task) 10건
- Page prevented back/forward cache restoration: **2건**

## 검토 필요

1. 미사용 JS 1.4MB의 출처 확인(번들 분석 — 불필요한 의존성/중복 청크 여부).
2. Total Blocking Time 890ms의 원인이 되는 메인 스레드 작업 10건 식별.
3. `/travel-tools`가 72점으로 가장 낮은 이유를 별도로 확인한다(다른 Route보다
   무거운 Client Component가 많은지 — 항공/숙소/동행 3개 폼이 동시에 마운트됨).
4. Back/forward cache(bfcache) 복원을 막는 원인 2건 조사(Chrome DevTools
   Application 패널의 bfcache 테스트로 원인 특정 가능).
5. 이미지 전달 249 KiB 절감 여지(`next/image` 설정 재검토).

## 참고

- REQ-NF-007은 `MANUAL-CHECK-PERF-SEO`(`TASKS/TASK-MANUAL-CHECK-PERF-SEO.md`)의 공식
  Requirement Ref에 포함되어 있지 않아 이 결함이 그 Task를 차단하지 않는다.
