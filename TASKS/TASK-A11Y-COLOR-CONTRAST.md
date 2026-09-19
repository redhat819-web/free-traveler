# A11Y-COLOR-CONTRAST — 색 대비 부족 (기록용, 미착수)

- **Task ID:** `A11Y-COLOR-CONTRAST`
- **Category:** FIX (GLOBAL-A11Y 재작업)
- **Status:** NOT_STARTED — 착수 금지, 기록만
- **기록일:** 2026-09-19 (`MANUAL-CHECK-PERF-SEO`의 Lighthouse Accessibility 자동
  검출에서 발견 — 사람의 수동 점검(`MANUAL-CHECK-A11Y`)으로는 잡히지 않는 항목)

## 배경

`MANUAL-CHECK-PERF-SEO` 측정 중 Lighthouse Accessibility 점수가 전 페이지
95~97점으로 나왔고, 홈(`/`)에서 **Contrast**(배경/전경 색 대비 부족) 항목이
실패로 표시되었다. 어느 요소인지는 아직 특정되지 않았다.

## 조사 결과 (2026-09-19, 특정만 완료 — 수정 안 함)

프로덕션 빌드(`npm run build && npx next start`) + `npx lighthouse` (mobile,
Accessibility 카테고리만)로 홈(`/`)을 재현했다. `color-contrast` 감사가
**score 0**, 32개 노드 실패. WCAG 2.1 공식(상대 휘도) 기준으로 직접 재계산해
아래 6개 색상 조합으로 좁혔다(전부 `design-reference/D-001/DESIGN.md`의
디자인 토큰 자체가 원인 — 특정 컴포넌트의 오용이 아니다):

| 전경 / 배경 | 토큰 | 실측 대비 | 목표(일반 텍스트) | 실제 사용처(예시) |
|---|---|---:|---:|---|
| `#FFFFFF` on `#FF6B57` | 흰 텍스트 on `color.accent.coral` | **2.80** | 4.5:1 | CTA 버튼(예: 홈 "검색" 버튼) |
| `#FF6B57` on `#FFFFFF` | `color.accent.coral` on `color.bg.canvas` | **2.80** | 4.5:1 | 코랄 텍스트 링크(예: "여행 조건부터 정리하기 →") |
| `#FF6B57` on `#F7F7F5` | `color.accent.coral` on `color.bg.soft` | **2.61** | 4.5:1 | `bg-soft` Section 위의 코랄 링크/텍스트 |
| `#8A8A8A` on `#FFFFFF` | `color.text.muted` on `color.bg.canvas` | **3.45** | 4.5:1 | 캡션·메타 정보(작은 글자) |
| `#8A8A8A` on `#F7F7F5` | `color.text.muted` on `color.bg.soft` | **3.22** | 4.5:1 | 동일, `bg-soft` 위 |
| `#B8590A` on `#F8EEE6` | `color.semantic.warning` on 경고 배경 | **4.11** | 4.5:1 | 안전정보 "재확인 필요" stale 배지 |

**핵심 발견**: 실패 원인이 개별 컴포넌트가 아니라 **`color.accent.coral`(`#FF6B57`)
자체가 흰 배경/코랄 배경 어느 조합에서도 일반 텍스트 크기 기준 4.5:1을 넘지
못하는 값**이라는 것이다. 이 토큰은 CTA 버튼 배경·링크·강조 텍스트 등 전
페이지에서 반복 사용되므로, 홈만이 아니라 이 토큰을 쓰는 모든 화면에서 동일하게
실패할 것으로 예상된다(사용자가 보고한 "Lighthouse Accessibility 전 페이지
95~97점, Contrast 실패"와 일치).

`color.text.muted`(`#8A8A8A`)도 두 배경 모두에서 3.2~3.5대로, 일반 텍스트
기준(4.5:1)에는 못 미치지만 큰 텍스트(18pt 이상 또는 14pt bold, 기준 3:1)라면
통과할 수 있어 사용처별 폰트 크기 확인이 필요하다.

## 검토 필요 (수정은 별도 착수 승인 후)

1. `color.accent.coral`을 텍스트/버튼 배경으로 쓰는 모든 곳에서 WCAG AA를
   맞추려면 (a) 토큰 자체를 더 어둡게 조정하거나, (b) 코랄 배경 위 텍스트는
   흰색 대신 아주 어두운 색을 쓰거나, (c) 코랄을 텍스트 색상으로는 쓰지 않고
   배경/테두리 강조로만 한정하는 방식 중 결정이 필요하다 — 브랜드 컬러 값
   자체를 바꾸는 문제라 디자인 토큰 정본(`D-001/DESIGN.md`) 변경 승인이 선행되어야 한다.
2. `color.text.muted`는 실제 사용처의 폰트 크기(일반 vs 큰 텍스트)를 먼저
   확인해 AA 기준 위반 여부를 재확정한다.
3. `color.semantic.warning`/경고 배경 조합(4.11)은 목표에 근접해, 배경을
   살짝 밝히거나 텍스트를 살짝 어둡게 하는 정도의 미세 조정으로 해결 가능할
   것으로 보인다.
4. 홈 외 4개 Route(`/about`, `/mates`, `/travel-tools`, `/account`)는 이번
   조사에서 직접 재현하지 않았다 — 같은 토큰을 쓰므로 실패가 반복될 가능성이
   높지만, 실제 수정 착수 전에 각 Route에서 `npx lighthouse`로 재확인 필요.
5. `GLOBAL-A11Y`(완료 처리됨)의 AC가 왜 색 대비를 놓쳤는지는
   `TASKS/TASK-GLOBAL-A11Y.md`의 "완료 후 재검토(2026-09-19)" 절 참조
   (Visual AC에 색 대비 기준 자체가 없었음).

## 참고

- `REQ-NF-023`(WCAG 2.2 Level AA)의 색 대비 기준(1.4.3)에 해당하는 항목이며,
  `TASKS/TASK-FIX-A11Y-DIALOG-TABS.md`(포커스 트랩/Esc/탭 화살표 이동)와는 결함
  종류가 다르므로(마크업/상호작용이 아니라 시각 토큰 값) 별도 Task로 유지한다.
