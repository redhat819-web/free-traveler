# Free Traveler — UI/UX Approved Baseline (05)

- **Document ID:** UIUX-APPROVED-TRAVEL-001
- **기반 문서:** `02_SRS_BASELINE.md`, `PROJECT_SCOPE.md`, `03_UI_COVERAGE_ANALYSIS.md`, `design-reference/D-001/DESIGN.md`, `design-reference/UI_CONTRACT.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`, `docs/STITCH_VALIDATION_REPORT.md`
- **작성 기준일:** 2026-09-15
- **범위:** REQ-FUNC-001~080, REQ-NF-001~034 총 114건 요구사항을 5개 승인 Screen(SCR-001~005)과 Next.js App Router 라우트에 연결한다. 요구사항은 한 건도 삭제하지 않는다.

---

## 1. 승인 상태 요약

| 구성 요소 | 상태 | 근거 |
|---|---|---|
| 디자인 토큰·정본 | **LOCKED (D-001)** | `design-reference/DESIGN_MANIFEST.md` |
| Screen 구조·라우트 계약 | **CONFIRMED (5 Screen)** | `design-reference/SCREEN_ROUTE_CONTRACT.json` |
| Stitch 시각 검증 | **STITCH_VALIDATION_NEEDS_HUMAN** (부분 보류) | `docs/STITCH_VALIDATION_REPORT.md` |

Stitch 시각 검증 결과 SCR-001·SCR-002·SCR-004는 PASS, SCR-003(탭이 외부 링크로만 구현됨, Mobile 변형이 실제 반응형이 아님)과 SCR-005(Member/Admin 영역 없이 로그인 화면만 존재)는 NEEDS_REVISION으로 남아 있으며, Stitch 프로젝트 내 중복 화면(SCR-002 ×2, SCR-003 ×3+1, SCR-004 ×10)도 아직 정리되지 않았다. 이 문서는 **Route·Requirement 매핑을 확정**하는 문서이며, SCR-003·SCR-005의 시각적 완성도는 `design-reference/D-001/DESIGN.md` §10·§19 규칙에 따라 구현 단계에서 반드시 보완해야 한다. 이 미해결 사항을 완료된 것으로 기록하지 않는다.

---

## 2. 기존 다중 Route → 5개 Screen 통합

`02_SRS_BASELINE.md` §3.5의 기존 Route 목록은 5개 디자인 Screen의 탭·패널·모달로 통합된다. 아래 표는 기존 Route가 어느 Screen의 어떤 내부 구성요소로 흡수되는지 기록한다(라우트 자체를 삭제하는 것이 아니라, 별도 페이지로 만들지 않고 Screen 내부 컴포넌트로 구현한다는 의미).

| 기존 Route(SRS §3.5) | 통합 대상 Screen | 통합 형태 |
|---|---|---|
| `/destinations` | SCR-001 | Section 2·3 Card Grid(국내/해외 탭) |
| `/destinations/domestic` | SCR-001 | Section 2 Card Grid |
| `/destinations/overseas` | SCR-001 | Section 3 Card Grid |
| `/destinations/[slug]` | SCR-001 | 여행지 상세 Drawer(Card 클릭 시 오픈) |
| `/flights` | SCR-003 | 탭 전환 내 "항공편" 탭 |
| `/hotels` | SCR-003 | 탭 전환 내 "숙소" 탭 |
| `/mates` | SCR-004 | 그대로 유지(승인 Screen) |
| `/mates/[id]` | SCR-004 | 목록+상세 좌우 분할(Desktop) / Drawer(Mobile) |
| `/mates/new` | SCR-003 | 탭 전환 내 "동행 구하기" 탭의 작성 Form |
| `/safety` | SCR-001 | Section 5 국가별 주의사항 Card |
| `/safety/[countryCode]` | SCR-001 | 여행지 상세 Drawer 내부 "국가 안전정보 보기" 전환 뷰 |
| `/about` | SCR-002 | 그대로 유지(승인 Screen) |
| `/auth/*` | SCR-005 | Guest 탭(로그인/가입/재설정) |
| `/my/*` | SCR-005 | Member 탭(프로필·내 글·참가 요청·차단) |
| `/admin/*` | SCR-005 | Admin 탭(신고 처리·외부 URL 설정) |

- `/travel-tools`는 항공·숙소·동행 작성 3개 탭을 모두 포함한다(`design-reference/UI_CONTRACT.md` SCR-003).
- `/account`는 인증(Guest)·프로필(Member)·내 활동(Member)·간단 관리자(Admin) 4개 영역을 탭으로 포함한다(`design-reference/UI_CONTRACT.md` SCR-005).

---

## 3. UI Route Contract

| Screen ID | Route | Page Entry | 우선순위 |
|---|---|---|---|
| SCR-001 | `/` | `src/app/page.tsx` | 핵심 |
| SCR-002 | `/about` | `src/app/about/page.tsx` | 보조 |
| SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | 핵심 |
| SCR-004 | `/mates` | `src/app/mates/page.tsx` | 핵심 |
| SCR-005 | `/account` | `src/app/account/page.tsx` | 핵심 |

- 전역 레이아웃(Header/Footer, 내비게이션): `src/app/layout.tsx` (REQ-FUNC-064·065·070·078·079, REQ-NF-001~003·006·023·030 적용 지점)
- 기술 Route(5 Screen 수에 미포함): `src/app/auth/callback/route.ts`, `src/app/api/**/route.ts`, `src/app/not-found.tsx`, `src/app/error.tsx`
- 상세 계약: `design-reference/SCREEN_ROUTE_CONTRACT.json`(schema_version `traveler-screen-route-v1`)

---

## 4. Release Acceptance Criteria

배포 승인을 위해 아래 조건을 모두 충족해야 하며, 하나라도 미충족 시 릴리스를 보류한다.

1. **Requirement 완전성**: `docs/UIUX_TRACEABILITY.md`에 REQ-FUNC-001~080, REQ-NF-001~034 총 114건이 삭제 없이 모두 존재한다.
2. **Screen·Route 무결성**: `design-reference/SCREEN_ROUTE_CONTRACT.json`의 `screens` 배열이 정확히 5개이며 Route·Page Entry 중복이 없다(`completion_criteria` 전체 `true`).
3. **EXCLUDED 정합성**: `PROJECT_SCOPE.md`에서 EXCLUDED로 확정된 20건(REQ-FUNC 13건 + REQ-NF 7건)은 `docs/UIUX_TRACEABILITY.md`에서도 동일하게 EXCLUDED로 표시되고 Screen에 배치되지 않는다.
4. **SCR-003 탭 통합**: 항공편/숙소/동행 구하기가 외부 링크 버튼이 아닌 실제 내부 탭 컴포넌트로 구현되어 있다(`design-reference/D-001/DESIGN.md` §10).
5. **SCR-005 3탭 구조**: Guest/Member/Admin 3개 탭 구조가 모두 코드에 존재한다(역할에 없는 탭은 렌더링만 생략, 구조 자체는 존재)(§19).
6. **Mobile 변형 유효성**: SCR-001·SCR-003의 Mobile 변형이 실제 390px 반응형 레이아웃으로 구현되어 있다(데스크톱 폭을 그대로 둔 화면은 불인정).
7. **금지 요소 미포함**: Airbnb 상표 요소, 구매·예약·결제 UI, Proprietary Font 파일, 디자인 토큰 외 임의 색상이 어떤 화면에도 없다.
8. **Empty/Placeholder 규칙 준수**: Lorem ipsum·"준비 중"·"정보 확인 필요"·빈 Card가 없고, 모든 Empty 지점에 안내+이용 방법+CTA 3요소가 있다.
9. **Task/Test 커버리지**: `docs/UIUX_TRACEABILITY.md`의 모든 IMPLEMENT 행에 Task ID(더는 `PENDING_TASK_GENERATION`이 아닌 실제 ID)와 Test 실행 결과가 채워져 있다.
10. **핵심/보조 구분 유지**: 핵심 4개(SCR-001, SCR-003, SCR-004, SCR-005) + 보조 1개(SCR-002) 구분이 문서 전반에서 일관되게 유지된다.

현재 시점 기준 1~3, 7(구조적 금지 항목), 10은 충족되어 있고, 4·5·6·8·9는 STITCH_VALIDATION_REPORT.md에 기록된 미해결 항목 및 이후 Task 생성·구현 단계에서 충족되어야 하는 **미완료** 조건이다.
