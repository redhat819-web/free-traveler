import { describe, expect, it } from "vitest";
import { validateFlightDates, validateHotelDates } from "./date-validation";

const TODAY = "2026-09-19";
const YESTERDAY = "2026-09-18";
const TOMORROW = "2026-09-20";

describe("validateFlightDates", () => {
  it("필수값 누락 시 에러를 반환한다", () => {
    const errors = validateFlightDates(
      { departureDate: "", returnDate: "" },
      TODAY,
    );
    expect(errors.departureDate).toBeTruthy();
    expect(errors.returnDate).toBeTruthy();
  });

  it("과거 출발일은 에러를 반환한다", () => {
    const errors = validateFlightDates(
      { departureDate: YESTERDAY, returnDate: TOMORROW },
      TODAY,
    );
    expect(errors.departureDate).toBe("출발일은 오늘 이후여야 합니다.");
  });

  it("출발일이 당일이면 통과한다(경계값)", () => {
    const errors = validateFlightDates(
      { departureDate: TODAY, returnDate: TODAY },
      TODAY,
    );
    expect(errors.departureDate).toBeUndefined();
  });

  it("귀국일이 출발일보다 이전이면 에러(역전 날짜)를 반환한다", () => {
    const errors = validateFlightDates(
      { departureDate: TOMORROW, returnDate: TODAY },
      TODAY,
    );
    expect(errors.returnDate).toBe("귀국일은 출발일 이후여야 합니다.");
  });

  it("귀국일이 출발일과 같으면 통과한다(당일치기 허용, 경계값)", () => {
    const errors = validateFlightDates(
      { departureDate: TOMORROW, returnDate: TOMORROW },
      TODAY,
    );
    expect(errors.returnDate).toBeUndefined();
  });

  it("모든 조건을 만족하면 에러가 없다", () => {
    const errors = validateFlightDates(
      { departureDate: TOMORROW, returnDate: "2026-09-25" },
      TODAY,
    );
    expect(errors).toEqual({});
  });
});

describe("validateHotelDates", () => {
  it("필수값 누락 시 에러를 반환한다", () => {
    const errors = validateHotelDates({ checkIn: "", checkOut: "" }, TODAY);
    expect(errors.checkIn).toBeTruthy();
    expect(errors.checkOut).toBeTruthy();
  });

  it("과거 체크인 날짜는 에러를 반환한다", () => {
    const errors = validateHotelDates(
      { checkIn: YESTERDAY, checkOut: TOMORROW },
      TODAY,
    );
    expect(errors.checkIn).toBe("체크인 날짜는 오늘 이후여야 합니다.");
  });

  it("체크인이 당일이면 통과한다(경계값)", () => {
    const errors = validateHotelDates(
      { checkIn: TODAY, checkOut: TOMORROW },
      TODAY,
    );
    expect(errors.checkIn).toBeUndefined();
  });

  it("체크아웃이 체크인보다 이전이면 에러(역전 날짜)를 반환한다", () => {
    const errors = validateHotelDates(
      { checkIn: TOMORROW, checkOut: TODAY },
      TODAY,
    );
    expect(errors.checkOut).toBe("체크아웃 날짜는 체크인 이후여야 합니다.");
  });

  it("체크아웃이 체크인과 같으면 에러를 반환한다(숙박일 0박 금지, 경계값)", () => {
    const errors = validateHotelDates(
      { checkIn: TOMORROW, checkOut: TOMORROW },
      TODAY,
    );
    expect(errors.checkOut).toBe("체크아웃 날짜는 체크인 이후여야 합니다.");
  });

  it("체크아웃이 체크인 다음날이면 통과한다", () => {
    const errors = validateHotelDates(
      { checkIn: TOMORROW, checkOut: "2026-09-21" },
      TODAY,
    );
    expect(errors).toEqual({});
  });
});
