/**
 * 항공/숙소 조건 Form의 날짜 검증 규칙(REQ-FUNC-013, 021)을 순수 함수로 분리한 모듈.
 * FlightForm.tsx/HotelForm.tsx의 인라인 validate()와 동일한 규칙을 따른다.
 */

export interface FlightDateInput {
  departureDate: string;
  returnDate: string;
}

export interface FlightDateErrors {
  departureDate?: string;
  returnDate?: string;
}

export function validateFlightDates(
  { departureDate, returnDate }: FlightDateInput,
  todayIso: string,
): FlightDateErrors {
  const errors: FlightDateErrors = {};

  if (!departureDate) errors.departureDate = "출발일을 입력하세요.";
  if (!returnDate) errors.returnDate = "귀국일을 입력하세요.";

  if (departureDate && departureDate < todayIso) {
    errors.departureDate = "출발일은 오늘 이후여야 합니다.";
  }
  if (departureDate && returnDate && returnDate < departureDate) {
    errors.returnDate = "귀국일은 출발일 이후여야 합니다.";
  }
  return errors;
}

export interface HotelDateInput {
  checkIn: string;
  checkOut: string;
}

export interface HotelDateErrors {
  checkIn?: string;
  checkOut?: string;
}

export function validateHotelDates(
  { checkIn, checkOut }: HotelDateInput,
  todayIso: string,
): HotelDateErrors {
  const errors: HotelDateErrors = {};

  if (!checkIn) errors.checkIn = "체크인 날짜를 입력하세요.";
  if (!checkOut) errors.checkOut = "체크아웃 날짜를 입력하세요.";

  if (checkIn && checkIn < todayIso) {
    errors.checkIn = "체크인 날짜는 오늘 이후여야 합니다.";
  }
  if (checkIn && checkOut && checkOut <= checkIn) {
    errors.checkOut = "체크아웃 날짜는 체크인 이후여야 합니다.";
  }
  return errors;
}
