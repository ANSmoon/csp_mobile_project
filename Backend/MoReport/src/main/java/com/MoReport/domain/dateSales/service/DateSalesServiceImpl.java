package com.MoReport.domain.dateSales.service;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;

import org.springframework.stereotype.Service;

import com.MoReport.domain.dateSales.dao.DateSalesRepository;
import com.MoReport.domain.dateSales.domain.DateSales;
import com.MoReport.domain.dateSales.dto.DateSalesDto;
import com.MoReport.domain.user.domain.User;
import com.MoReport.domain.user.service.UserServiceImpl;
import com.MoReport.global.common.DateMethod;
import com.MoReport.global.error.DataNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class DateSalesServiceImpl implements DateSalesService {

	private final UserServiceImpl userServiceImpl;

	private final DateSalesRepository dateSalesRepository;

	@Override
	public DateSalesDto getDailyRevenueDifference(String loginId, LocalDate date) {
		log.info("[getDailyRevenue] : loginId = " + loginId);
		log.info("[getDailyRevenue] : date = " + date.toString());
		User user = userServiceImpl.getUserByLoginId(loginId);
		int todayRevenue = getDayRevenue(user, date);
		int yesterdayRevenue = getDayRevenue(user, date.minusDays(1));
		return DateSalesDto.builder().thisSales(todayRevenue).previousSales(yesterdayRevenue)
				.diffSales(todayRevenue - yesterdayRevenue).build();
	}

	
	@Override
	public DateSalesDto getWeeklyRevenueDifference(String loginId, String dateString) {
		int thisWeekRevenue = 0;
		int previousWeekRevenue = 0;
		User user = userServiceImpl.getUserByLoginId(loginId);
		// dateString을 Matcher로 변환 그룹1->년, 그룹2->월, 그룹3->주차
		Matcher matcher = DateMethod.getDateStringToMatcherForWeekly(dateString);
		// 이번 주의 첫째 날, matcher를 인자로
		LocalDate firstDateOfWeek = DateMethod.getFirstDateOfWeek(matcher);
		// 이번 주의 매출 리스트
		List<DateSales> thisWeekSalesList = getWeekSalesList(user, firstDateOfWeek);
		if (thisWeekSalesList.size() == 0)
			throw new DataNotFoundException("No Week Sales");
		// 지난 주의 첫째 날. 주차를 인자로
		LocalDate previousFirstDateOfWeek = DateMethod.getFristDateOfPreviousWeek(firstDateOfWeek,
				Integer.parseInt(matcher.group(3)));
		// 지난 주의 매출리스트
		List<DateSales> previousWeekSalesList = getWeekSalesList(user, previousFirstDateOfWeek);
		for (int i = 0; i < thisWeekSalesList.size(); i++)
			thisWeekRevenue += thisWeekSalesList.get(i).getTotalRevenue();
		for (int i = 0; i < previousWeekSalesList.size(); i++)
			previousWeekRevenue += previousWeekSalesList.get(i).getTotalRevenue();

		return DateSalesDto.builder().thisSales(thisWeekRevenue).previousSales(previousWeekRevenue)
				.diffSales(thisWeekRevenue - previousWeekRevenue).build();
	}
	
	@Override
	public DateSalesDto getMonthlyRevenueDifference(String loginId, String dateString) {
		Integer thisMonthRevenue = 0;
		Integer preMonthRevenue = 0;
		User user = userServiceImpl.getUserByLoginId(loginId);
		// 이번 달의 첫날
		LocalDate firstDayOfThisMonth = DateMethod.dateStringToLocalDateForMonthly(dateString);
		// 이번 달의 마지막 날
		LocalDate lastDayOfThisMonth = DateMethod.getLastDayOfMonth(firstDayOfThisMonth);
		// 저번 달의 첫날
		LocalDate firstDayOfPreMonth = firstDayOfThisMonth.minusMonths(1);
		// 저번 달의 마지막 날
		LocalDate lastDayOfPreMonth = DateMethod.getLastDayOfMonth(firstDayOfPreMonth);
			Optional<Integer> optionalThisTotalRevenue = dateSalesRepository.sumTotalRevenueByUserAndDateBetween(user, firstDayOfThisMonth,
					lastDayOfThisMonth);
			Optional<Integer> optionalPreTotalRevenue = dateSalesRepository.sumTotalRevenueByUserAndDateBetween(user, firstDayOfPreMonth,
					lastDayOfPreMonth);
			if(optionalThisTotalRevenue.isPresent()) thisMonthRevenue=optionalThisTotalRevenue.get();
			else throw new DataNotFoundException("data not found");
			if(optionalPreTotalRevenue.isPresent()) preMonthRevenue=optionalPreTotalRevenue.get();
			else preMonthRevenue=0;

		return DateSalesDto.builder()
				.thisSales(thisMonthRevenue)
				.previousSales(preMonthRevenue)
				.diffSales(thisMonthRevenue - preMonthRevenue)
				.build();
	}

	
	// 최근 6개월 간 해당 요일의 평균 매출을 반환, 인자 : user, 6개원전 날짜, 요일( 1부터 일요일 2 월요일)
	@Override
	public BigDecimal findAverageDayOfWeekRevenueForLastSixMonths(User user, LocalDate sixMonthsAgo, LocalDate today, int dayOfWeek) {
		BigDecimal avgDayofWeekRevenue = dateSalesRepository.findAverageDayOfWeekRevenueForLastSixMonths(user, sixMonthsAgo, today,dayOfWeek);
		if(avgDayofWeekRevenue==null || avgDayofWeekRevenue.compareTo(BigDecimal.ZERO) == 0)throw new DataNotFoundException("no data");
		
		return avgDayofWeekRevenue;
	}
	// 최근 6개월 간평균 매출을 반환, 인자 : user, 6개월전 날짜
	@Override
	public BigDecimal findAverageRevenueForLastSixMonths(User user, LocalDate sixMonthsAgo, LocalDate today) {
		BigDecimal avgRevenueSixMonths =dateSalesRepository.findAverageRevenueForLastSixMonths(user, sixMonthsAgo,today);
		if(avgRevenueSixMonths == null || avgRevenueSixMonths.compareTo(BigDecimal.ZERO) == 0) throw new DataNotFoundException("no data");
		return avgRevenueSixMonths;
	}
	
	/**
	 * 해당 주의 일요일 부터 토요일까지 7일동안의 매출을 List로 반환한다
	 * @param user - User : 유저객체
	 * @param startDate - LocalDate : 해당 주의 첫째날(일요일)
	 * 
	 */
	public List<DateSales> getWeekSalesList(User user, LocalDate startDate) {
		// startDate 해당 월의 마지막날짜
		LocalDate lastDayOfMonth = startDate.withDayOfMonth(startDate.lengthOfMonth());
		// 이번 주의 마지막 날짜
		LocalDate endDate;
		// 현재날짜에서 +6한 날이 마지막날짜를 넘는다면
//		if (startDate.getDayOfMonth() + 6 > lastDayOfMonth.getDayOfMonth())
//			endDate = lastDayOfMonth;
//		else
		endDate = startDate.plusDays(1).with(DayOfWeek.SATURDAY);
		Optional<List<DateSales>> optionalSalesList = dateSalesRepository.findByUserAndDateBetween(user, startDate,
				endDate);
		return optionalSalesList.get();

	}
	/**
	 * 해당 날짜의 총 매출을 반환합니다.
	 * @param user - User
	 * @param date - LocalDate : 조회할 날짜
	 * @throws 404 매출 데이터가 없을 경우
	 */
	public int getDayRevenue(User user, LocalDate date) {
		Optional<DateSales> todaySales = this.dateSalesRepository.findByUserAndDate(user, date);
		if (todaySales.isPresent()) {
			return todaySales.get().getTotalRevenue();
		} else {
			throw new DataNotFoundException("No Day Sales");
		}
	}


}
