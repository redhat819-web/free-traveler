/**
 * 동행 모집글 작성 시 공개 연락처(전화번호/이메일/메신저 ID) 패턴 탐지(REQ-FUNC-032).
 * MateComposeForm.tsx의 인라인 containsContactInfo()와 동일한 규칙을 따른다.
 */

const CONTACT_PATTERNS: RegExp[] = [
  /01[0-9][-.\s]?\d{3,4}[-.\s]?\d{4}/, // 휴대폰 번호
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, // 이메일
  /(카카오\s?톡|카톡|kakao\s?talk|kakaotalk)\s?(id|아이디)?\s?[:：]?\s?[a-zA-Z0-9_.]{2,}/i, // 카카오톡 ID
  /(인스타|instagram|insta)\s?(id|아이디)?\s?[:：]?\s?@?[a-zA-Z0-9_.]{2,}/i, // 인스타그램 ID
  /(라인|line)\s?(id|아이디)?\s?[:：]?\s?[a-zA-Z0-9_.]{2,}/i, // 라인 ID
];

export function containsContactInfo(text: string): boolean {
  return CONTACT_PATTERNS.some((pattern) => pattern.test(text));
}
