# MANUAL-CHECK-PERF-SEO — 성능·SEO 수동 확인

- **Task ID:** `MANUAL-CHECK-PERF-SEO`
- **제목:** 성능·SEO 수동 확인
- **Category:** MANUAL_CHECK
- **Type:** test
- **Priority:** P2
- **Screen / Route / Page Entry:** N/A / N/A / N/A
- **Status:** DONE — 2026-09-19 (사용자 수동 점검, AC 전 항목 통과)

---

## 점검 결과 (2026-09-19)

측정 환경: 프로덕션 빌드(`npm run build && npm start`), Lighthouse 13.4.1, Emulated
Moto G Power, Slow 4G, Mobile 모드.

| AC 항목 | 목표 | 결과 |
|---|---|---|
| LCP (REQ-NF-001) | ≤2.5s | 홈 1.4s — **통과** |
| CLS (REQ-NF-003) | ≤0.1 | 홈 0 — **통과** |
| INP (REQ-NF-002) | ≤200ms | **측정 불가 — 실사용자 필드 데이터 필요, 배포 후 확인** |
| SEO 메타 (REQ-NF-030 / REQ-FUNC-070) | 5개 Route 누락 0건 | 전 Route SEO 100점, 메타 누락 0건 — **통과** |

이 Task의 Requirement Ref(001/002/003/006/030, FUNC-070) 기준 AC는 전 항목 통과로
판정한다(INP는 위 사유로 배포 후 필드 데이터 확인 항목으로 남긴다).

### 참고 지표(이 Task의 공식 Requirement Ref 밖, REQ-NF-007 Lighthouse Performance ≥85)

| Route | Perf | A11y | BP | SEO |
|---|---:|---:|---:|---:|
| `/` | 80 | 97 | 100 | 100 |
| `/about` | 88 | 96 | 100 | 100 |
| `/mates` | 93 | 96 | 100 | 100 |
| `/travel-tools` | 72 | 97 | 100 | 100 |
| `/account` | 79 | 95 | 100 | 100 |

`/`, `/account`, `/travel-tools` 3개가 REQ-NF-007(≥85) 미달. 공식 Requirement Ref에
없어 이 Task의 차단 사유는 아니지만, 원인(미사용 JS·TBT)이 공통적이라
`TASKS/TASK-PERF-REDUCE-JS-BUNDLE.md`(NOT_STARTED)로 별도 기록했다.

Lighthouse Accessibility 자동 검출에서 전 페이지 95~97점, 홈 페이지 Contrast(배경/전경
색 대비 부족) 실패 1건 발견 — 수동 점검으로는 잡히지 않는 항목이라
`TASKS/TASK-A11Y-COLOR-CONTRAST.md`(NOT_STARTED)로 별도 기록했다.

## Context

- 이 Task는 `TASKS/00_TASK_LIST.md`의 Seq 61번 행(`MANUAL-CHECK-PERF-SEO`)을 상세화한 것이다.
- Category: **MANUAL_CHECK** / 우선순위: **P2**
- 선행 Task(GLOBAL-PERF, GLOBAL-SEO-META)가 먼저 완료되어야 이 Task를 시작할 수 있다.

## Project Scope

- `docs/PROJECT_SCOPE.md`에 정의된 Free Traveler 5-Screen 무료 정보 제공 서비스 범위 내에서만 구현한다.
- 예약·결제·실시간 가격 비교 등 상거래 기능은 이 프로젝트 범위 밖이며, 항공/숙소는 외부 사이트로의 안내만 제공한다.

## Requirement Ref

- `REQ-NF-001`
- `REQ-NF-002`
- `REQ-NF-003`
- `REQ-NF-006`
- `REQ-NF-030`
- `REQ-FUNC-070`
- 근거 문서: `docs/06_SRS_UIUX_REVISED.md`, `docs/PROJECT_SCOPE.md`, `docs/UIUX_TRACEABILITY.md`

## Screen / Route / Page Entry

- Screen: N/A
- Route: N/A
- Page Entry: N/A

## Design Ref

- `design-reference/D-001/DESIGN.md` (시각 토큰·레이아웃 규칙)
- `design-reference/UI_CONTRACT.md`
- `design-reference/SCREEN_ROUTE_CONTRACT.json`

## Depends On

- `GLOBAL-PERF`
- `GLOBAL-SEO-META`

## Expected Files

- Expected Files 없음 (MANUAL_CHECK 카테고리, 산출물은 사용자 점검 결과)
  — `TASKS/00_TASK_LIST.md` §3 표(Seq 61)에 Expected Files 열 자체가 없음을 확인함(2026-09-19).

> Expected Files 밖의 파일은 생성·수정하지 않는다.

## Functional AC

- 브라우저 개발자 도구로 LCP/INP/CLS 중급 모바일 4G 조건 확인, 5개 Route의 페이지 소스에서 메타 태그 확인

## Visual AC

- (Task List Visual AC 열이 비어 있음 — §2.1 Page Owner Acceptance Criteria 절 참조)
- Lorem ipsum, '준비 중', '정보 확인 필요' 문구 및 내용 없는 Card를 두지 않는다(D-001/DESIGN.md 공통 규칙).

## Security/Privacy AC

- Airbnb 상표 요소·구매/예약/결제 UI·실시간 항공권/호텔 가격·광고·별점을 포함하지 않는다.

## Test Cases

- 이 Task 단독으로 실행되는 자동화 테스트는 없으며, 의존하는 Page Owner의 E2E Task로 통합 검증된다.

## Verify

- Task List §2.1 공통 Verify(E2E-PUBLIC-SMOKE / MANUAL-CHECK-RESPONSIVE / MANUAL-CHECK-A11Y) 참조

## Definition of Done

- [ ] Expected Files에 명시된 파일만 생성/수정했다.
- [ ] Functional AC 전 항목을 충족했다.
- [ ] Visual AC 전 항목을 충족했다(Lorem ipsum/빈 Card/미완성 문구 없음 포함).
- [ ] Security/Privacy AC 전 항목을 충족했다.
- [ ] Forbidden 목록의 어떤 요소도 포함하지 않았다.
- [ ] Test Cases에 명시된 Verify 대상 테스트가 이 Task 범위를 커버한다.
- [ ] 관련 Requirement의 `docs/UIUX_TRACEABILITY.md` Status 갱신 준비가 되었다(실제 갱신은 별도 절차).

## Forbidden

- Airbnb 상표 요소(로고·브랜드 컬러 시스템·상표 문구) 사용
- 예약·결제·구매 UI 구현
- 라이선스 미확인 상업 폰트 파일 번들링
- D-001 DESIGN.md 디자인 토큰 밖의 임의 색상 값 사용
- Expected Files 목록 밖의 파일 생성·수정을 금지한다.
- 이 Task 단계에서 구현 코드, Git Branch, Commit을 생성하지 않는다(본 문서는 계획 문서다).
