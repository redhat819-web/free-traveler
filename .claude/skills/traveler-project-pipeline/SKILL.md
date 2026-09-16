---
name: traveler-project-pipeline
description: Traveler PRD/SRS에서 Task를 생성·상세화·감사하고 5개 Screen과 Wave 개발을 지원하는 프로젝트 Skill
---

# Traveler Project Pipeline

이 Skill은 Free Traveler 저장소(`traveler/app`)에서 PRD/SRS를 5개 Screen의 구현 Task로 변환하고, Task를 상세화·감사하고, Wave 단위 개발을 지원하는 공통 규칙을 정의한다. 이 문서는 다른 Agent 규칙 파일을 참조하지 않고 필요한 규칙을 직접 기술한다. 루트 `CLAUDE.md`가 저장소 전역 규칙(Harness Marker, 필수 규칙 1~23, Task 완료 순서)의 정본이며, 이 Skill의 내용은 그 전역 규칙과 충돌하지 않는다 — 충돌처럼 보이는 경우 `CLAUDE.md`를 우선한다.

---

## 1. 입력 문서 목록

Task를 생성·상세화·감사할 때 아래 문서를 정본으로 사용한다. 다른 문서의 서술과 충돌하면 이 목록의 문서를 따른다.

| 영역 | 입력 문서 |
|---|---|
| SRS(요구사항) | `docs/06_SRS_UIUX_REVISED.md` |
| 구현 범위 분류(IMPLEMENT/EXCLUDED) | `docs/PROJECT_SCOPE.md` |
| 디자인 토큰·레이아웃 | `design-reference/D-001/DESIGN.md` |
| Screen/Route/Page Entry 계약 | `design-reference/SCREEN_ROUTE_CONTRACT.json` |
| 화면별 Section 구성 | `design-reference/UI_CONTRACT.md` |
| 아키텍처 경계 | `docs/ARCHITECTURE.md` |
| 결정 기록 | `docs/DECISION_LOG.md` |
| Task 목록(사람이 읽는 원본) | `TASKS/00_TASK_LIST.md` |
| Task 상세 파일 | `TASKS/TASK-<ID>.md` |
| Task 감사 산출물 | `TASKS/TASK_MANIFEST.csv`, `TASKS/TASK_AUDIT_REPORT.md` |
| 실제 파일 트리 | `src/app`, `src/data`, `package.json` (Glob/Read로 직접 확인, 추측 금지) |

`design-reference/vendor/**`(Airbnb 디자인 분석본 등)는 참고 자료일 뿐 정본이 아니다(`DEC-008`). 시각 값은 항상 `design-reference/D-001/DESIGN.md`에서만 인용한다.

---

## 2. 5개 Screen과 Page Entry

`design-reference/SCREEN_ROUTE_CONTRACT.json` 기준으로 Screen은 **정확히 5개**이며, 6번째 Screen/Route를 만들지 않는다.

| Screen | 구분 | Route | Page Entry |
|---|---|---|---|
| SCR-001 메인 | core | `/` | `src/app/page.tsx` |
| SCR-002 대표 소개 | supporting | `/about` | `src/app/about/page.tsx` |
| SCR-003 통합 여행 준비 | core | `/travel-tools` | `src/app/travel-tools/page.tsx` |
| SCR-004 동행 조회 | core | `/mates` | `src/app/mates/page.tsx` |
| SCR-005 계정·관리 | core | `/account` | `src/app/account/page.tsx` |

- 핵심 4개(core) + 보조 1개(supporting) 구성을 유지한다.
- `src/app/auth/callback/route.ts`, `src/app/api/**/route.ts`, `src/app/not-found.tsx`, `src/app/error.tsx`는 `technical_routes`이며 Screen 수에 포함하지 않는다.

---

## 3. IMPLEMENT·EXCLUDED 상태 처리 규칙

- 114개 Requirement(`REQ-FUNC-001~080`, `REQ-NF-001~034`) 전부는 `docs/PROJECT_SCOPE.md`와 `TASKS/00_TASK_LIST.md` §6 Requirement Coverage Index에서 **IMPLEMENT** 또는 **EXCLUDED** 중 하나의 상태를 가진다. 상태가 없는 Requirement를 만들지 않는다.
- **IMPLEMENT** Requirement는 최소 1개의 Task(`TASKS/TASK-<ID>.md`)의 Requirement Ref에 연결되어야 한다.
- **EXCLUDED** Requirement는 Task에 연결하지 않는다(§11 EXCLUDED 보호 참조).
- 두 상태는 서로 배타적이다 — 같은 Requirement가 Task에도 연결되어 있고 EXCLUDED 표에도 있으면 모순이며 감사 실패로 처리한다.
- Requirement 상태를 변경(IMPLEMENT ↔ EXCLUDED)하려면 `docs/PROJECT_SCOPE.md`와 `docs/DECISION_LOG.md`를 먼저 갱신한 뒤에만 Task를 조정한다.

---

## 4. Task List·상세 Task 형식

- **Task List**: `TASKS/00_TASK_LIST.md` 하나의 문서에 Page Owner/Component/Data/DB/Global/CI/Test/Manual/Release Task를 표로 정리한다. 열은 최소 `Seq, Task ID, 제목, Category, Requirement Ref, Screen, Route, Page Entry, Depends On, Expected Files, Priority`를 포함한다.
- **상세 Task**: 구현 대상 Task마다 `TASKS/TASK-<ID>.md` 파일 1개를 만든다(EXCLUDED Requirement는 예외, §11 참조). 각 상세 파일은 아래 13개 절을 이 순서로 포함한다.
  1. Context
  2. Project Scope
  3. Requirement Ref
  4. Screen / Route / Page Entry
  5. Design Ref
  6. Depends On
  7. Expected Files
  8. Functional AC
  9. Visual AC
  10. Security/Privacy AC
  11. Test Cases
  12. Verify
  13. Definition of Done
  14. Forbidden
- `TASKS/00_TASK_LIST.md`의 구현 Task ID 집합과 `TASKS/TASK-<ID>.md` 파일 집합은 **1:1**이어야 한다(중복 파일 생성 금지, 이미 존재하면 재생성하지 않는다).
- Definition of Done 체크박스는 상세 파일 생성 시 전부 미체크 상태로 만든다. 상세 파일은 구현 이전 단계의 명세이며, 임의로 완료 표시를 하지 않는다.
- Expected Files 목록 밖의 파일은 어떤 Task 구현 중에도 수정하지 않는다(`CLAUDE.md` 규칙 8과 동일).

---

## 5. Page Owner·Component 분리 규칙

- **Page Owner Task**: Screen 전체 조립·Section 배치·Route 전체 책임을 진다. Screen당 정확히 1개다. 이미 만들어진 Component를 실제 Page Entry(`page.tsx`)에 조립하는 것만 범위이며, 새 Component를 직접 만들지 않는다(`CLAUDE.md` 규칙 9).
- **Component Task**: 화면 내 개별 UI 조각(카드, 폼, 탭, Drawer, 필터, 버튼 등)을 구현한다. 자신이 속한 Screen 밖의 Route를 조립하지 않는다.
- Page Owner Task의 `Depends On`은 같은 Screen의 Component/Data/DB/Global Task만 포함한다(다른 Screen의 Task를 의존성으로 걸지 않는다).
- SCR-001 Page Owner는 **Next.js 기본 스타터 콘텐츠 제거**를 Functional/Visual AC에 명시한다(`CLAUDE.md` 규칙 10).
- SCR-003 Page Owner는 **항공·숙소·동행 3개 탭을 실제 내부 컴포넌트로 조립**하는 것을 AC로 가지며, 외부 링크 버튼으로 대체하는 구현은 실패로 간주한다(`CLAUDE.md` 규칙 11).
- SCR-005 Page Owner는 **Guest·Member·Admin 3개 역할 상태를 실제로 조립**하는 것을 AC로 가지며, 역할에 없는 관리 영역(Admin 탭 등)은 렌더링하지 않되 코드 구조에는 조건부로 존재한다.

---

## 6. DB 6개 Table과 정적 Data 경계

- Supabase DB Table은 **정확히 6개**로 제한한다: `member_profiles`, `mates`, `mate_applications`, `mate_blocks`, `mate_reports`, `outbound_url_settings`. 7번째 Table을 추가하지 않는다(`CLAUDE.md` 규칙 13, `DEC-006`).
- 여행지·국가 안전정보·대표(`free_traveler`) 소개 콘텐츠는 **DB Table을 만들지 않고** `src/data/**` 정적 TypeScript 데이터로만 관리한다(`destinations.ts`, `safety.ts`, `representative.ts`)(`CLAUDE.md` 규칙 16, `DEC-004`).
- 정적 데이터 콘텐츠에 대한 Admin CRUD 화면·CMS Task를 만들지 않는다. 필수 필드 검증은 `DATA-VALIDATION-SCRIPT`(`scripts/validate_content.py`)로 대체한다.
- DB Task는 역할별로 분리한다: 스키마(`DB-SCHEMA-BASE`), RLS(`DB-RLS-BASE`), 접근 계층(`DB-ACCESS`), 시드 데이터(`DB-SEED-BASE`). 이 4종을 넘어서는 DB Task 유형을 새로 만들 필요가 없다.

---

## 7. 외부 입력 비저장 불변조건

- 항공·숙소 조건 입력값(국가·지역·출발일/체크인·귀국일/체크아웃)은 **Client Component의 React 상태로만** 유지한다(`DEC-007`).
- 아래 대상으로 이 입력값을 전달하는 코드를 작성하지 않는다: 서버 액션, API Route(`src/app/api/**`), Supabase DB, 외부 이동 URL의 query string, 로그/콘솔/분석 이벤트.
- 관련 Component Task(`CMP-SCR003-FLIGHT-FORM`, `CMP-SCR003-HOTEL-FORM`)의 Security/Privacy AC에 이 불변조건을 명시적으로 기록한다.
- 외부 이동 링크는 관리자가 설정한 고정 URL만 사용하며 `target="_blank" rel="noopener noreferrer"`를 적용한다.
- 이 불변조건은 `CLAUDE.md` 규칙 12와 동일하며, 코드 리뷰에서 위반이 발견되면 즉시 반려한다.

---

## 8. 기본 Auth·성인·RLS 규칙

- Supabase Auth로 이메일 가입·인증·로그인·로그아웃·비밀번호 재설정을 구현한다.
- 성인 확인은 `is_adult`, `adult_verified_at` 두 필드만 저장하고, 정확한 생년월일 컬럼은 어떤 테이블에도 만들지 않는다.
- 탈퇴 시 즉시 공개 프로필을 비식별화한다(자동 30일 삭제 배치 등 별도 워크플로는 만들지 않는다).
- RLS는 아래 3단계로 단순화한다: 본인 데이터(`member_profiles`, `mate_applications`, `mate_blocks`), 작성자 우선(`mates`의 수정·마감·삭제, `mate_applications`의 승인/거절), Admin 전용(`mate_reports` 상태 변경, `outbound_url_settings` 수정).
- RLS를 우회하는 Client 코드(Service Role Key를 이용한 우회 조회 등)를 작성하지 않으며, Service Role Key는 Server 전용 코드에서만 사용한다(`CLAUDE.md` 규칙 14·15).
- Supabase에 대한 쓰기는 Auth·동행(Mate)·신고·외부 URL 설정 범위로 제한한다(`CLAUDE.md` 규칙 13).

---

## 9. Playwright Chromium Smoke 범위

- Playwright는 **Chromium 프로젝트만** 사용한다(`PLAYWRIGHT_SCOPE=chromium-smoke`).
- 필수 E2E Task는 정확히 3개다: `E2E-PUBLIC-SMOKE`(SCR-001/002/004 공개 열람), `E2E-TRAVEL-TOOLS`(SCR-003 항공/숙소 탭), `E2E-MATE-AUTH`(SCR-003 동행 탭/SCR-004/SCR-005 인증·동행 전 흐름).
- 크로스 브라우저 매트릭스(Firefox/WebKit), 시각 회귀, 전체 회귀 스위트 Task를 만들지 않는다(`DEC-009`).
- RLS 권한 검증은 Playwright가 아니라 별도 통합 테스트(`TEST-RLS-BASIC`, `tests/rls/basic.test.ts`)로 수행한다.
- 날짜 검증·연락처 패턴 탐지·모집글 상태 전이는 Playwright가 아니라 Vitest 단위 테스트(`UNIT-TRAVEL-DATES`, `UNIT-CONTACT-DETECTION`, `UNIT-MATE-STATE`)로 커버한다.

---

## 10. Wave 내부 순차 실행

- 사용자의 표준 개발 명령은 `/run-wave WXX`이며, 개발은 Task 개별 단위가 아니라 **Wave** 단위로 착수·검토한다(`DEC-010`).
- 하나의 Wave 내부 Task는 **Single Agent**가 `Depends On` 순서(위상 정렬)를 따라 **한 번에 하나만** 순차적으로 구현한다(`DEC-011`, `CLAUDE.md` 규칙 7). Wave 내부에서 여러 Task를 동시에 병렬로 건드리지 않는다.
- 각 Task는 `CLAUDE.md`의 "Task 완료 순서" 7단계(Task 읽기 → 입력 확인 → 구현 → 관련 포맷·Unit Test → 필요 시 Playwright → Diff 확인 → 완료 보고)를 그대로 따른다.
- 화면 단위 Wave가 끝나면 사람이 Preview를 확인할 때까지 다음 Screen Wave로 진행하지 않는다(`CLAUDE.md` 규칙 22).

---

## 11. EXCLUDED 보호

- `docs/PROJECT_SCOPE.md`와 `TASKS/00_TASK_LIST.md` §5 NON_IMPLEMENTATION 표에서 **EXCLUDED**로 분류된 Requirement는 상세 구현 Task 파일(`TASKS/TASK-<ID>.md`)을 만들지 않는다.
- EXCLUDED Requirement 행은 삭제하지 않고, 근거와 후속 방향을 그대로 유지한다(요구사항 자체를 지우지 않는다).
- EXCLUDED로 분류된 기능(전체 콘텐츠 CMS, 범용 감사 로그, 자동 백업/장애 알림, 외부 이메일 사업자 연동, axe 자동 접근성 검사 등)을 임의로 구현하지 않는다. 구현이 필요하다고 판단되면 먼저 `docs/DECISION_LOG.md` 갱신을 통해 사용자 결정을 받은 뒤에만 진행한다(`CLAUDE.md` 규칙 19, `DEC-014`).
- 감사 스크립트(`scripts/audit_tasks.py`)는 EXCLUDED Requirement에 대한 상세 파일이 존재하면 실패로 처리한다.

---

## 12. AWS·EC2·자동 Merge 금지

- `AWS_ENABLED=false`, `AUTO_MERGE=false`를 항상 유지한다. 이 값을 바꾸는 코드·워크플로·설정을 만들지 않는다.
- 인프라는 Vercel(호스팅) + Supabase(DB/Auth) 관리형 서비스만 사용한다. **AWS·EC2 관련 Task·코드·설정을 만들지 않는다**(`DEC-013`).
- Prisma 등 ORM도 도입하지 않는다 — Supabase 클라이언트(쿼리 빌더)를 직접 사용한다(`CLAUDE.md` 규칙 17).
- **자동 PR 생성·자동 Merge(무인 Merge Runner)를 실행하지 않는다.** PR 생성과 Merge는 사람이 수동으로 수행한다(`CLAUDE.md` 규칙 21, `DEC-012`).
- GitHub Actions는 lint/typecheck/unit test 실행까지만 담당하며, 검사 통과가 자동 병합으로 이어지지 않는다.
- Task 제목·설명·상세 파일 어디에도 "auto merge", "merge runner", "EC2", "AWS" 키워드가 구현 대상으로 등장하면 안 되며, `scripts/audit_tasks.py` 검사 16이 이를 자동으로 차단한다.

---

## 감사(Audit)

Task 생성·상세화 후에는 `python scripts/audit_tasks.py`를 실행해 18개 검사(1:1 대조, 중복 ID, Depends On 무결성, Dependency Cycle, Screen당 Page Owner 1개, Route/Page Entry/Expected Files 계약 일치, Component-only Screen, SCR-001/003/005 AC, DB 4역할 Task, DB Table 6개 상한, 외부 입력 비저장 AC, Auth/성인/RLS AC, Playwright Chromium 3종, AWS/EC2/자동 Merge 금지, Requirement 114개 전수 커버리지, EXCLUDED 상세 파일 미생성)를 확인한다. 실패 시 `AUDIT_FAIL`과 원인이 출력되며 exit code 1로 종료한다 — 원인을 수정한 뒤 재실행하기 전까지 작업을 완료로 보고하지 않는다. 통과 시 `AUDIT_PASS (18 checks)`와 함께 `TASKS/TASK_MANIFEST.csv`, `TASKS/TASK_AUDIT_REPORT.md`가 갱신된다.
