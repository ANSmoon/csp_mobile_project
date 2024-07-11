package com.MoReport.global.common;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.StringTokenizer;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.MoReport.domain.dateSales.exception.ParameterValueException;

public class DateMethod {

	/*
	 * dateString을 LocalDate로 바꾸면서, 해당주차의 첫째 날(일요일)을 반환
	 */
	public static LocalDate getFirstDateOfWeek(Matcher matcher) {
		int year = 0;
		int month = 0;
		// 주차
		int weekOfMonth = 0;
		// matcher에서 year, month, weekOfMonth얻기
		if (matcher.find()) {
			year = Integer.parseInt(matcher.group(1));
			month = Integer.parseInt(matcher.group(2));
			weekOfMonth = Integer.parseInt(matcher.group(3));
		} else {
			// 사용자가 형식에 맞지않는 input을 넣음
			throw new ParameterValueException("Invalid Parameter value");

		}
		// 해당 월의 첫 날짜를 가져옴
		LocalDate firstDayOfMonth = LocalDate.of(year, month, 1);

		// 첫 날의 요일을 가져옴
		DayOfWeek firstDayOfWeek = firstDayOfMonth.getDayOfWeek();

		// 주어진 주차와 요일에 따른 일요일의 날짜를 계산
		LocalDate firstDateOfWeek;
		//지난 달의 마지막주와 이번달의 첫째주 구분 했을 경우 
//		if (weekOfMonth == 1) {
//			firstDateOfWeek = firstDayOfMonth;
//		} 
//		else if(firstDayOfWeek.equals(DayOfWeek.SUNDAY) ) {
//			firstDateOfWeek = firstDayOfMonth.plusWeeks(weekOfMonth - 1);
//		}
//		else {
//			firstDateOfWeek = firstDayOfMonth.plusWeeks(weekOfMonth - 1).with(DayOfWeek.MONDAY).minusDays(1);
//		}
		//지난 달의 미지막주와 이번달의 첫째주 구분 x, 같은주로 판별
		if(firstDayOfWeek.equals(DayOfWeek.SUNDAY) ) {
			firstDateOfWeek = firstDayOfMonth.plusWeeks(weekOfMonth - 1);
		}
		else firstDateOfWeek = firstDayOfMonth.plusWeeks(weekOfMonth - 1).with(DayOfWeek.MONDAY).minusDays(1);
		return firstDateOfWeek;
	}
	
	public static Matcher getDateStringToMatcherForWeekly(String dateString) {
		// 정규표현식으로 프론트엔드로 부터 오는 date String 패턴 저장
		Pattern pattern = Pattern.compile("(\\d+)년 (\\d+)월 (\\d+)주차");
		// 패턴에 맞게 그룹으로 저장 그룹1->년, 그룹2->월, 그룹3->주차
		Matcher matcher = pattern.matcher(dateString);
		return matcher;
	}

	public static Matcher getDateStringToMatcherForMonthly(String dateString) {
		// 정규표현식으로 프론트엔드로 부터 오는 date String 패턴 저장
		Pattern pattern = Pattern.compile("(\\d+)년 (\\d+)월 ");
		// 패턴에 맞게 그룹으로 저장 그룹1->년, 그룹2->월
		Matcher matcher = pattern.matcher(dateString);
		return matcher;
	}
	/*
	 * 주의 첫째날을 받고 해당 주의 마지막 날짜를 반환합니다.
	 */
	public static LocalDate getLastDateOfWeek(LocalDate startDate) {
		// startDate 해당 월의 마지막날짜
		LocalDate lastDayOfMonth = startDate.withDayOfMonth(startDate.lengthOfMonth());
		// 이번 주의 마지막 날짜
		LocalDate endDate;
		// 현재날짜에서 +6한 날이 마지막날짜를 넘는다면
		// 지난 달의 마지막주와 이번달의 첫째주 구분 했을 경우
//		if (startDate.getDayOfMonth() + 6 > lastDayOfMonth.getDayOfMonth())
//			endDate = lastDayOfMonth;
//		else
//			endDate = startDate.plusDays(1).with(DayOfWeek.SATURDAY);
		// 지난 달의 마지막주와 이번달의 첫째주 구분 x, 같은주로 판별
		endDate=startDate.plusDays(6);
		return endDate;
	}
	/*
	 * String을 박으면 해당 월의 첫째 날을 반환합니다.
	 */
	public static LocalDate dateStringToLocalDateForMonthly(String dateString) {
		StringTokenizer tokenizer = new StringTokenizer(dateString, "년 월");
		int year=Integer.parseInt(tokenizer.nextToken());
		int month=Integer.parseInt(tokenizer.nextToken());
		// 이번 달의 첫날
		LocalDate firstDayOfThisMonth = LocalDate.of(year,month, 1);
		return firstDayOfThisMonth;
	}

	/*
	 * LocalDate를 받고, 해당 월의 마지막 날짜를 반환
	 */
	public static LocalDate getLastDayOfMonth(LocalDate date) {
		int year = date.getYear();
		int month = date.getMonth().getValue();
		YearMonth yearMonth = YearMonth.of(year, month);
		return yearMonth.atEndOfMonth();
	}

	/*
	 * 이번 주의 첫째날을 인자로 받습니다. 지난 주의 첫째날을 반환합니다. 지난 주가 이전 월로 넘어가야하는 경우 또한 고려합니다.
	 */
	public static LocalDate getFristDateOfPreviousWeek(LocalDate date, int weekOfMonth) {
		// date가 첫째주인경우
		// 지난달의 마지막주와 이번달의 첫째주 구분 할 경우의 코드
//		if (weekOfMonth == 1) {
//			if (date.getDayOfWeek() == DayOfWeek.SUNDAY)
//				return date.minusDays(7);
//			else
//				return date.with(DayOfWeek.MONDAY).minusDays(1);
//		} else {// date가 첫째주가 아닐경우
//			return (date.getDayOfMonth() - 7 > 0) ? date.minusDays(7) : date.withDayOfMonth(1);
//		}
		// 지난 달의 마지막주와 이번달의 첫째주 구분 x 같은주로 판별
		return date.minusDays(7);
	}
}
