# Free Traveler — Task List (docs/tasks/TASKLIST.json 요약)

- **작성 기준일:** 2026-09-15
- **원본:** `docs/tasks/TASKLIST.json` (기계 판독용, 이 문서는 사람이 읽는 요약)
- **입력 문서:** `design-reference/SCREEN_ROUTE_CONTRACT.json`(HARNESS_SCHEMA=`traveler-screen-route-v1`), `design-reference/UI_CONTRACT.md`, `design-reference/D-001/DESIGN.md`, `docs/PROJECT_SCOPE.md`, `docs/UIUX_TRACEABILITY.md`
- **검증:** `python scripts/validate_inputs.py` PASS (Screens 5, Requirements 114: IMPLEMENT 94 / EXCLUDED 20)

## 요약

| 구분 | 개수 |
|---|---:|
| **Task 총수** | **61** |
| page_owner | 5 |
| component | 40 |
| static_data | 4 |
| db | 4 |
| auth | 3 |
| global | 4 |
| test | 1 |
| **IMPLEMENT Requirement 커버(94/94)** | 100% |
| **EXCLUDED Requirement(Task 미생성, 20건)** | 아래 Register 참조 |

---

## Page Owner (5) — Screen당 정확히 1개

| Task ID | Screen | Route | Page Entry | Depends On(Component) | 커버 Requirement 수 |
|---|---|---|---|---|---:|
| TASK-PO-SCR-001 | SCR-001 | `/` | `src/app/page.tsx` (replace_starter) | TASK-CMP-SCR-001-01~08, TASK-GLOBAL-01 | 26 |
| TASK-PO-SCR-002 | SCR-002 | `/about` | `src/app/about/page.tsx` (create) | TASK-CMP-SCR-002-01~08, TASK-GLOBAL-01 | 7 |
| TASK-PO-SCR-003 | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` (create) | TASK-CMP-SCR-003-01~08, TASK-GLOBAL-01 | 20 |
| TASK-PO-SCR-004 | SCR-004 | `/mates` | `src/app/mates/page.tsx` (create) | TASK-CMP-SCR-004-01~08, TASK-GLOBAL-01 | 7 |
| TASK-PO-SCR-005 | SCR-005 | `/account` | `src/app/account/page.tsx` (create) | TASK-CMP-SCR-005-01~08, TASK-GLOBAL-01 | 13 |

## Component — SCR-001 (8)

| Task ID | 제목 | Requirement Ref |
|---|---|---|
| TASK-CMP-SCR-001-01 | SearchHero | REQ-FUNC-003,010,067 |
| TASK-CMP-SCR-001-02 | DestinationCardGrid | REQ-FUNC-001,002,005,008,009 / REQ-NF-004 |
| TASK-CMP-SCR-001-03 | ThemeChipList | REQ-FUNC-002 |
| TASK-CMP-SCR-001-04 | DestinationDrawer | REQ-FUNC-004,006,007,068,069 / REQ-NF-026 |
| TASK-CMP-SCR-001-05 | SafetyNoticeCardGrid | REQ-FUNC-046,047,051,052 / REQ-NF-027 |
| TASK-CMP-SCR-001-06 | SafetyDrawer | REQ-FUNC-048,049,050,053,054 / REQ-NF-028 |
| TASK-CMP-SCR-001-07 | RecentMatePreview(Empty State 포함) | — |
| TASK-CMP-SCR-001-08 | AboutSummaryBanner | — |

## Component — SCR-002 (8)

| Task ID | 제목 | Requirement Ref |
|---|---|---|
| TASK-CMP-SCR-002-01 | AboutHero | REQ-FUNC-057,061 |
| TASK-CMP-SCR-002-02 | TravelStatCard | REQ-FUNC-057 |
| TASK-CMP-SCR-002-03 | PhilosophySplit | REQ-FUNC-058 |
| TASK-CMP-SCR-002-04 | TravelTimeline(6개 이상) | REQ-FUNC-060 |
| TASK-CMP-SCR-002-05 | VisitedCountryChipGroup(30개국) | REQ-FUNC-059 |
| TASK-CMP-SCR-002-06 | PhotoGallery(8장 이상) | REQ-FUNC-061 |
| TASK-CMP-SCR-002-07 | MemorableDestinationCardGrid(4개) | REQ-FUNC-063 |
| TASK-CMP-SCR-002-08 | CtaBanner | REQ-FUNC-062 |

## Component — SCR-003 (8, 항공·숙소·동행 작성 영역 분리)

| Task ID | 제목 | Requirement Ref |
|---|---|---|
| TASK-CMP-SCR-003-01 | TravelToolsIntro | — |
| TASK-CMP-SCR-003-02 | TravelToolTabs(내부 탭) | — |
| TASK-CMP-SCR-003-03 | FlightConditionForm | REQ-FUNC-011~015,017 / REQ-NF-017 |
| TASK-CMP-SCR-003-04 | HotelConditionForm | REQ-FUNC-019~023,025 |
| TASK-CMP-SCR-003-05 | SummaryActionCard(외부 이동) | REQ-FUNC-016,018,024,026 |
| TASK-CMP-SCR-003-06 | NonTransferNotice & SearchTipList | REQ-FUNC-015,023 |
| TASK-CMP-SCR-003-07 | MateComposeForm | REQ-FUNC-031,032 / REQ-NF-005 |
| TASK-CMP-SCR-003-08 | LoginRequiredNotice | — |

## Component — SCR-004 (8, 목록·필터·상세·참가·신고·차단 분리)

| Task ID | 제목 | Requirement Ref |
|---|---|---|
| TASK-CMP-SCR-004-01 | MatesIntro | — |
| TASK-CMP-SCR-004-02 | MateFilterBar | REQ-FUNC-030 |
| TASK-CMP-SCR-004-03 | MatePostCardGrid | REQ-FUNC-037 |
| TASK-CMP-SCR-004-04 | MateListDetailView(목록+상세) | REQ-FUNC-033,039 |
| TASK-CMP-SCR-004-05 | JoinRequestForm | REQ-FUNC-034,035 |
| TASK-CMP-SCR-004-06 | ReportBlockButtons | REQ-FUNC-039 / REQ-NF-019 |
| TASK-CMP-SCR-004-07 | HowToJoinSteps | — |
| TASK-CMP-SCR-004-08 | SafetyCtaBanner | — |

## Component — SCR-005 (8, Auth·Profile·My Activity·Admin 분리)

| Task ID | 제목 | Requirement Ref |
|---|---|---|
| TASK-CMP-SCR-005-01 | AccountTabs(Guest/Member/Admin 구조 + 세션 가드) | REQ-FUNC-027 |
| TASK-CMP-SCR-005-02 | GuestAuthArea | REQ-FUNC-066,080 |
| TASK-CMP-SCR-005-03 | ProfileSummaryCard | REQ-FUNC-028,029,045 / REQ-NF-018 |
| TASK-CMP-SCR-005-04 | MyPostList | REQ-FUNC-038 |
| TASK-CMP-SCR-005-05 | JoinRequestManager | REQ-FUNC-036 |
| TASK-CMP-SCR-005-06 | BlockList | REQ-FUNC-040 |
| TASK-CMP-SCR-005-07 | AdminReportQueue | REQ-FUNC-041,042 |
| TASK-CMP-SCR-005-08 | ExternalUrlAllowlistForm | REQ-FUNC-077 |

## Static Data (4)

| Task ID | 제목 | Requirement Ref |
|---|---|---|
| TASK-DATA-01 | 국내·해외 여행지 정적 데이터 | REQ-FUNC-001,004,006,007,008,009 |
| TASK-DATA-02 | 국가별 안전정보 정적 데이터 | REQ-FUNC-046,047,048,050,052,053 / REQ-NF-027 |
| TASK-DATA-03 | free_traveler 대표 소개 정적 데이터 | REQ-FUNC-057~061,063 |
| TASK-DATA-04 | 정적 데이터 필수 필드 검증 스크립트 | REQ-FUNC-074 / REQ-NF-026 |

## DB (4, 최대 6테이블)

| Task ID | 제목 | Requirement Ref |
|---|---|---|
| TASK-DB-01 | DB Schema(mates, mate_applications, mate_blocks, mate_reports, member_profiles, outbound_url_settings) | REQ-FUNC-034,035 |
| TASK-DB-02 | DB RLS 정책 | REQ-FUNC-036,044 / REQ-NF-013 |
| TASK-DB-03 | DB Access Layer | REQ-FUNC-017,025,033,037,040,041,042,045 / REQ-NF-012,014,015,016,017 |
| TASK-DB-04 | DB Seed 스크립트 | — |

## Auth (3)

| Task ID | 제목 | Requirement Ref |
|---|---|---|
| TASK-AUTH-01 | 이메일 가입·인증·로그인·로그아웃 | REQ-FUNC-027,066 / REQ-NF-014 |
| TASK-AUTH-02 | 비밀번호 재설정 | REQ-FUNC-066 |
| TASK-AUTH-03 | 성인 확인 세션 처리 | REQ-FUNC-028 |

## Global (4)

| Task ID | 제목 | Requirement Ref |
|---|---|---|
| TASK-GLOBAL-01 | layout.tsx 전역 내비게이션/Footer | REQ-FUNC-043,064 |
| TASK-GLOBAL-02 | 반응형 레이아웃·SEO 메타데이터·접근성 기본기 | REQ-FUNC-065,070,079 / REQ-NF-001,002,003,006,023,030 |
| TASK-GLOBAL-03 | 오류/404 화면 | REQ-FUNC-078 |
| TASK-GLOBAL-04 | CI 품질 게이트(Lint/Test/Build)와 비용 확인 | REQ-NF-031,034 |

## Test (1, Playwright Chromium Smoke)

| Task ID | 제목 | Depends On |
|---|---|---|
| TASK-TEST-01 | Playwright Chromium Smoke Test(홈→여행지 상세→안전정보, 항공/호텔 입력→요약→외부이동 버튼 속성, 회원가입/로그인, 동행글 작성→참가요청→승인/거절, 신고 접수) | TASK-PO-SCR-001~005 |

---

## Excluded Requirements Register (Task 미생성, 20건)

| Requirement | 사유 요약 | 후속 방향 |
|---|---|---|
| REQ-FUNC-055 | 안전 콘텐츠는 `src/data` 정적 파일로 작성·검수하며 별도 CMS(Editor/Admin 작성·게시 화면)를 만들지 않음 | Git 커밋 이력으로 변경 관리 대체 |
| REQ-FUNC-056 | 변경 이력(이전값/새값/사유/담당자/시각) DB 보존은 범용 감사 로그에 해당해 제외 | Git 커밋 이력으로 대체 |
| REQ-FUNC-071 | 별도 행동 분석 이벤트 수집 파이프라인 미구축 | 화면 상태·수동 확인으로 대체 |
| REQ-FUNC-072 | 여행지 콘텐츠는 정적 데이터 파일로 관리하여 Editor/Admin CRUD 관리자 화면(CMS) 불필요 | TASK-DATA-01/02/03이 대체 |
| REQ-FUNC-073 | 이미지는 외부 URL을 직접 참조하므로 업로드 시 출처·라이선스 필수 입력 워크플로 불필요 | `alt`·출처 URL만 데이터로 관리(TASK-DATA-04) |
| REQ-FUNC-075 | 관리자 기능은 신고 상태·외부 URL 설정으로 한정, stale 현황 대시보드는 별도 구축하지 않음 | 개별 화면 stale 표시(REQ-FUNC-050)로 충족 |
| REQ-FUNC-076 | 범용 감사 로그(모든 관리자 변경 이력) 미구축 | 신고 처리 상태만 기록(REQ-FUNC-042) |
| REQ-NF-007 | Lighthouse 자동 성능 게이트는 CI 인프라 확장 필요, 제외 | 배포 전 수동 확인으로 대체 |
| REQ-NF-008 | 별도 가용성 모니터링·SLA 측정 체계 없음 | Vercel/Supabase 기본 가용성에 의존 |
| REQ-NF-009 | 5xx 비율 모니터링 대시보드 미구축 | — |
| REQ-NF-010 | 자동 백업·RPO/RTO 정책 제외 | Supabase 기본 백업에 의존 |
| REQ-NF-011 | 외부 링크 주간 자동 점검·알림 제외 | 배포 전 수동 점검으로 대체 |
| REQ-NF-020 | 24시간 SLA 측정·모니터링 체계 제외(운영 대시보드 필요) | 관리자 탭 수동 처리만 지원 |
| REQ-NF-021 | 별도 속도 제한(rate limiting) 인프라 제외 | 중복 요청 방지(REQ-FUNC-035)만으로 대체 |
| REQ-NF-022 | Moderator 조치 추적용 범용 감사 로그 제외 | 신고 상태 필드만 기록(REQ-FUNC-042) |
| REQ-NF-024 | axe 등 자동 접근성 검사 도구 도입 제외 | Playwright Smoke Test로 핵심 흐름만 검증 |
| REQ-NF-025 | 정식 스크린리더 전수 QA 프로세스 제외 | 핵심 화면 수동 표본 확인 |
| REQ-NF-029 | 이미지 라이선스 메타데이터 관리 워크플로 제외 | 출처 URL·`alt` 텍스트만 관리 |
| REQ-NF-032 | 구조화 로그 수집 체계는 모니터링 인프라 확장 필요, 제외 | — |
| REQ-NF-033 | 5xx·외부 링크 실패 자동 알림 제외(장애 알림 인프라 필요) | — |

- 삭제가 아니며, `docs/UIUX_TRACEABILITY.md`의 해당 행은 `Task: N/A(EXCLUDED)` / `Status: EXCLUDED_CONFIRMED`로 유지된다.
- 다음 단계는 `/gen-task-details`로 61개 Task 각각의 상세 파일(`docs/tasks/details/<TASK_ID>.md`)을 1:1로 생성하는 것이다.
