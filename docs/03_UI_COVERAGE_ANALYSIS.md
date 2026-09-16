# Free Traveler — UI Coverage Analysis (5-Screen 배치)

- **Document ID:** UI-COV-TRAVEL-001
- **기반 문서:** `02_SRS_BASELINE.md`, `PROJECT_SCOPE.md`
- **작성 기준일:** 2026-09-10
- **Requirement 총수:** 114 (REQ-FUNC-001~080 = 80건, REQ-NF-001~034 = 34건)

---

## 1. 목적과 분류 기준

`02_SRS_BASELINE.md`의 요구사항 114건 전체를 유지한 상태로, 5개 디자인 Screen에 배치한다. 요구사항은 삭제하지 않으며, `PROJECT_SCOPE.md`에서 EXCLUDED로 확정된 항목도 행을 유지하되 Screen에는 배치하지 않는다(추적성 유지, 구현 범위 임의 복원 아님).

### 1.1 UI 분류 기준

| 분류 | 정의 |
|---|---|
| **UI_DIRECT** | 화면에 직접 보이는 요소(버튼, 폼, 패널, 배지, 링크 등)로 요구사항이 구현되는 경우 |
| **UI_STATE** | 화면 동작·검증·계산 로직으로 구현되며, 화면에는 상태 변화(활성/비활성, 경고, 필터 결과)로만 드러나는 경우 |
| **NON_UI** | 데이터 구조, 보안, 성능, 저장 정책 등 화면 요소로 직접 드러나지 않는 경우 |
| **OPERATIONS** | 관리자·운영 절차, SLA, 모니터링 등 운영 성격의 요구사항(일부는 SCR-005 관리자 탭에 최소 형태로 노출) |

### 1.2 Screen 고정 목록

| Screen ID | 경로 | 이름 |
|---|---|---|
| **SCR-001** | `/` | 메인 |
| **SCR-002** | `/about` | 대표 소개 |
| **SCR-003** | `/travel-tools` | 통합 여행 준비 |
| **SCR-004** | `/mates` | 동행 조회 |
| **SCR-005** | `/account` | 계정·관리 |

API Route, 인증 콜백(`/auth/callback` 등), 오류 처리 라우트는 기술 Route로 취급하며 위 5개 Screen에 포함하지 않는다. 배치 표에서는 Screen 값을 `N/A(기술 Route)` 또는 `전역(공통 레이아웃)`으로 표기한다.

---

## 2. Screen 정의

### SCR-001 `/` 메인

| 항목 | 내용 |
|---|---|
| 사용자 목표 | 국내·해외 여행지를 탐색하고, 상세 정보와 국가 안전정보를 확인한다 |
| 주요 영역 | 검색·필터 바, 국내/해외 탭, 여행지 카드 목록, 여행지 상세 Drawer/Modal, 안전정보 패널(Drawer 내부), 즐겨찾기 토글, 대표 소개 요약 카드, 전역 내비게이션 |
| 상태 | 목록 로딩/결과 있음/결과 없음(필터 완화 안내), Drawer 열림/닫힘, 안전정보 stale/최신, 즐겨찾기 on/off |
| 이동 목적지 | 여행지 상세 Drawer 내 "국가 안전정보" 링크(Drawer 내부 전환), `SCR-002`(대표 소개), `SCR-003`(항공/숙소 탭), `SCR-004`(동행 조회), `SCR-005`(로그인 필요 시) |

### SCR-002 `/about` 대표 소개

| 항목 | 내용 |
|---|---|
| 사용자 목표 | `free_traveler`의 여행 경험과 철학을 확인하고 추천 여행지로 이동한다 |
| 주요 영역 | 대표 이미지·소개문, `50+ Trips`/`30+ Countries` 수치 카드, 여행 철학·편집 원칙, 방문 권역/국가 목록, 여행 타임라인, 추천 여행지 6곳, 문의·SNS 링크 |
| 상태 | 콘텐츠 정적 로딩(단일 상태), 빈 링크 미노출 |
| 이동 목적지 | `SCR-001`(추천 여행지 상세 Drawer 오픈) |

### SCR-003 `/travel-tools` 통합 여행 준비

| 항목 | 내용 |
|---|---|
| 사용자 목표 | 항공·숙소 조건을 정리해 외부 사이트로 이동하거나, 동행 모집글을 작성한다 |
| 주요 영역 | 탭 전환(항공 / 숙소 / 동행 작성), 항공·숙소 입력 폼과 검증 오류, 입력 요약과 비전달 고지, 외부 이동 버튼, 동행 작성 폼(공개 연락처 탐지 포함), 안전수칙 동의 체크박스 |
| 상태 | 탭별 폼 미입력/검증 오류/요약 확인, 외부 URL 오류(재시도), 동행 작성 시 로그인·성인 확인 필요 안내 |
| 이동 목적지 | 외부 항공/호텔 사이트(새 탭), `SCR-005`(비로그인·성인 미확인 시), 작성 완료 후 `SCR-004`(작성한 모집글 상세) |

### SCR-004 `/mates` 동행 조회

| 항목 | 내용 |
|---|---|
| 사용자 목표 | 조건에 맞는 동행 모집글을 찾아 참가를 요청하거나 신고·차단한다 |
| 주요 영역 | 조건 필터(국가·지역·기간·연령대·성별·스타일), 모집글 목록, 모집글 상세 패널(참가 요청 폼, 모집 상태 배지, 신고/차단 버튼) |
| 상태 | 목록 결과 있음/없음, 모집중/마감(자동·수동), 참가 요청 PENDING/ACCEPTED/REJECTED, 신고 접수 완료 |
| 이동 목적지 | `SCR-003`(새 모집글 작성), `SCR-005`(비로그인 시 로그인, 요청 관리·차단 관리) |

### SCR-005 `/account` 계정·관리

| 항목 | 내용 |
|---|---|
| 사용자 목표 | 로그인·회원가입·성인 확인을 완료하고, 프로필·즐겨찾기·참가 요청·차단을 관리하며, 관리자는 신고와 외부 URL을 처리한다 |
| 주요 영역 | 탭 전환(로그인/가입, 프로필, 내 활동, 관리자) — 로그인·가입·성인 확인·비밀번호 재설정, 프로필 편집, 즐겨찾기·내 모집글·참가 요청 관리·차단 목록, 관리자 전용 탭(신고 큐·상태 처리, 외부 URL 설정) |
| 상태 | 미로그인/로그인, 성인 확인 여부, 탈퇴 진행, 관리자 권한 유무(비관리자에게 관리자 탭 미노출) |
| 이동 목적지 | `SCR-004`(내 모집글/요청에서 해당 상세로), `SCR-001`(즐겨찾기 항목에서 상세 Drawer로) |

---

## 3. 기능 요구사항 배치 (REQ-FUNC-001~080)

| ID | PROJECT_SCOPE | UI 분류 | 배치 Screen | 비고 |
|---|---|---|---|---|
| REQ-FUNC-001 | IMPLEMENT | UI_DIRECT | SCR-001 | 국내/해외 탭 |
| REQ-FUNC-002 | IMPLEMENT | UI_DIRECT | SCR-001 | 필터 바 |
| REQ-FUNC-003 | IMPLEMENT | UI_DIRECT | SCR-001 | 검색 입력 |
| REQ-FUNC-004 | IMPLEMENT | UI_DIRECT | SCR-001 | 여행지 상세 Drawer |
| REQ-FUNC-005 | IMPLEMENT | UI_STATE | SCR-001 | 결과 없음 상태 |
| REQ-FUNC-006 | IMPLEMENT | UI_DIRECT | SCR-001 | Drawer 내 안전정보 패널 연결 |
| REQ-FUNC-007 | IMPLEMENT | UI_STATE | SCR-001 | 이미지 alt/출처 메타데이터 |
| REQ-FUNC-008 | IMPLEMENT | NON_UI | SCR-001 | 콘텐츠 수량 기준(데이터) |
| REQ-FUNC-009 | IMPLEMENT | UI_DIRECT | SCR-001 | 관련 여행지 추천 영역 |
| REQ-FUNC-010 | IMPLEMENT | UI_STATE | SCR-001 | 필터 상태 URL 반영 |
| REQ-FUNC-011 | IMPLEMENT | UI_DIRECT | SCR-003 | 항공 탭 입력 필드 |
| REQ-FUNC-012 | IMPLEMENT | UI_STATE | SCR-003 | 국가→지역 종속 필터 |
| REQ-FUNC-013 | IMPLEMENT | UI_STATE | SCR-003 | 날짜 검증 오류 |
| REQ-FUNC-014 | IMPLEMENT | UI_DIRECT | SCR-003 | 항공 요약 화면 |
| REQ-FUNC-015 | IMPLEMENT | UI_DIRECT | SCR-003 | 비전달 고지 문구 |
| REQ-FUNC-016 | IMPLEMENT | UI_DIRECT | SCR-003 | 외부 이동 버튼 |
| REQ-FUNC-017 | IMPLEMENT | NON_UI | SCR-003 | 서버 미저장 원칙 |
| REQ-FUNC-018 | IMPLEMENT | UI_STATE | SCR-003 | 외부 URL 오류/재시도 |
| REQ-FUNC-019 | IMPLEMENT | UI_DIRECT | SCR-003 | 숙소 탭 입력 필드 |
| REQ-FUNC-020 | IMPLEMENT | UI_STATE | SCR-003 | 국가→지역 종속 필터 |
| REQ-FUNC-021 | IMPLEMENT | UI_STATE | SCR-003 | 날짜 검증 오류 |
| REQ-FUNC-022 | IMPLEMENT | UI_DIRECT | SCR-003 | 숙소 요약 화면 |
| REQ-FUNC-023 | IMPLEMENT | UI_DIRECT | SCR-003 | 비전달 고지 문구 |
| REQ-FUNC-024 | IMPLEMENT | UI_DIRECT | SCR-003 | 외부 이동 버튼 |
| REQ-FUNC-025 | IMPLEMENT | NON_UI | SCR-003 | 서버 미저장 원칙 |
| REQ-FUNC-026 | IMPLEMENT | UI_STATE | SCR-003 | 외부 URL 오류/재시도 |
| REQ-FUNC-027 | IMPLEMENT | UI_STATE | SCR-005 | 로그인 세션 게이트(로그인 탭) |
| REQ-FUNC-028 | IMPLEMENT | UI_DIRECT | SCR-005 | 성인 확인 단계 |
| REQ-FUNC-029 | IMPLEMENT | UI_DIRECT | SCR-005 | 프로필 탭 입력 |
| REQ-FUNC-030 | IMPLEMENT | UI_DIRECT | SCR-004 | 동행 필터 바 |
| REQ-FUNC-031 | IMPLEMENT | UI_DIRECT | SCR-003 | 동행 작성 탭 폼 |
| REQ-FUNC-032 | IMPLEMENT | UI_STATE | SCR-003 | 연락처 패턴 탐지·차단 |
| REQ-FUNC-033 | IMPLEMENT | UI_STATE | SCR-004 | 상세 패널 연락처 비노출 |
| REQ-FUNC-034 | IMPLEMENT | UI_DIRECT | SCR-004 | 참가 요청 폼(상세 패널) |
| REQ-FUNC-035 | IMPLEMENT | UI_STATE | SCR-004 | 중복 요청 방지 오류 |
| REQ-FUNC-036 | IMPLEMENT | UI_DIRECT | SCR-005 | 내 활동 탭(요청 승인/거절) |
| REQ-FUNC-037 | IMPLEMENT | UI_STATE | SCR-004 | 자동 마감 상태 표시 |
| REQ-FUNC-038 | IMPLEMENT | UI_DIRECT | SCR-005 | 내 활동 탭(수동 마감/수정/삭제) |
| REQ-FUNC-039 | IMPLEMENT | UI_DIRECT | SCR-004 | 신고 버튼(상세 패널) |
| REQ-FUNC-040 | IMPLEMENT | UI_DIRECT | SCR-005 | 내 활동 탭(차단 관리) |
| REQ-FUNC-041 | IMPLEMENT | OPERATIONS | SCR-005 | 관리자 탭 신고 큐 |
| REQ-FUNC-042 | IMPLEMENT | OPERATIONS | SCR-005 | 관리자 탭 신고 상태 처리 |
| REQ-FUNC-043 | IMPLEMENT | UI_DIRECT | 전역(공통 레이아웃) | Toast/상태 배지 알림 |
| REQ-FUNC-044 | IMPLEMENT | NON_UI | N/A(기술 Route) | Supabase RLS |
| REQ-FUNC-045 | IMPLEMENT | OPERATIONS | SCR-005 | 계정 탭 탈퇴 처리 |
| REQ-FUNC-046 | IMPLEMENT | NON_UI | SCR-001 | 안전정보 커버리지(데이터) |
| REQ-FUNC-047 | IMPLEMENT | UI_DIRECT | SCR-001 | 안전정보 패널 카테고리 |
| REQ-FUNC-048 | IMPLEMENT | UI_DIRECT | SCR-001 | 출처·확인일 표시 |
| REQ-FUNC-049 | IMPLEMENT | UI_DIRECT | SCR-001 | 외교부 원문 링크 |
| REQ-FUNC-050 | IMPLEMENT | UI_STATE | SCR-001 | stale 경고 배지 |
| REQ-FUNC-051 | IMPLEMENT | UI_DIRECT | SCR-001 | 중대 경보 상단 표시 |
| REQ-FUNC-052 | IMPLEMENT | UI_DIRECT | SCR-001 | 국가/지역 범위 구분 표시 |
| REQ-FUNC-053 | IMPLEMENT | UI_DIRECT | SCR-001 | 긴급연락처 표시 |
| REQ-FUNC-054 | IMPLEMENT | UI_DIRECT | SCR-001 | 안전정보 면책 고지 |
| REQ-FUNC-055 | EXCLUDED | OPERATIONS | N/A(제외) | 안전 콘텐츠 CMS 워크플로 |
| REQ-FUNC-056 | EXCLUDED | OPERATIONS | N/A(제외) | 변경 이력 DB 보존 |
| REQ-FUNC-057 | IMPLEMENT | UI_DIRECT | SCR-002 | 대표명·수치 카드 |
| REQ-FUNC-058 | IMPLEMENT | UI_DIRECT | SCR-002 | 소개문·철학·원칙 |
| REQ-FUNC-059 | IMPLEMENT | UI_DIRECT | SCR-002 | 방문 권역/국가 목록 |
| REQ-FUNC-060 | IMPLEMENT | UI_DIRECT | SCR-002 | 여행 타임라인 |
| REQ-FUNC-061 | IMPLEMENT | UI_STATE | SCR-002 | 이미지 메타데이터 |
| REQ-FUNC-062 | IMPLEMENT | UI_DIRECT | SCR-002 | 문의·SNS 링크 |
| REQ-FUNC-063 | IMPLEMENT | UI_DIRECT | SCR-002 | 추천 여행지 6곳(SCR-001 연결) |
| REQ-FUNC-064 | IMPLEMENT | UI_DIRECT | 전역(공통 레이아웃) | 내비게이션·푸터 |
| REQ-FUNC-065 | IMPLEMENT | UI_STATE | 전역(공통 레이아웃) | 반응형 레이아웃 |
| REQ-FUNC-066 | IMPLEMENT | UI_DIRECT | SCR-005 | 로그인 탭(가입/인증/재설정) |
| REQ-FUNC-067 | IMPLEMENT | UI_DIRECT | SCR-001 | 통합 검색 바 |
| REQ-FUNC-068 | IMPLEMENT | UI_DIRECT | SCR-001 | 즐겨찾기 토글(목록 표시는 SCR-005 내 활동 탭) |
| REQ-FUNC-069 | IMPLEMENT | UI_DIRECT | SCR-001 | 공유 버튼 |
| REQ-FUNC-070 | IMPLEMENT | NON_UI | 전역(공통 레이아웃) | SEO 메타 태그 |
| REQ-FUNC-071 | EXCLUDED | OPERATIONS | N/A(제외) | 행동 분석 이벤트 수집 |
| REQ-FUNC-072 | EXCLUDED | OPERATIONS | N/A(제외) | 여행지 콘텐츠 CRUD 관리자 화면 |
| REQ-FUNC-073 | EXCLUDED | OPERATIONS | N/A(제외) | 미디어 업로드 워크플로 |
| REQ-FUNC-074 | IMPLEMENT | OPERATIONS | N/A(기술 Route) | 데이터 검증 스크립트(빌드 단계) |
| REQ-FUNC-075 | EXCLUDED | OPERATIONS | N/A(제외) | stale 현황 대시보드 |
| REQ-FUNC-076 | EXCLUDED | OPERATIONS | N/A(제외) | 범용 감사 로그 |
| REQ-FUNC-077 | IMPLEMENT | OPERATIONS | SCR-005 | 관리자 탭 외부 URL 설정 |
| REQ-FUNC-078 | IMPLEMENT | UI_DIRECT | 전역(공통 레이아웃) | 오류 화면(404/500/권한없음) |
| REQ-FUNC-079 | IMPLEMENT | UI_STATE | 전역(공통 레이아웃) | ARIA·시맨틱 마크업 |
| REQ-FUNC-080 | IMPLEMENT | UI_DIRECT | SCR-005 | 정책 페이지·동의(동의 체크박스는 SCR-003 동행 작성 탭에도 노출) |

---

## 4. 비기능 요구사항 배치 (REQ-NF-001~034)

| ID | PROJECT_SCOPE | UI 분류 | 배치 Screen | 비고 |
|---|---|---|---|---|
| REQ-NF-001 | IMPLEMENT | NON_UI | 전역(공통 레이아웃) | LCP 최적화 |
| REQ-NF-002 | IMPLEMENT | NON_UI | 전역(공통 레이아웃) | 상호작용 지연 |
| REQ-NF-003 | IMPLEMENT | UI_STATE | 전역(공통 레이아웃) | 레이아웃 이동 최소화 |
| REQ-NF-004 | IMPLEMENT | NON_UI | SCR-001 | 필터 응답 속도(SCR-004 동행 필터에도 동일 적용) |
| REQ-NF-005 | IMPLEMENT | NON_UI | SCR-003 | 쓰기 API 응답 속도(SCR-004 참가 요청·신고에도 동일 적용) |
| REQ-NF-006 | IMPLEMENT | UI_STATE | 전역(공통 레이아웃) | 이미지 lazy load |
| REQ-NF-007 | EXCLUDED | OPERATIONS | N/A(제외) | Lighthouse CI 게이트 |
| REQ-NF-008 | EXCLUDED | OPERATIONS | N/A(제외) | 가용성 모니터링 |
| REQ-NF-009 | EXCLUDED | OPERATIONS | N/A(제외) | 5xx 비율 모니터링 |
| REQ-NF-010 | EXCLUDED | OPERATIONS | N/A(제외) | 자동 백업 RPO/RTO |
| REQ-NF-011 | EXCLUDED | OPERATIONS | N/A(제외) | 외부 링크 주간 자동 점검 |
| REQ-NF-012 | IMPLEMENT | NON_UI | N/A(기술 Route) | TLS |
| REQ-NF-013 | IMPLEMENT | NON_UI | N/A(기술 Route) | RLS·역할 검증 |
| REQ-NF-014 | IMPLEMENT | NON_UI | N/A(기술 Route) | CSRF/SameSite |
| REQ-NF-015 | IMPLEMENT | NON_UI | N/A(기술 Route) | XSS 방지 |
| REQ-NF-016 | IMPLEMENT | NON_UI | N/A(기술 Route) | 비밀키 관리 |
| REQ-NF-017 | IMPLEMENT | NON_UI | SCR-003 | 항공·호텔 원시 입력값 미저장 |
| REQ-NF-018 | IMPLEMENT | UI_DIRECT | SCR-005 | 계정 탭 삭제 요청 버튼 |
| REQ-NF-019 | IMPLEMENT | NON_UI | SCR-004 | 신고 접수 응답 속도 |
| REQ-NF-020 | EXCLUDED | OPERATIONS | N/A(제외) | 신고 1차 검토 SLA |
| REQ-NF-021 | EXCLUDED | OPERATIONS | N/A(제외) | 속도 제한(rate limit) |
| REQ-NF-022 | EXCLUDED | OPERATIONS | N/A(제외) | Moderator 조치 추적 감사 로그 |
| REQ-NF-023 | IMPLEMENT | UI_STATE | 전역(공통 레이아웃) | 접근성 목표 수준 |
| REQ-NF-024 | EXCLUDED | OPERATIONS | N/A(제외) | 자동 접근성 검사 도구 |
| REQ-NF-025 | EXCLUDED | OPERATIONS | N/A(제외) | 정식 스크린리더 QA |
| REQ-NF-026 | IMPLEMENT | NON_UI | SCR-001 | 여행지 콘텐츠 완전성 검증 |
| REQ-NF-027 | IMPLEMENT | NON_UI | SCR-001 | 안전정보 커버리지 검증 |
| REQ-NF-028 | IMPLEMENT | UI_STATE | SCR-001 | 안전정보 최신 확인율(stale 표시) |
| REQ-NF-029 | EXCLUDED | OPERATIONS | N/A(제외) | 미디어 라이선스 메타데이터 |
| REQ-NF-030 | IMPLEMENT | NON_UI | 전역(공통 레이아웃) | SEO 메타데이터 |
| REQ-NF-031 | IMPLEMENT | NON_UI | N/A(기술 Route) | 타입체크·lint·단위테스트 |
| REQ-NF-032 | EXCLUDED | OPERATIONS | N/A(제외) | 구조화 로그 |
| REQ-NF-033 | EXCLUDED | OPERATIONS | N/A(제외) | 오류 알림(모니터링) |
| REQ-NF-034 | IMPLEMENT | NON_UI | N/A(기술 Route) | 인프라 비용 목표 |

---

## 5. 요약 집계

### 5.1 Requirement 수 검증

| 구분 | 건수 |
|---|---:|
| REQ-FUNC-001~080 | 80 |
| REQ-NF-001~034 | 34 |
| **합계** | **114** |

### 5.2 UI 분류별 건수

| UI 분류 | 건수 |
|---|---:|
| UI_DIRECT | 45 |
| UI_STATE | 22 |
| NON_UI | 22 |
| OPERATIONS | 25 |
| **합계** | **114** |

### 5.3 Screen별 배치 건수

| Screen | 배치 건수 |
|---|---:|
| SCR-001 `/` | 26 |
| SCR-002 `/about` | 7 |
| SCR-003 `/travel-tools` | 20 |
| SCR-004 `/mates` | 7 |
| SCR-005 `/account` | 13 |
| 전역(공통 레이아웃) | 12 |
| N/A(기술 Route) | 9 |
| N/A(제외, PROJECT_SCOPE EXCLUDED) | 20 |
| **합계** | **114** |

### 5.4 PROJECT_SCOPE 분류별 건수

| PROJECT_SCOPE | 건수 |
|---|---:|
| IMPLEMENT | 94 |
| EXCLUDED | 20 |
| **합계** | **114** |

---

## 6. 배치 원칙 확인

- 여행지 상세·국가 안전정보 상세는 `SCR-001`의 Drawer/Modal 내부 전환으로만 구현하며 별도 Screen을 만들지 않는다.
- 항공·숙소 입력과 동행 작성은 `SCR-003` 한 화면의 탭 3개(항공/숙소/동행 작성)로 통합한다.
- 동행 모집글 상세(참가 요청·신고·차단 진입점 포함)는 `SCR-004`의 상세 패널로만 제공한다.
- 로그인·회원가입·성인 확인, 프로필, 내 활동(즐겨찾기·내 모집글·참가 요청·차단), 관리자(신고 처리·외부 URL 설정)는 `SCR-005`의 탭 구조로 통합한다.
- API Route, 인증 콜백, 오류 처리 로직은 5개 디자인 Screen 어디에도 속하지 않는 기술 Route로 별도 취급한다.
- `PROJECT_SCOPE.md`에서 EXCLUDED로 확정된 13건은 본 문서에서도 Screen에 배치하지 않고 `N/A(제외)`로 표기하여 추적성만 유지한다.
