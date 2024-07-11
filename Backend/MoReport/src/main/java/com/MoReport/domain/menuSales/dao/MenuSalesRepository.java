package com.MoReport.domain.menuSales.dao;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.MoReport.domain.menuSales.domain.MenuSales;
import com.MoReport.domain.user.domain.User;

public interface MenuSalesRepository extends JpaRepository<MenuSales,Integer>{
	List<MenuSales> findAllByUserAndDate(User user,LocalDate date, Sort sort);
	
	@Query("SELECT m.menu.menuName, m.menu.price, SUM(m.count) as total_count, m.menu FROM MenuSales m LEFT JOIN FETCH m.menu.image WHERE m.user= :user AND m.date BETWEEN :startDate AND :endDate GROUP BY m.menu.menuName ORDER BY total_count DESC")
	List<Object[]> findByUserAndDateBetween(@Param("user")User user, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

	@Query("SELECT m.menu.menuName, m.menu.price, SUM(CASE WHEN m.date BETWEEN :lastMonthStart AND :lastMonthEnd THEN m.count ELSE 0 END) as last_month_count, SUM(CASE WHEN m.date BETWEEN :thisMonthStart AND :thisMonthEnd THEN m.count ELSE 0 END) as this_month_count FROM MenuSales m LEFT JOIN m.menu WHERE m.user = :user GROUP BY m.menu.menuName HAVING SUM(CASE WHEN m.date BETWEEN :lastMonthStart AND :lastMonthEnd THEN m.count ELSE 0 END) > 0 AND SUM(CASE WHEN m.date BETWEEN :thisMonthStart AND :thisMonthEnd THEN m.count ELSE 0 END) > 0")
	List<Object[]> findByUserAndDateBetween(@Param("user") User user, @Param("lastMonthStart") LocalDate lastMonthStart, @Param("lastMonthEnd") LocalDate lastMonthEnd, @Param("thisMonthStart") LocalDate thisMonthStart, @Param("thisMonthEnd") LocalDate thisMonthEnd);

}