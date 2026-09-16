# Free Traveler — Project Scope (MVP 구현 범위 정의서)

- **Document ID:** SCOPE-TRAVEL-001
- **기반 문서:** `01_PRD.md`, `02_SRS_BASELINE.md`
- **대상 코드베이스:** Next.js App Router (`src/app`), Tailwind CSS, TypeScript
- **작성 기준일:** 2026-09-10

---

## 1. 문서 목적

이 문서는 `02_SRS_BASELINE.md`의 `REQ-FUNC-001~080`, `REQ-NF-001~034`를 한 건도 누락 없이 검토하여, 실제 MVP 코드베이스에서 각 요구사항을 **IMPLEMENT**(구현하고 테스트) 또는 **EXCLUDED**(만들지 않음)로 확정한다. 구현 방식은 Supabase·서버 인프라를 최소화하고, 정적 데이터와 브라우저 상태 중심으로 단순화한다.

---

## 2. 반드시 직접 구현할 범위

1. 핵심 화면 4개(`/`, `/destinations`, `/flights` 또는 `/hotels`, `/mates`) + 보조 화면 1개(`/safety`)를 포함한 전체 라우트
2. 여행지 검색·필터와 상세 패널
3. 국가 안전정보 패널
4. `free_traveler` 대표 소개
5. 항공·숙소 입력·검증·요약·외부 이동
6. Supabase 이메일 인증과 성인 확인
7. 동행글 작성·조회·수정·마감
8. 참가 요청·승인·거절
9. 간단한 차단·신고
10. 내 활동과 간단한 관리자 탭
11. Playwright 핵심 Smoke Test
12. Vercel 배포

## 3. 구현 방식

| 영역 | 방식 |
|---|---|
| 여행지·안전·대표 콘텐츠 | `src/data` 정적 데이터(코드/데이터 파일)로 관리, 별도 CMS 없음 |
| 즐겨찾기 | `localStorage` 기반, 서버 저장 없음 |
| 실시간 알림 | 실제 이메일 발송 대신 Toast 또는 화면 상태로 대체 |
| 모집글 자동 마감 | 배치 작업 없이, 조회 시점에 종료일을 계산해 상태를 판단 |
| 안전정보 최신성(stale) | 배치 작업 없이, 렌더링 시점에 최종 확인일과 현재일을 비교해 계산 |
| 이미지 | 일반 인터넷 URL과 `alt` 텍스트만 사용, 업로드·라이선스 승인 절차 없음 |
| 관리자 기능 | 신고 상태 처리와 외부 URL(항공·호텔) 설정만 제공 |

## 4. 제외 기능과 이유

| 제외 기능 | 이유 |
|---|---|
| 전체 콘텐츠 CMS | 콘텐츠는 `src/data` 정적 파일로 관리해 관리자 CRUD 화면이 불필요함 |
| 미디어 업로드·라이선스 승인 워크플로 | 이미지는 외부 URL을 직접 참조하므로 업로드·심사 절차가 필요 없음 |
| 범용 감사 로그 | 관리자 기능이 신고 상태·외부 URL 설정으로 한정되어 별도 감사 로그 체계가 불필요함 |
| 자동 백업·장애 알림·부하 테스트 | MVP 운영 인프라를 최소화하며, Vercel·Supabase 기본 제공 수준에 의존함 |
| 외부 이메일 사업자 연동 | 알림은 Toast/화면 상태로 대체하여 이메일 발송 연동이 불필요함 |
| EC2·AWS 인프라 | Vercel·Supabase 관리형 서비스만 사용함 |
| 무인 자동 Merge Runner | 배포·병합은 수동 검토 절차를 유지함 |

---

## 5. 기능 요구사항 매핑 (REQ-FUNC-001~080)

범례: **분류** IMPLEMENT / EXCLUDED, **확인 방법**은 Playwright Smoke Test(PW), 수동 확인(수동), 코드/데이터 검증 스크립트(스크립트) 중 표기.

### 5.1 F1. Destination Guide

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-FUNC-001 | IMPLEMENT | `src/data` 정적 여행지 데이터에 `scope`(국내/해외) 필드를 두고 탭 전환 시 필터링 | PW: 국내/해외 탭 전환 후 목록 검증 |
| REQ-FUNC-002 | IMPLEMENT | 국가·도시·계절·테마·기간 필터를 클라이언트 상태로 AND 조건 적용(정적 데이터라 별도 성능 최적화 불요) | 수동 + PW 기본 필터 케이스 |
| REQ-FUNC-003 | IMPLEMENT | 클라이언트 측 부분 일치 키워드 검색(여행지명·국가명·테마) | 수동 검색 확인 |
| REQ-FUNC-004 | IMPLEMENT | 여행지 상세 패널에 소개·명소·추천 시기·1일/3일 일정·예산·교통·음식·에티켓·출처·수정일 필드를 정적 데이터 스키마로 강제 | 스크립트: 필수 필드 누락 검사 |
| REQ-FUNC-005 | IMPLEMENT | 필터 결과 0건 시 안내 문구와 초기화 버튼 표시 | 수동 확인 |
| REQ-FUNC-006 | IMPLEMENT | 해외 여행지 상세에서 `country_code` 매칭으로 안전정보 패널/페이지 연결 | 수동 + PW 링크 이동 확인 |
| REQ-FUNC-007 | IMPLEMENT | 이미지에 `alt` 텍스트와 출처 URL을 데이터로 기록(라이선스 메타데이터는 관리하지 않음, §6 REQ-NF-029 참조) | 스크립트: `alt`·출처 URL 존재 검사 |
| REQ-FUNC-008 | IMPLEMENT | 국내 10곳 이상, 해외 15개국 30개 도시 이상 시드 데이터 구축 | 스크립트: 데이터 수량 검사 |
| REQ-FUNC-009 | IMPLEMENT | 동일 국가/테마 기준 관련 여행지 최대 6개 표시(정적 데이터 필터링) | 수동 확인 |
| REQ-FUNC-010 | IMPLEMENT | 필터 상태를 URL query에 반영·복원(허용 키만 파싱) | 수동 확인 |

### 5.2 F2. Flight Link-out

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-FUNC-011 | IMPLEMENT | 항공 입력 폼에 국가·지역·출발일·귀국일 필수 필드 구현 | PW: 필수값 미입력 케이스 |
| REQ-FUNC-012 | IMPLEMENT | 국가 선택 시 하위 지역만 노출, 국가 변경 시 지역값 초기화 | 수동 확인 |
| REQ-FUNC-013 | IMPLEMENT | 과거 출발일·역전 날짜 클라이언트 검증 후 진행 차단 | PW: 경계값 날짜 케이스 |
| REQ-FUNC-014 | IMPLEMENT | 검증 통과 후 브라우저 상태(React state)로 요약 화면 표시 | 수동 확인 |
| REQ-FUNC-015 | IMPLEMENT | 폼·요약 화면에 "입력값은 외부 사이트로 전달되지 않습니다" 고지 문구 표시 | PW: 문구 존재 확인 |
| REQ-FUNC-016 | IMPLEMENT | 관리자 설정 URL을 `target="_blank" rel="noopener noreferrer"`로 새 탭 오픈, query 미부착 | PW: 외부 이동 버튼 속성 확인 |
| REQ-FUNC-017 | IMPLEMENT | 항공 입력값은 React 컴포넌트 상태로만 유지, 서버 전송·저장 로직 없음 | 코드 리뷰 + 네트워크 탭 수동 확인 |
| REQ-FUNC-018 | IMPLEMENT | 외부 URL 미설정/형식 오류 시 이동 차단, 오류 메시지와 재시도 버튼 제공 | 수동 확인(환경변수 미설정 케이스) |

### 5.3 F3. Hotel Link-out

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-FUNC-019 | IMPLEMENT | 호텔 입력 폼에 국가·지역·체크인·체크아웃 필수 필드 구현 | PW: 필수값 미입력 케이스 |
| REQ-FUNC-020 | IMPLEMENT | 국가별 하위 지역 제한 및 초기화 로직 | 수동 확인 |
| REQ-FUNC-021 | IMPLEMENT | 과거 체크인, 체크아웃≤체크인 검증 후 진행 차단 | PW: 경계값 날짜 케이스 |
| REQ-FUNC-022 | IMPLEMENT | 검증 후 국가·지역·체크인·체크아웃 요약 표시 | 수동 확인 |
| REQ-FUNC-023 | IMPLEMENT | 폼·요약에 입력값 비전달 고지 표시 | PW: 문구 존재 확인 |
| REQ-FUNC-024 | IMPLEMENT | 관리자 설정 호텔 URL을 새 탭·`noopener,noreferrer`로 오픈 | PW: 외부 이동 버튼 속성 확인 |
| REQ-FUNC-025 | IMPLEMENT | 호텔 입력값 서버 미전송·미저장(REQ-FUNC-017과 동일 원칙) | 코드 리뷰 + 수동 확인 |
| REQ-FUNC-026 | IMPLEMENT | URL 오류 시 이동 차단, 현재 입력값 유지한 채 오류 표시 | 수동 확인 |

### 5.4 F4. Travel Mate

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-FUNC-027 | IMPLEMENT | Supabase Auth 세션 필수화(미들웨어/서버 액션 가드) | PW: 비로그인 글쓰기 차단 케이스 |
| REQ-FUNC-028 | IMPLEMENT | 성인 확인 체크박스 제출 시 `is_adult`, `adult_verified_at`만 저장, 생년월일 미저장 | 수동 확인(DB 스키마 검토) |
| REQ-FUNC-029 | IMPLEMENT | 닉네임·연령대·여행 스타일 필수, 성별 선택 입력 프로필 폼 | 수동 확인 |
| REQ-FUNC-030 | IMPLEMENT | 국가·지역·기간 겹침·연령대·성별·스타일·모집상태 필터(Supabase 쿼리 또는 클라이언트 필터) | 수동 확인 |
| REQ-FUNC-031 | IMPLEMENT | 모집글 작성 폼 필수 입력·날짜 검증·안전수칙 동의 체크 | PW: 필수값 누락 케이스 |
| REQ-FUNC-032 | IMPLEMENT | 정규식 기반 전화번호·이메일·메신저 ID 패턴 탐지 후 제출 차단 | 수동 확인(테스트 문자열 세트) |
| REQ-FUNC-033 | IMPLEMENT | 모집글 상세 응답에 이메일·전화번호 필드 미노출 | 수동 확인(API 응답 검토) |
| REQ-FUNC-034 | IMPLEMENT | 500자 제한 참가 메시지 비공개 제출(PENDING 상태 저장) | 수동 확인 |
| REQ-FUNC-035 | IMPLEMENT | Supabase unique 제약 + UI 중복 요청 방지 | 수동 확인 |
| REQ-FUNC-036 | IMPLEMENT | 작성자만 승인/거절 가능하도록 RLS·서버 액션 권한 검증 | 수동 확인(비작성자 접근 시도) |
| REQ-FUNC-037 | IMPLEMENT | 별도 배치 없이 목록/상세 조회 시 `종료일 < 오늘`이면 CLOSED로 간주해 표시 | 수동 확인(과거 종료일 데이터 케이스) |
| REQ-FUNC-038 | IMPLEMENT | 작성자 본인 수동 마감·수정·삭제 기능 제공 | 수동 확인 |
| REQ-FUNC-039 | IMPLEMENT | 글·사용자·요청 신고 폼(사유 코드+설명), 신고 ID 즉시 표시 | 수동 확인 |
| REQ-FUNC-040 | IMPLEMENT | 사용자 차단·해제, 차단 시 상호 글·프로필·요청 비노출 | 수동 확인 |
| REQ-FUNC-041 | IMPLEMENT | 관리자 탭에 신고 목록과 상태(OPEN/RESOLVED 등) 필터 제공(단순 리스트, 우선순위·증거 첨부 등 고급 기능 제외) | 수동 확인 |
| REQ-FUNC-042 | IMPLEMENT | 관리자 탭에서 신고 상태를 변경(예: 처리완료/기각)하고 처리 시각만 기록. 별도의 범용 감사 로그(변경 이력 전체 추적)는 구축하지 않음 | 수동 확인 |
| REQ-FUNC-043 | IMPLEMENT | 참가 요청/승인/거절/신고 처리 결과를 Toast 또는 화면 상태 배지로 안내. 이메일 발송은 하지 않음 | 수동 확인 |
| REQ-FUNC-044 | IMPLEMENT | Supabase RLS로 본인 글/요청, 작성자, 관리자만 비공개 데이터 열람 | 수동 확인(다른 계정으로 접근 시도) |
| REQ-FUNC-045 | IMPLEMENT | 탈퇴 시 즉시 공개 프로필 비식별화(닉네임·소개 익명 처리)와 수동 삭제 처리로 단순화. 30일 자동 삭제 배치·법적 보존 예외 처리 등 자동화 워크플로는 구축하지 않음 | 수동 확인 |

### 5.5 F5. Country Safety

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-FUNC-046 | IMPLEMENT | 소개된 해외 15개국 전체에 대해 정적 안전정보 데이터 구축 | 스크립트: 국가 수 대비 안전정보 수 검사 |
| REQ-FUNC-047 | IMPLEMENT | 치안·사기·법규·교통·재난·보건·문화·긴급연락처 8개 카테고리를 데이터 스키마로 필수화 | 스크립트: 카테고리 누락 검사 |
| REQ-FUNC-048 | IMPLEMENT | 각 안전정보 항목에 출처명·URL·최종 확인일·편집자 필드 기록 | 스크립트: 메타데이터 존재 검사 |
| REQ-FUNC-049 | IMPLEMENT | 외교부 해외안전여행 원문 링크를 `noopener,noreferrer` 새 탭으로 제공 | 수동 확인 |
| REQ-FUNC-050 | IMPLEMENT | 렌더링 시점에 `오늘 - 최종확인일 > 7일`을 계산해 stale 배지 표시(배치 작업 없음) | 수동 확인(확인일 조작 데이터로 검증) |
| REQ-FUNC-051 | IMPLEMENT | 중대 경보(여행금지 등)를 텍스트 라벨과 함께 페이지 상단에 표시 | 수동 확인 |
| REQ-FUNC-052 | IMPLEMENT | `scope_type`(국가/지역)과 `scope_text`를 데이터에 구분 기록 | 수동 확인 |
| REQ-FUNC-053 | IMPLEMENT | 현지 긴급전화·영사콜센터 정보를 정적 데이터로 표시 | 수동 확인 |
| REQ-FUNC-054 | IMPLEMENT | 안전 페이지·항공 요약 화면에 "공식 판단 대체 불가, 출국 전 재확인 필요" 고지 문구 표시 | 수동 확인 |
| REQ-FUNC-055 | EXCLUDED | 안전 콘텐츠는 코드 저장소의 정적 데이터 파일로 작성·검수하며, 별도 Editor/Admin 작성·게시 관리자 화면(CMS)은 구축하지 않음 | — |
| REQ-FUNC-056 | EXCLUDED | 변경 이력(이전값/새값/사유/담당자/시각) DB 보존 기능은 범용 감사 로그에 해당하여 구축하지 않으며, 변경 이력은 Git 커밋 이력으로 대체함 | — |

### 5.6 F6. About free_traveler

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-FUNC-057 | IMPLEMENT | `free_traveler`, `50+ Trips`, `30+ Countries`를 단일 정적 데이터 소스에서 참조해 대표 페이지·홈에 표시 | PW: 수치 노출 확인 |
| REQ-FUNC-058 | IMPLEMENT | PRD 확정 소개문·여행 철학·편집 원칙을 정적 데이터로 표시 | 수동 확인 |
| REQ-FUNC-059 | IMPLEMENT | 방문 권역/국가 목록을 정적 데이터로 표시 | 수동 확인 |
| REQ-FUNC-060 | IMPLEMENT | 대표 여행 타임라인(연도·장소·요약) 정적 데이터 표시 | 수동 확인 |
| REQ-FUNC-061 | IMPLEMENT | 대표 이미지에 `alt`·출처 URL 기록(라이선스 필드는 관리하지 않음) | 스크립트: `alt`·출처 URL 검사 |
| REQ-FUNC-062 | IMPLEMENT | 관리자 외부 URL 설정값 기반 문의·SNS 링크(빈 값 미표시, 허용 프로토콜만) | 수동 확인 |
| REQ-FUNC-063 | IMPLEMENT | 추천 여행지 6곳을 정적 데이터로 연결(비공개 항목 자동 제외) | 수동 확인 |

### 5.7 F7. Common / Admin / Governance

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-FUNC-064 | IMPLEMENT | 전역 내비게이션·푸터 레이아웃(`src/app/layout.tsx`)에 핵심 메뉴 배치 | PW: 주요 메뉴 이동 확인 |
| REQ-FUNC-065 | IMPLEMENT | Tailwind 반응형 유틸리티로 320px~데스크톱 레이아웃 대응 | 수동 확인(뷰포트 리사이즈) |
| REQ-FUNC-066 | IMPLEMENT | Supabase Auth 이메일 가입·인증·로그인·로그아웃·비밀번호 재설정 | PW: 로그인/로그아웃 핵심 흐름 |
| REQ-FUNC-067 | IMPLEMENT | 여행지·안전정보 통합 키워드 검색(클라이언트 필터, 결과 유형 라벨 표시) | 수동 확인 |
| REQ-FUNC-068 | IMPLEMENT | `localStorage` 기반 즐겨찾기 추가/해제/목록, 중복 방지 | 수동 확인 |
| REQ-FUNC-069 | IMPLEMENT | Web Share API 시도 후 실패 시 URL 복사로 폴백 | 수동 확인 |
| REQ-FUNC-070 | IMPLEMENT | Next.js Metadata API로 title/description/canonical/OG 태그 구현 | 수동 확인(페이지 소스 검토) |
| REQ-FUNC-071 | EXCLUDED | 별도 행동 분석 이벤트 수집 파이프라인은 구축하지 않음(운영 지표는 화면 상태·수동 확인으로 대체) | — |
| REQ-FUNC-072 | EXCLUDED | 여행지 콘텐츠는 정적 데이터 파일로 관리하므로 Editor/Admin CRUD 관리자 화면(CMS)은 구축하지 않음 | — |
| REQ-FUNC-073 | EXCLUDED | 이미지는 외부 URL을 직접 참조하므로 업로드 시 출처·라이선스 필수 입력 워크플로는 구축하지 않음 | — |
| REQ-FUNC-074 | IMPLEMENT | Admin 게시 게이트 UI 대신, 데이터 검증 스크립트(§5.1 REQ-FUNC-004 등)로 필수 필드 누락을 CI/로컬에서 확인 | 스크립트 |
| REQ-FUNC-075 | EXCLUDED | 관리자 기능은 신고 상태·외부 URL 설정으로 한정되며, stale 현황 대시보드는 별도로 만들지 않음(개별 페이지의 stale 표시는 REQ-FUNC-050으로 충족) | — |
| REQ-FUNC-076 | EXCLUDED | 범용 감사 로그(모든 관리자 변경 이력)는 구축하지 않으며, 신고 처리 상태만 기록(REQ-FUNC-042 참조) | — |
| REQ-FUNC-077 | IMPLEMENT | 관리자 탭에서 항공·호텔 외부 URL을 HTTPS 허용목록 내에서만 설정 가능하도록 검증 | 수동 확인 |
| REQ-FUNC-078 | IMPLEMENT | Next.js 404/500/권한없음/외부연결실패 화면에 홈·이전·재시도 버튼 제공 | 수동 확인 |
| REQ-FUNC-079 | IMPLEMENT | 폼·모달·탭·알림에 시맨틱 HTML과 기본 ARIA 속성 적용(정식 접근성 감사 도구 도입은 제외) | 수동 확인(키보드 내비게이션) |
| REQ-FUNC-080 | IMPLEMENT | 이용약관·개인정보 처리방침·동행 안전수칙·콘텐츠 면책 정적 페이지 제공, 모집글 작성 시 동의 체크박스와 동의 시각 저장 | 수동 확인 |

---

## 6. 비기능 요구사항 매핑 (REQ-NF-001~034)

### 6.1 Performance

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-NF-001 | IMPLEMENT | Next.js 이미지 최적화·서버 컴포넌트 활용으로 LCP 최소화(자동 모니터링·CI 게이트는 제외) | 수동 확인(브라우저 개발자 도구) |
| REQ-NF-002 | IMPLEMENT | 클라이언트 상호작용을 경량 상태 관리로 구현해 지연 최소화 | 수동 확인 |
| REQ-NF-003 | IMPLEMENT | 이미지 크기 고정, 스켈레톤 없이도 레이아웃 이동 최소화하는 마크업 사용 | 수동 확인 |
| REQ-NF-004 | IMPLEMENT | 정적 데이터 기반 클라이언트 필터로 1초 이내 응답 확보 | 수동 확인 |
| REQ-NF-005 | IMPLEMENT | Supabase 단순 insert/update 위주 쓰기 흐름으로 3초 이내 응답 확보 | 수동 확인 |
| REQ-NF-006 | IMPLEMENT | `next/image` 반응형 크기·lazy load 적용 | 수동 확인 |
| REQ-NF-007 | EXCLUDED | Lighthouse 자동 성능 게이트는 CI 인프라 확장이 필요해 제외하고, 배포 전 수동 확인으로 대체 | — |

### 6.2 Reliability and Recovery

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-NF-008 | EXCLUDED | 별도 가용성 모니터링·SLA 측정 체계 없이 Vercel/Supabase 기본 가용성에 의존 | — |
| REQ-NF-009 | EXCLUDED | 5xx 비율 모니터링 대시보드는 구축하지 않음 | — |
| REQ-NF-010 | EXCLUDED | 자동 백업·RPO/RTO 정책은 제외 범위로 Supabase 기본 백업에 의존 | — |
| REQ-NF-011 | EXCLUDED | 외부 링크 주간 자동 점검·알림은 제외하며, 배포 전 수동 점검으로 대체 | — |

### 6.3 Security and Privacy

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-NF-012 | IMPLEMENT | Vercel·Supabase가 기본 제공하는 TLS 1.2+ 사용, 별도 구현 불요 | 수동 확인(SSL 설정 확인) |
| REQ-NF-013 | IMPLEMENT | Supabase RLS 정책과 서버 액션 권한 검증으로 역할 기반 접근 제어 | 수동 확인(권한별 접근 시도) |
| REQ-NF-014 | IMPLEMENT | Supabase Auth 기본 세션 보호 및 SameSite 쿠키 활용 | 수동 확인 |
| REQ-NF-015 | IMPLEMENT | React 기본 이스케이프 및 입력값 검증으로 저장 XSS 차단 | 수동 확인(스크립트 입력 테스트) |
| REQ-NF-016 | IMPLEMENT | Vercel 환경변수로 비밀키 관리, 클라이언트 번들 미포함 확인 | 수동 확인(빌드 산출물 검토) |
| REQ-NF-017 | IMPLEMENT | 항공·호텔 입력값은 React state로만 유지, 서버·로그 미전송(REQ-FUNC-017/025와 동일) | 수동 확인 |
| REQ-NF-018 | IMPLEMENT | 마이페이지에서 개인정보 삭제 요청(탈퇴) 제공, 즉시 비식별화로 단순화(자동 30일 삭제 배치는 제외, REQ-FUNC-045 참조) | 수동 확인 |

### 6.4 Safety and Moderation

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-NF-019 | IMPLEMENT | 신고 접수는 단순 Supabase insert로 3초 이내 응답 | 수동 확인 |
| REQ-NF-020 | EXCLUDED | 24시간 SLA 측정·모니터링 체계는 운영 대시보드가 필요해 제외, 관리자 탭에서 수동 처리만 지원 | — |
| REQ-NF-021 | EXCLUDED | 별도 속도 제한(rate limiting) 인프라는 제외하며, 중복 요청 방지(REQ-FUNC-035)만으로 대체 | — |
| REQ-NF-022 | EXCLUDED | Moderator 조치 추적을 위한 범용 감사 로그는 제외하며, 신고 상태 필드만 기록(REQ-FUNC-042) | — |

### 6.5 Accessibility

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-NF-023 | IMPLEMENT | 시맨틱 HTML·키보드 접근 가능한 폼/모달 구현(공식 인증 없이 목표 수준으로 지향) | 수동 확인(키보드 내비게이션) |
| REQ-NF-024 | EXCLUDED | axe 등 자동 접근성 검사 도구 도입은 제외하며, Playwright Smoke Test로 핵심 흐름만 검증 | — |
| REQ-NF-025 | EXCLUDED | 정식 스크린리더 전수 QA 프로세스는 제외하며, 핵심 화면만 수동으로 표본 확인 | — |

### 6.6 Content, Freshness, SEO, Copyright

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-NF-026 | IMPLEMENT | 정적 데이터 스키마와 검증 스크립트로 여행지 필수 필드 100% 충족 확인 | 스크립트 |
| REQ-NF-027 | IMPLEMENT | 소개 해외 15개국 전체 안전정보 데이터 구축(REQ-FUNC-046과 동일) | 스크립트 |
| REQ-NF-028 | IMPLEMENT | 렌더링 시 최종 확인일 기준 stale 계산·경고(REQ-FUNC-050과 동일 로직) | 수동 확인 |
| REQ-NF-029 | EXCLUDED | 이미지 라이선스 메타데이터 관리 워크플로는 제외하며, 출처 URL과 `alt` 텍스트만 관리 | — |
| REQ-NF-030 | IMPLEMENT | Metadata API로 공개 페이지 SEO 메타데이터 제공(REQ-FUNC-070과 동일) | 수동 확인 |

### 6.7 Maintainability, Monitoring, Cost

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-NF-031 | IMPLEMENT | TypeScript strict, ESLint, 기본 단위 테스트를 배포 전 실행 | `npm run lint` + 단위 테스트 실행 |
| REQ-NF-032 | EXCLUDED | 구조화 로그 수집 체계는 모니터링 인프라 확장이 필요해 제외 | — |
| REQ-NF-033 | EXCLUDED | 5xx·외부 링크 실패 자동 알림은 장애 알림 인프라에 해당해 제외 | — |
| REQ-NF-034 | IMPLEMENT | Vercel·Supabase 무료/저비용 티어 내에서 설계, 배포 후 실사용 비용으로 확인 | 수동 확인(배포 후 비용 확인) |

---

## 7. 검증 요약

- **Playwright 핵심 Smoke Test**: 홈 → 여행지 상세 → 안전정보 이동, 항공/호텔 입력·요약·외부 이동 버튼 속성, 회원가입·로그인, 동행글 작성·참가 요청·승인/거절, 신고 접수 흐름을 최소 1회씩 커버한다.
- **데이터 검증 스크립트**: `src/data`의 여행지·안전정보·대표 프로필 콘텐츠가 필수 필드(개수·메타데이터)를 충족하는지 확인한다.
- **수동 확인**: 자동화 도구를 도입하지 않은 접근성·성능·보안 항목은 배포 전 수동 점검으로 대체한다.
- **Vercel 배포**: 환경변수(외부 URL, Supabase 키)를 설정하고 프로덕션 배포 후 핵심 화면을 재확인한다.
