package com.MoReport.domain.weight.service;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.MoReport.domain.user.domain.User;
import com.MoReport.domain.weight.domain.Weight;
import com.MoReport.domain.weight.dto.WeightSetDto;

public interface WeightService {
	/**
	 * User, date, 가중치, 예상매출을 받고 DB에 저장합니다.
	 * @author ehtjsv2
	 * @param user - User
	 * @param date - LocalDate : 저장할 날짜입니다.
	 * @param nextWeight - BigDecimal : 예상 매출 계산을 위한 요일 가중치입니다.
	 * @param predictRevenue - Long : 다음날 예상 매출 입니다.
	 */
	Weight saveWeight(User user, LocalDate date, BigDecimal nextWeight, Long predictRevenue);
	/**
	 * 원하는 날짜의 Weight 레코드를 불러옵니다.
	 * @author ehtjsv2
	 * @param user - User
	 * @param date - LocalDate : 조회하고 싶은 날짜 "yyyy-MM-dd"
	 * @throws 404 - 유저가 없는 경우, 해당 날짜에 데이터가 없는 경우
	 */
	Weight findByUserAndDate(User user,LocalDate date);
	
	/**
	 * 다음 날 예상 매출을 불러옵니다. 예상 매출이 없다면 setWight()로 해당 날짜의 예상 매출을 계산하고 DB에 저장합니다. ( 해당 날짜에는 다음날 예상매출이 저장되어있습니다.)
	 * @author ehtjsv2
	 * @param user - User
	 * @param date - LocalDate : 조회하고 싶은 날짜 (ex. 5월 5일 예상매출을 보고싶다면 5월 4일을 조회할 것)
	 * @throws 404 - 해당 날짜에 데이터가 없는 경우
	 */
	Long getPredictRevenueByUserAndDate(User user, LocalDate date);
	/**
	 * 다음 날 예상 매출을 위한 요일 가중치를 불러옵니다. 가중치가 없다면 setWight()로 해당 날짜의 가중치를 계산하고 DB에 저장합니다.
	 * @author ehtjsv2
	 * @param user - User
	 * @param date - LocalDate : 가중치를 얻고 싶은 날짜 (ex. 5월 6일 매출 예상을 위한 가중치는 5월5일에 있다.)
	 */
	BigDecimal getNextWeightByUserAndDate(User user, LocalDate date);
}
