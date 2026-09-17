# PAGE-SCR005 — 계정·관리 화면 조립

- **Task ID:** `PAGE-SCR005`
- **제목:** 계정·관리 화면 조립
- **Category:** PAGE_OWNER
- **Type:** page_owner
- **Priority:** P0
- **Screen / Route / Page Entry:** SCR-005 / `/account` / `src/app/account/page.tsx`

---

## Context

- 이 Task는 `TASKS/00_TASK_LIST.md`의 Seq 5번 행(`PAGE-SCR005`)을 상세화한 것이다.
- Category: **PAGE_OWNER** / 우선순위: **P0**
- 선행 Task(CMP-SCR005-AUTH, CMP-SCR005-PROFILE, CMP-SCR005-MY-ACTIVITY, CMP-SCR005-ADMIN, CMP-SCR005-POLICY-PAGES, DB-ACCESS, GLOBAL-NAV-FOOTER, GLOBAL-TOAST)가 먼저 완료되어야 이 Task를 시작할 수 있다.

## Project Scope

- `docs/PROJECT_SCOPE.md`에 정의된 Free Traveler 5-Screen 무료 정보 제공 서비스 범위 내에서만 구현한다.
- 예약·결제·실시간 가격 비교 등 상거래 기능은 이 프로젝트 범위 밖이며, 항공/숙소는 외부 사이트로의 안내만 제공한다.
- Page Owner Task는 하위 Component를 새로 만들지 않고, 이미 만들어진 Component를 실제 Route Page로 조립하는 것만 범위로 한다.

## Requirement Ref

- (조립)
- 근거 문서: `docs/06_SRS_UIUX_REVISED.md`, `docs/PROJECT_SCOPE.md`, `docs/UIUX_TRACEABILITY.md`

## Screen / Route / Page Entry

- Screen: SCR-005
- Route: `/account`
- Page Entry: `src/app/account/page.tsx`

## Design Ref

- `design-reference/D-001/DESIGN.md` (시각 토큰·레이아웃 규칙)
- `design-reference/UI_CONTRACT.md` — `SCR-005` 절
- `design-reference/SCREEN_ROUTE_CONTRACT.json` — `SCR-005` 항목

## Depends On

- `CMP-SCR005-AUTH`
- `CMP-SCR005-PROFILE`
- `CMP-SCR005-MY-ACTIVITY`
- `CMP-SCR005-ADMIN`
- `CMP-SCR005-POLICY-PAGES`
- `DB-ACCESS`
- `GLOBAL-NAV-FOOTER`
- `GLOBAL-TOAST`

## Expected Files

- `src/app/account/page.tsx` (create)

> Expected Files 밖의 파일은 생성·수정하지 않는다.

## Functional AC

- Admin 신고 처리 결과는 `useToast()`(`src/components/shared/Toast.tsx`, `PAGE-SCR003`이 `layout.tsx`에 연결한 `ToastProvider`를 통해 제공됨)로 안내한다.
- 현재 역할(Guest/Member/Admin)의 Intro(역할별 안내 카피, 데이터 출처: `CMP-SCR005-AUTH` 세션·역할 상태)
- 핵심 작업(Guest: 로그인/가입/재설정 Card 3개 — `CMP-SCR005-AUTH`; Member: 프로필·내 글·참가 요청·차단 — `CMP-SCR005-PROFILE`/`CMP-SCR005-MY-ACTIVITY`; Admin: 신고 처리·외부 URL 설정 — `CMP-SCR005-ADMIN`)
- 도움말 또는 다음 행동(보안 안내, Empty 지점 CTA, 정책 링크 — `CMP-SCR005-POLICY-PAGES`)
- 역할에 없는 관리 영역(Admin 탭 등)은 **렌더링하지 않는다**(구조는 코드에 존재하되 조건부 렌더링으로 숨김).

## Visual AC

- Member 탭 "내 글 없음" 등 데이터 없는 지점은 안내 문장 + 이용 방법 + "동행 글 작성하기" CTA로 구성된 완성형 Empty State를 표시한다.
- Desktop 3-Card 가로 배치, Mobile 세로 스택.
- Lorem ipsum·"준비 중"·"정보 확인 필요"·빈 Card 금지.
- `CMP-SCR005-AUTH` 세션·역할(Guest/Member/Admin) 확인이 끝나기 전에는 Skeleton(역할별 Card와 동일 배치)을 표시하고, Guest UI가 먼저 보였다가 Member/Admin UI로 바뀌는 깜빡임(flash of wrong role)을 만들지 않는다. 세션 확인 실패 시 "계정 상태를 확인하지 못했습니다" 안내 + 다시 시도 버튼을 표시한다.

## Security/Privacy AC

- Airbnb 상표 요소, 구매·예약·결제 UI, 실시간 항공권/호텔 가격, 광고, 별점을 어디에도 포함하지 않는다(`SCREEN_ROUTE_CONTRACT.json` `prohibited_features`/`global_prohibitions`).
- 로그인이 필요한 동작(즐겨찾기 관리, 참가 요청, 신고·차단, 동행 작성)은 비로그인 상태에서 `/account`로 안전하게 안내한다.

## Test Cases

- 이 Task 단독으로 실행되는 자동화 테스트는 없으며, 의존하는 Page Owner의 E2E Task로 통합 검증된다.

## Verify

- `E2E-PUBLIC-SMOKE`(SCR-001/002/004 열람)
- `E2E-TRAVEL-TOOLS`(SCR-003)
- `E2E-MATE-AUTH`(SCR-003 동행 탭/SCR-004 참가·신고·차단/SCR-005)
- `MANUAL-CHECK-RESPONSIVE`
- `MANUAL-CHECK-A11Y`(5개 Page Owner 공통)

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
- Member/Admin 탭 없이 로그인 화면만 존재
- 광고 삽입
- 별점 UI
- 실시간 항공권/호텔 가격 표시
- Expected Files 목록 밖의 파일 생성·수정을 금지한다.
- 이 Task 단계에서 구현 코드, Git Branch, Commit을 생성하지 않는다(본 문서는 계획 문서다).
