package com.MoReport.domain.dateSales.service;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.MoReport.domain.dateSales.dto.DateSalesDto;
import com.MoReport.domain.user.domain.User;

public interface DateSalesService {
	/**
	 * 
	 * 일일 매출과 어제 매출차이를 반환합니다.
	 * @author ehtjsv2
	 * @param loginId - String : 유저의 로그인 ID(사업자 번호) 입니다
	 * @param date - LocalDate : 매출 조회 날짜 입니다. "yyyy-MM-dd"
	 * @throws 404 - 유저가 없는 경우, 해당날짜 매출 데이터 없을 경우
	 * 
	 */
	public DateSalesDto getDailyRevenueDifference(String loginId, LocalDate date);

	/**
	 * 
	 * 주간 매출과 이전 주 매출차이를 반환합니다.
	 * @author ehtjsv2
	 * @param loginId - String : 유저의 로그인 ID(사업자 번호) 입니다
	 * @param dateString - String : 매출 조회 할 주차 "yyyy년 M월 W주차"
	 * @throws 404 - 유저가 없는 경우, 주간 데이터가 0개일 경우
	 * @throws 400 - dateString 포맷이 기대와 다를 경우
	 * 
	 */
	public DateSalesDto getWeeklyRevenueDifference(String loginId, String dateString);

	/**
	 * 
	 * 월 매출과 이전 월과 매출차이를 반환합니다.
	 * @author ehtjsv2
	 * @param loginId - String : 유저의 로그인 ID(사업자 번호) 입니다
	 * @param dateString - String : 매출 조회 할 월 "yyyy년 M월"
	 * @throws 404 - 유저가 없는 경우, 월간 데이터가 0개일 경우
	 * @throws 400 - dateString 포맷이 기대와 다를 경우
	 */
	public DateSalesDto getMonthlyRevenueDifference(String loginId, String dateString);

	/**
	 * 6개월전부터 오늘까지 해당 요일의 평균 매출을 반환 (ex. 6개월전부터 오늘까지 수요일매출 총합/수요일매출개수)
	 * @author ehtjsv2
	 * @param user-User 
	 * @param sixMonthsAgo - LocalDate : 6개월이전 날짜
	 * @param today - LocalDate : 오늘 날짜
	 * @param dayOfWeek - int :  요일 일요일-1, 월요일-2, 화요일-3...
	 * @throws 404 - 평균이 0인 경우, 조회된 데이터가 없을 경우 
	 */
	public BigDecimal findAverageDayOfWeekRevenueForLastSixMonths(User user, LocalDate sixMonthsAgo, LocalDate today,
			int dayOfWeek);

	/**
	 * 6개월전부터 오늘까지 매출 평균을 반환합니다. 0원인 날도 포함하므로 주의
	 * @author ehtjsv2
	 * @param user-User 
	 * @param sixMonthsAgo - LocalDate : 6개월이전 날짜
	 * @param today - LocalDate : 오늘 날짜
	 * @throws 404 - 평균이 0인 경우, 조회된 데이터가 없을 경우 
	 */
	BigDecimal findAverageRevenueForLastSixMonths(User user, LocalDate sixMonthsAgo, LocalDate today);
}
