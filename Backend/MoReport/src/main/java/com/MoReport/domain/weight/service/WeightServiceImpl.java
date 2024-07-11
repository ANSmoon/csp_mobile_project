package com.MoReport.domain.weight.service;


import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.MoReport.domain.dateSales.service.DateSalesServiceImpl;
import com.MoReport.domain.user.domain.User;
import com.MoReport.domain.weight.dao.WeightRepository;
import com.MoReport.domain.weight.domain.Weight;
import com.MoReport.global.error.DataNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class WeightServiceImpl implements WeightService{

	private final WeightRepository weightRepository;
	private final DateSalesServiceImpl dateSalesServiceImpl;
	
	@Override
	public Weight saveWeight(User user, LocalDate date, BigDecimal nextWeight, Long predictRevenue) {
		Weight weight = new Weight();
		weight.setUser(user);
		weight.setDate(date);
		weight.setNextWeight(nextWeight);
		weight.setPredictRevenue(predictRevenue);
		weightRepository.save(weight);
		return weight;
	}
	
	@Override
	public Weight findByUserAndDate(User user, LocalDate date) {
		Optional<Weight> opWeight = weightRepository.findByUserAndDate(user, date);
		if(!opWeight.isPresent())throw new DataNotFoundException("no data");
		else return opWeight.get();
	}

	/*
	 * 예상 매출을 반환합니다
	 * if 해당 날짜에 데이터가없다 -> weight를 구하여 setWeight()하고 예상매출을 반환합니다.
	 */
	@Override
	public Long getPredictRevenueByUserAndDate(User user, LocalDate date) {
		Weight weight;
		// 해당 날짜의 예측 데이터가 없는가?
		if(!isWeightAtDate(user, date)) {
			weight = setWeight(user, date);
			
			return weight.getPredictRevenue();
		}
		else return findByUserAndDate(user, date).getPredictRevenue();
		
	}
	
	@Override
	public BigDecimal getNextWeightByUserAndDate(User user, LocalDate date) {
		Weight weight;
		// 해당 날짜의 예측 데이터가 없는가?
		if(!isWeightAtDate(user, date)) {
			weight = setWeight(user, date);
			
			return weight.getNextWeight();
		}
		else return findByUserAndDate(user, date).getNextWeight();
		
	}
	
	/** 
	 * date를 받고 해당 날짜의 Weight 객체를 반환
	 * @param user - User 
	 * @param date - Weight 객체를 얻고 싶은 날짜 (단, 다음 날 매출 예상을 위한 가중치는 이전 날이 가지고 있습니다.)
	 * @throws 최근 6개월간 평균매출이 0일 경우
	 */
	public Weight setWeight(User user,LocalDate date) {
		BigDecimal weightDecimal;
		// 다음 날의 요일 알아내기 일->1 월->2 ...
		int dayOfWeek = date.plusDays(1).getDayOfWeek().getValue()%7+1;
		// 6개월 전 날짜
		LocalDate sixMonthAgoDate = date.minusMonths(6);
		// 다음 날 기준 요일 평균 매출
		BigDecimal avgDayOfWeek = dateSalesServiceImpl.findAverageDayOfWeekRevenueForLastSixMonths(user, sixMonthAgoDate, date,dayOfWeek);
		// 최근 6개월 평균 매출
		BigDecimal avgSixMonthRevenue = dateSalesServiceImpl.findAverageRevenueForLastSixMonths(user, sixMonthAgoDate,date);
		if(avgDayOfWeek.equals(BigDecimal.valueOf(0)))throw new DataNotFoundException("no week data");
		// 차이(가중치)
		weightDecimal = ((avgDayOfWeek.subtract(avgSixMonthRevenue)).divide(avgSixMonthRevenue,4,RoundingMode.HALF_UP)).multiply(BigDecimal.valueOf(100));
		// 예상 매출
		Long predictRevenue = avgSixMonthRevenue.longValue() + (avgSixMonthRevenue.multiply(weightDecimal).longValue()/100L);
		// DB에 저장
		return saveWeight(user, date, weightDecimal, predictRevenue);
		
	}

	/** 
	 * 해당 날에 Weight 레코드가 있는가?
	 * @author ehtjsv2
	 * @param user - User
	 * @param date - 조회 날짜입니다. "yyyy-MM-dd"
	 */
	public boolean isWeightAtDate(User user, LocalDate date) {
		Optional<Weight> opWeight = weightRepository.findByUserAndDate(user, date);
		if(opWeight.isPresent())return true;
		return false;
	}

	

	
}
