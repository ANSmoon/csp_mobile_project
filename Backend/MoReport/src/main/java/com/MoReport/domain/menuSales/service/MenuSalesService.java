package com.MoReport.domain.menuSales.service;

import java.time.LocalDate;

import com.MoReport.domain.menuSales.dto.MenuDiffDetailDto;
import com.MoReport.domain.menuSales.dto.MenuDiffDto;
import com.MoReport.domain.menuSales.dto.MenuSalesDto;

public interface MenuSalesService {
	/**
	 * 일간 메뉴별 매출 순위 정보 TOP3를 반환합니다.
	 * @author doyooon
	 * @param userid - String: 유저의 로그인ID (사업자번호) 입니다.
	 * @param date - LocalDate: 메뉴별 매 정보를 조회할 날짜 "yyyy-MM-dd" 입니다.
	 * @throws 404 - 유저 아이디가 없는 경우, 해당 날짜 매출 데이터가 없는 경우
	 */
	public MenuSalesDto getDailyMenuRanking(String userid, LocalDate date);
	/**
	 * 일간 메뉴별 매출 순위 정보전체를 반환합니다.
	 * @author doyooon
	 * @param userid - String: 유저의 로그인ID (사업자번호) 입니다.
	 * @param date - LocalDate: 메뉴별 매출 정보를 조회할 날짜 "yyyy-MM-dd" 입니다.
	 * @throws 404 - 유저 아이디가 없는 경우, 해당 날짜 매출 데이터가 없는 경우
	 */
	public MenuSalesDto getDailyMenuRankingDetail(String userid, LocalDate date);
	/**
	 * 주간 메뉴별 매출 순위 정보 TOP3를 반환합니다.
	 * @author doyooon
	 * @param userid - String: 유저의 로그인ID (사업자번호) 입니다.
	 * @param dateString - String: 메뉴별 매출 정보를 조회할 날짜 "2023년 5월 2주차" 입니다.
	 * @throws 404 - 유저 아이디가 없는 경우, 해당 날짜 매출 데이터가 없는 경우
	 */
	public MenuSalesDto getWeeklyMenuRanking(String userid, String dateString);
	/**
	 * 주간 메뉴별 매출 순위 정보전체를 반환합니다.
	 * @author doyooon
	 * @param userid - String: 유저의 로그인ID (사업자번호) 입니다.
	 * @param dateString - String: 메뉴별 매출 정보를 조회할 날짜 "2023년 5월 2주차" 입니다.
	 * @throws 404 - 유저 아이디가 없는 경우, 해당 날짜 매출 데이터가 없는 경우
	 */
	public MenuSalesDto getWeeklyMenuRankingDetail(String userid, String dateString);
	/**
	 * 월간 메뉴별 매출 순위 정보 TOP3를 반환합니다.
	 * @author doyooon
	 * @param userid - String: 유저의 로그인ID (사업자번호) 입니다.
	 * @param dateString - String: 메뉴별 매출 정보를 조회할 날짜 "2023년 5월" 입니다.
	 * @throws 404 - 유저 아이디가 없는 경우, 해당 날짜 매출 데이터가 없는 경우
	 */
	public MenuSalesDto getMonthlyMenuRanking(String userid, String dateString);
	/**
	 * 월간 메뉴별 매출 순위 정보전체를 반환합니다.
	 * @author doyooon
	 * @param userid - String: 유저의 로그인ID (사업자번호) 입니다.
	 * @param dateString - String: 메뉴별 매출 정보를 조회할 날짜 "2023년 5월" 입니다.
	 * @throws 404 - 유저 아이디가 없는 경우, 해당 날짜 매출 데이터가 없는 경우
	 */
	public MenuSalesDto getMonthlyMenuRankingDetail(String userid, String dateString);
	
	/**
	 * 일간 메뉴별 지난 날 대비 판매량 순위 정보 Best/Worst를 반환합니다.
	 * @author ehtjsv2
	 * @param userid - String: 유저의 로그인ID (사업자번호) 입니다.
	 * @param date - LocalDate: 메뉴별 매출 정보를 조회할 날짜 "yyyy-MM-dd" 입니다.
	 * @throws 404 - 유저 아이디가 없는 경우, 해당 날짜 매출 데이터가 없는 경우
	 */
	public MenuDiffDto getDailyMenuDiff(String userId, LocalDate date);
	/**
	 * 주간 메뉴별 지난 주 대비 판매량 순위 정보 Best/Worst를 반환합니다.
	 * @author ehtjsv2
	 * @param userid - String: 유저의 로그인ID (사업자번호) 입니다.
	 * @param dateString - String: 메뉴별 매출 정보를 조회할 날짜 "2023년 5월 2주차" 입니다.
	 * @throws 404 - 유저 아이디가 없는 경우, 해당 날짜 매출 데이터가 없는 경우
	 */
	public MenuDiffDto getWeeklyMenuDiff(String userId, String dateString); 
	/**
	 * 월간 메뉴별 지난 월 대비 판매량 순위 정보 Best/Worst를 반환합니다.
	 * @author doyooon
	 * @param userid - String: 유저의 로그인ID (사업자번호) 입니다.
	 * @param dateString - String: 메뉴별 매출 정보를 조회할 날짜 "2023년 5월" 입니다.
	 * @throws 404 - 유저 아이디가 없는 경우
	 */
	public MenuDiffDto getMonthlyMenuDiff(String userid, String dateString);
	
	/**
	 * 일간 메뉴별 지난 날 대비 판매량 순위 정보 전체를 반환합니다.
	 * @author doyooon
	 * @param userid - String: 유저의 로그인ID (사업자번호) 입니다.
	 * @param date - LocalDate: 메뉴별 매출 정보를 조회할 날짜 "yyyy-MM-dd" 입니다.
	 * @throws 404 - 유저 아이디가 없는 경우, 해당 날짜 매출 데이터가 없는 경우
	 */
	public MenuDiffDetailDto getDailyMenuDiffDetail(String userId, LocalDate date);
	/**
	 * 주간 메뉴별 지난 주 대비 판매량 순위 정보 전체를 반환합니다.
	 * @author ehtjsv2
	 * @param userid - String: 유저의 로그인ID (사업자번호) 입니다.
	 * @param dateString - String: 메뉴별 매출 정보를 조회할 날짜 "2023년 5월 2주차" 입니다.
	 * @throws 404 - 유저 아이디가 없는 경우, 해당 날짜 매출 데이터가 없는 경우
	 */
	public MenuDiffDetailDto getWeeklyMenuDiffDetail(String userId, String dateString);
	/**
	 * 월간 메뉴별 지난 월 대비 판매량 순위 정보전체를 반환합니다.
	 * @author doyooon
	 * @param userid - String: 유저의 로그인ID (사업자번호) 입니다.
	 * @param dateString - String: 메뉴별 매출 정보를 조회할 날짜 "2023년 5월" 입니다.
	 * @throws 404 - 유저 아이디가 없는 경우
	 */
	public MenuDiffDetailDto getMonthlyMenuDiffDetail(String userId, String dateString);
	
	
}
