package com.MoReport.domain.dateSales.dao;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.MoReport.domain.dateSales.domain.DateSales;
import com.MoReport.domain.user.domain.User;

public interface DateSalesRepository<T> extends JpaRepository<DateSales, Integer> {
	Optional<T> findByUserAndDate(User user, LocalDate date);

	Optional<T> findByDate(LocalDate date);

	Optional<List<T>> findByUserAndDateBetween(User user, LocalDate startDate, LocalDate endDate);

	@Query("SELECT SUM(ds.totalRevenue) FROM DateSales ds WHERE ds.user = :user AND ds.date BETWEEN :startDate AND :endDate")
	Optional<Integer> sumTotalRevenueByUserAndDateBetween(@Param("user") User user,
			@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

	// 최근 6개월 간 해당 요일의 평균 매출을 반환, 인자 : user, 6개원전 날짜, 요일( 1부터 일요일 2 월요일)
	@Query("SELECT AVG(ds.totalRevenue) FROM DateSales ds WHERE ds.user = :user AND ds.date >= :sixMonthsAgo AND ds.date<= :today AND DAYOFWEEK(ds.date) = :dayOfWeek")
	BigDecimal findAverageDayOfWeekRevenueForLastSixMonths(@Param("user") User user,
			@Param("sixMonthsAgo") LocalDate sixMonthsAgo,@Param("today") LocalDate today, @Param("dayOfWeek") int dayOfWeek);

	// 최근 6개월 간평균 매출을 반환, 인자 : user, 6개월전 날짜
	@Query("SELECT AVG(ds.totalRevenue) FROM DateSales ds WHERE ds.user = :user AND ds.date >= :sixMonthsAgo  AND ds.date<= :today")
	BigDecimal findAverageRevenueForLastSixMonths(@Param("user") User user,
			@Param("sixMonthsAgo") LocalDate sixMonthsAgo,@Param("today") LocalDate today);
}
