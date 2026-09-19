# A11Y-FOCUS-TRAP-CYCLE — Drawer 포커스 트랩 순환 실패 (기록용, 미착수)

- **Task ID:** `A11Y-FOCUS-TRAP-CYCLE`
- **Category:** FIX (GLOBAL-A11Y / FIX-A11Y-DIALOG-TABS 재작업)
- **Status:** NOT_STARTED — 착수 금지, 기록만
- **기록일:** 2026-09-19 (`MANUAL-CHECK-A11Y` 3차 재점검에서도 미해결로 확인되어 이월)

## 문제

홈(`/`) 여행지 상세 Drawer에서 Tab을 계속 누르면, 내부 focusable 요소를 한 바퀴
돈 뒤 Drawer 밖으로 포커스가 이탈한다(15회까지는 안 나가고 그 이상에서 이탈 —
내부 요소 수만큼은 정상 순회하지만 마지막에서 첫 요소로 감기지 않음).

Esc 닫기, 닫은 뒤 포커스 복귀(열었던 카드로 복귀)는 정상 동작한다. 트랩(순환)
로직만 실패한다.

## 지금까지의 시도 (3차, 전부 미해결)

1. **1차**: `handleKeyDown`이 첫/마지막 요소에서만 개입(`document.activeElement === first/last`
   비교 후 `preventDefault()` + `.focus()`), 중간 이동은 브라우저 기본 Tab 흐름 +
   `#app-shell`의 `inert`에 의존. → 사용자 실제 브라우저에서 이탈 재현. Chromium
   자동화(Playwright, dev/prod 빌드 모두)로는 재현 안 됨.
2. **2차**: Dialog를 `#app-shell` 밖 `document.body`로 `createPortal`. (이 자체는
   별도의 진짜 버그였음 — `inert`가 걸린 `#app-shell`의 자손으로 Dialog가 렌더링되고
   있어 Dialog 자신도 접근성 트리에서 사라지는 문제를 고쳤다. 하지만 트랩 순환
   실패는 해결되지 않음.)
3. **3차**: `handleKeyDown`을 매 Tab/Shift+Tab마다 무조건 `preventDefault()` 후
   focusable 배열 인덱스로 직접 다음/이전 포커스를 계산해 이동하도록 재작성(네이티브
   Tab 흐름·`inert`에 더 이상 의존하지 않음). → Chromium 자동화(focusable 개수+5회
   forward/backward, 매 스텝 dialog 자손 여부 확인)는 통과. **사용자 실제 브라우저
   재검증에서는 여전히 이탈 재현.**

## 검토 필요 (원인 후보, 착수 시 확인)

1. **keydown 리스너 부착 위치 재확인** — 현재 `document.addEventListener("keydown", ...)`로
   되어 있음(`src/hooks/useDialogA11y.ts`). 코드상으로는 `document` 레벨이 맞지만,
   실제 재현 환경에서 이 리스너가 애초에 등록되지 않았거나(예: effect 미실행, 오래된
   번들 캐시) 다른 리스너에 의해 가로채지는지 직접 그 브라우저에서 재확인 필요.
2. **이탈 지점이 배경(푸터 등)** — `#app-shell`에 `inert`가 걸리는데 실제로 걸리고
   있는지, 걸리는 시점과 해제 시점이 트랩 로직과 경합하지 않는지 재확인.
   (3차 시도 이후로는 트랩이 `inert`에 의존하지 않도록 바꿨으므로, 그럼에도
   재현된다면 `inert` 문제가 아니라 다른 원인일 가능성이 큼 — 아래 3번 참조.)
3. **재현 환경 특정 필요** — 이번까지 사용자가 실제로 어떤 브라우저(Chrome/Edge/
   Firefox/Safari, 버전), 어떤 조건(하드 리프레시 여부, 확장 프로그램 활성화 여부,
   시크릿 창 여부)에서 재현했는지 아직 확인되지 않았다. Chromium 자동화로는 3차
   시도 모두 재현되지 않아, 착수 전에 **정확한 재현 환경을 먼저 확보**해야 같은
   시행착오를 반복하지 않는다.
4. **라이브러리 교체 검토** — 3차례 직접 구현 수정에도 해결되지 않았으므로,
   Radix UI `Dialog`/Headless UI `Dialog` 등 검증된 접근성 라이브러리로 교체하는
   방안을 검토한다. 이 프로젝트는 지금까지 외부 UI 라이브러리를 쓰지 않는 관례였으나
   (CLAUDE.md 규칙 17은 ORM/AWS만 명시 금지, UI 라이브러리 금지 조항은 없음),
   직접 구현으로 3차례 실패했다면 라이브러리 도입이 더 안전할 수 있다 — **새
   의존성 추가는 사용자 승인 필요**.
5. **트랩 로직만 격리해 재현** — Esc/포커스 복귀는 정상이므로, `useDialogA11y`에서
   트랩(Tab 처리) 부분만 최소 재현 케이스로 분리해 테스트하면 원인 좁히기가
   쉬울 수 있다.

## 참고

- 관련 코드: `src/hooks/useDialogA11y.ts` (포커스 트랩·Esc·포커스 이동/복귀·배경 inert·스크롤 잠금)
- 관련 완료 Task: `TASKS/TASK-FIX-A11Y-DIALOG-TABS.md` (Esc/포커스 복귀/탭 4곳/포털링은
  이 Task에서 완료·검증됨 — 트랩 순환만 이 Task로 이월)
- `MANUAL-CHECK-A11Y`는 이 1건을 제외한 6/7 통과로 조건부 완료 처리됨
  (`TASKS/TASK-MANUAL-CHECK-A11Y.md` 참조). W23은 이 미해결 건으로 막히지 않는다
  (사용자 명시적 결정, 2026-09-19).
