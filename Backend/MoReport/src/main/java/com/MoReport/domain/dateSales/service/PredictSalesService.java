package com.MoReport.domain.dateSales.service;

import com.MoReport.domain.dateSales.dto.AISalesPredictDto;
import com.MoReport.domain.user.domain.User;
import java.time.LocalDate;

import com.MoReport.domain.dateSales.dto.PredictSalesDto;
import java.util.List;

public interface PredictSalesService {

	/**
	 * 예상매출을 반환합니다. date기준 다음날의 예상매출을반환, 어제 예상한 오늘 매출 또한 반환합니다.
	 * @author ehtjsv2
	 * @param loginId - String : 유저의 로그인 ID(사업자 번호) 입니다
	 * @param date - LocalDate : 매출 조회 날짜 입니다. "yyyy-MM-dd"
	 * @throws 404 - 유저가 없는 경우, 오늘 또는 어제 매출 데이터가 없는 경우, 가중치 계산을 위한 해당 요일의 매출 평균이 0일 경우
	 */
	public PredictSalesDto getDailyPredict(String loginId, LocalDate date);

	/**
	 * 예상매출을 반환합니다. dateString 기준 다음 주의 예상매출을 반환, 지난주에 예상한 이번주의 매출 또한 반환합니다.
	 * @author ehtjsv2
	 * @param loginId - String : 유저의 로그인 ID(사업자 번호) 입니다
	 * @param dateString - String : 매출 조회 할 주차 "yyyy년 M월 W주차"
	 * @throws 404 - 유저가 없는 경우, 이번 주 또는 저번 주 매출 데이터가 없는 경우, 가중치 계산을 위한 해당 요일의 매출 평균이 0일 경우
	 */
	public PredictSalesDto getWeeklyPredict(String loginId, String dateString);

	/**
	 * 예상매출을 반환합니다. dateString 기준 다음 달의 예상매출을 반환, 지난 달에 예상한 이번 달의 매출 또한 반환합니다.
	 * @author ehtjsv2
	 * @param loginId - String : 유저의 로그인 ID(사업자 번호) 입니다
	 * @param dateString - String : 매출 조회 할 주차 "yyyy년 M월 W주차"
	 * @throws 404 - 유저가 없는 경우, 이번 달 또는 저번 달 매출 데이터가 없는 경우, 가중치 계산을 위한 해당 요일의 매출 평균이 0일 경우
	 */
	public PredictSalesDto getMonthlyPredict(String loginId, String dateString);

    public void updateDailyPredictionAllUsers(List<User> usersWhoPermitted, AISalesPredictDto response);

	public void updateWeeklyPredictionAllUsers(List<User> usersWhoPermitted, AISalesPredictDto response);

    void updateMonthlyPredictionAllUsers(List<User> usersWhoPermitted, AISalesPredictDto response);
}
