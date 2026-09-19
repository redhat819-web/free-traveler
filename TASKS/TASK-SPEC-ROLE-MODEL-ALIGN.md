# SPEC-ROLE-MODEL-ALIGN — 권한 모델 문서/AC 정합화 (기록용, 미착수)

- **Task ID:** `SPEC-ROLE-MODEL-ALIGN`
- **Category:** SPEC_ALIGNMENT
- **Status:** NOT_STARTED — 사용자 결정 대기, 착수 금지
- **기록일:** 2026-09-19 (W22 리팩터링 준비 중 발견)

## 문제

- `docs/PROJECT_SCOPE.md` / `TASKS/00_TASK_LIST.md`의 `TEST-RLS-BASIC` AC: "본인/타인/Moderator/Admin 각 역할" 검증을 요구 — **member/moderator/admin 3-role 전제**.
- `supabase/schema.sql`의 실제 제약: `role text not null default 'member' check (role in ('member', 'admin'))` — **member/admin 2-role만 허용**, `'moderator'` INSERT 자체가 거부됨.
- `docs/ARCHITECTURE.md:155`: "세분화된 권한 등급(Moderator 이상 다단계 등)은 만들지 않는다 — RLS는 '본인/작성자/Admin' 3단계로 단순화한다." → **ARCHITECTURE.md는 2-role(스키마)이 정본이라고 이미 명시**.

## 잠정 결론(확인, 미반영)

- 정본은 **ARCHITECTURE.md/스키마(2-role)** 쪽으로 보입니다. `TEST-RLS-BASIC`의 AC 문구("Moderator")가 낡은 표현일 가능성이 높습니다.
- 단, 이 문서 판단만으로 `00_TASK_LIST.md`/`docs/PROJECT_SCOPE.md`의 AC 문구를 임의로 고치지 않습니다(사용자 승인 필요).

## 처리 방향(결정 필요, 택1)

1. **AC 쪽 수정(권장 추정)**: `TASKS/00_TASK_LIST.md` §3.8 `TEST-RLS-BASIC` 행과 `docs/06_SRS_UIUX_REVISED.md`/`docs/PROJECT_SCOPE.md`에서 "Moderator" 문구를 제거하고 "본인/타인/Admin"으로 정정.
2. **스키마 쪽 수정**: `member_profiles.role` CHECK 제약에 `'moderator'` 추가 + RLS 정책 재설계(파급 범위 큼, `DB-SCHEMA-BASE`/`DB-RLS-BASE` 재오픈 필요).

## 후속 조치

- 결정 전까지 `TEST-RLS-BASIC`의 Moderator 관련 검증은 **보류**(현재 `tests/rls/basic.test.ts`에도 미구현 상태 그대로 둠).
- 결정 시 이 파일을 갱신하고 실제 착수한다.
