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

## 검토 필요

1. Lighthouse 리포트(Accessibility → Contrast 항목)에서 실패한 정확한 요소·색상
   조합을 특정한다.
2. `design-reference/D-001/DESIGN.md`의 색상 토큰 중 어느 조합이 WCAG AA
   기준(일반 텍스트 4.5:1, 큰 텍스트 3:1)에 미달하는지 확인한다.
3. 홈 외 다른 4개 Route(`/about`, `/mates`, `/travel-tools`, `/account`)도 같은
   토큰 조합을 쓰는 곳이 있는지 확인한다(점수는 다르지만 Contrast가 아닌 다른
   항목일 수 있음 — Route별 Lighthouse Accessibility 세부 실패 항목을 각각
   재확인해야 한다).
4. `GLOBAL-A11Y`(완료 처리됨)의 AC가 왜 이 항목을 놓쳤는지는
   `TASKS/TASK-GLOBAL-A11Y.md`의 "완료 후 재검토(2026-09-19)" 절 참조.

## 참고

- `REQ-NF-023`(WCAG 2.2 Level AA)의 색 대비 기준(1.4.3)에 해당하는 항목이며,
  `TASKS/TASK-FIX-A11Y-DIALOG-TABS.md`(포커스 트랩/Esc/탭 화살표 이동)와는 결함
  종류가 다르므로(마크업/상호작용이 아니라 시각 토큰 값) 별도 Task로 유지한다.
