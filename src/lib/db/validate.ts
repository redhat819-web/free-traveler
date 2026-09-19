/**
 * Server Action 입력 검증 헬퍼.
 * 저장 XSS를 막기 위해 렌더링 시 위험한 마크업으로 해석될 수 있는 문자를 제거하고 길이를 제한한다.
 * React는 텍스트를 기본적으로 이스케이프하지만, 저장 단계에서도 과도하게 긴 입력과 제어 문자를 걸러낸다.
 */

export class ValidationError extends Error {}

export function requireTrimmed(
  value: FormDataEntryValue | null,
  field: string,
  maxLength: number,
): string {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text) {
    throw new ValidationError(`${field}은(는) 필수입니다.`);
  }
  if (text.length > maxLength) {
    throw new ValidationError(
      `${field}은(는) ${maxLength}자를 넘을 수 없습니다.`,
    );
  }
  return sanitizeText(text);
}

export function optionalTrimmed(
  value: FormDataEntryValue | null,
  maxLength: number,
): string | null {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text) return null;
  if (text.length > maxLength) {
    throw new ValidationError(`입력값이 ${maxLength}자를 넘을 수 없습니다.`);
  }
  return sanitizeText(text);
}

function sanitizeText(text: string): string {
  return text.replace(/[<>]/g, "");
}

export function requireHttpsUrl(
  value: FormDataEntryValue | null,
  field: string,
): string {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text.startsWith("https://")) {
    throw new ValidationError(`${field}은(는) https:// URL이어야 합니다.`);
  }
  return text;
}
