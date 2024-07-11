package com.MoReport.domain.menuSales.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.regex.Matcher;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.MoReport.domain.image.Image;
import com.MoReport.domain.menu.domain.Menu;
import com.MoReport.domain.menu.service.MenuService;
import com.MoReport.domain.menuSales.dao.MenuSalesRepository;
import com.MoReport.domain.menuSales.domain.MenuSales;
import com.MoReport.domain.menuSales.dto.MenuDiff;
import com.MoReport.domain.menuSales.dto.MenuDiffDetail;
import com.MoReport.domain.menuSales.dto.MenuDiffDetailDto;
import com.MoReport.domain.menuSales.dto.MenuDiffDto;
import com.MoReport.domain.menuSales.dto.MenuSalesDto;
import com.MoReport.domain.menuSales.dto.RankedMenu;
import com.MoReport.domain.user.domain.User;
import com.MoReport.domain.user.service.UserServiceImpl;
import com.MoReport.global.common.DateMethod;
import com.MoReport.global.error.DataNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class MenuSalesServiceImpl implements MenuSalesService {

	private final UserServiceImpl userServiceImpl;
	private final MenuSalesRepository menuSalesRepository;
	private final MenuService menuService;
	@Override
	public MenuSalesDto getDailyMenuRanking(String userid, LocalDate date) {
		List<MenuSales> menuSales = findAllSortedByCountDesc(userid, date);
		int totalRevenue = 0;
    	for(MenuSales e : menuSales) {
    		totalRevenue += e.getCount();
    	}
    	if(totalRevenue == 0) throw new DataNotFoundException("장사 안했음");
    	
		List<RankedMenu> menusList = getDayRankedMenuList(menuSales);
		
		menusList = menusList.subList(0, 3);
		return MenuSalesDto.builder().menus(menusList).build();
	}
	
	@Override
	public MenuSalesDto getDailyMenuRankingDetail(String userid, LocalDate date) {
		List<MenuSales> lastMenuSales = findAllSortedByCountDesc(userid, date.minusDays(1));
		List<MenuSales> menuSales = findAllSortedByCountDesc(userid, date);
		int totalRevenue = 0;
    	for(MenuSales e : menuSales) {
    		totalRevenue += e.getCount();
    	}
    	if(totalRevenue == 0) throw new DataNotFoundException("장사 안했음");
		List<RankedMenu> menusList = getDayRankedMenuListDetail(menuSales, lastMenuSales);

		return MenuSalesDto.builder()
				.menus(menusList)
				.build();
	}

	@Override
	public MenuSalesDto getWeeklyMenuRanking(String userid, String dateString) {
		User user = userServiceImpl.getUserByLoginId(userid);
		Matcher matcher = DateMethod.getDateStringToMatcherForWeekly(dateString);
		LocalDate firstDateOfWeek = DateMethod.getFirstDateOfWeek(matcher);
		
		List<Object[]> sortedMenuSales = getWeekSalesList(user,firstDateOfWeek);
		List<RankedMenu> menusList = getWeekMonthRankedMenuList(sortedMenuSales);
		
		menusList = menusList.subList(0,3);
		return MenuSalesDto.builder()
				.menus(menusList)
				.build();
	}
	@Override
	public MenuSalesDto getWeeklyMenuRankingDetail(String userid, String dateString) {
		User user = userServiceImpl.getUserByLoginId(userid);
		// dateString을 Matcher로 변환 그룹1->년, 그룹2->월, 그룹3->주차
		Matcher matcher =DateMethod.getDateStringToMatcherForWeekly(dateString);
		// 이번 주의 첫째 날, matcher를 인자로
		LocalDate thisWeekStartDate = DateMethod.getFirstDateOfWeek(matcher);
		LocalDate thisWeekEndDate = DateMethod.getLastDateOfWeek(thisWeekStartDate);
		// 지난 주의 첫째 날
		LocalDate lastWeekStartDate = DateMethod.getFristDateOfPreviousWeek(thisWeekStartDate, Integer.parseInt(matcher.group(3)));
		LocalDate lastWeekEndDate = DateMethod.getLastDateOfWeek(lastWeekStartDate);
		List<Object[]> lastSortedMenuSales = this.menuSalesRepository.findByUserAndDateBetween(user, lastWeekStartDate, lastWeekEndDate);
		List<Object[]> sortedMenuSales = this.menuSalesRepository.findByUserAndDateBetween(user, thisWeekStartDate, thisWeekEndDate);
		if(sortedMenuSales.size() == 0) {
    		throw new DataNotFoundException("nonodata");
    	}
		
		List<RankedMenu> menusList = getWeekMonthRankedMenuListDetail(sortedMenuSales,lastSortedMenuSales);
		
		return MenuSalesDto.builder()
				.menus(menusList)
				.build();
	}
	
	/*
	 * 해당 주의 첫째날을 startDate로 받으며 그 날로부터 7일동안의 매출을 List로 반환한다. 7일동안의 데이터를 조회할 때 해당 월의
	 * 마지막 날짜를 벗어나 조회하지않도록 조절한다. 1개라도 데이터가 없다면 DataNotFoundException을 반환
	 */
	public List<Object[]> getWeekSalesList(User user, LocalDate startDate) {
		// 이번 주의 마지막 날짜
		LocalDate endDate=DateMethod.getLastDateOfWeek(startDate);
		List<Object[]> sortedMenuList = this.menuSalesRepository.findByUserAndDateBetween(user, startDate, endDate);
		
		if (sortedMenuList.size() == 0) {
			throw new DataNotFoundException("nonodata");
		} else {
			return sortedMenuList;
		}
	}
	
	

	@Override
	public MenuSalesDto getMonthlyMenuRanking(String userid, String dateString) {
		User user = userServiceImpl.getUserByLoginId(userid);

		LocalDate startDate = DateMethod.dateStringToLocalDateForMonthly(dateString);
		LocalDate endDate = DateMethod.getLastDayOfMonth(startDate);
		List<Object[]> sortedMenuSales = this.menuSalesRepository.findByUserAndDateBetween(user, startDate, endDate);
		
		if(sortedMenuSales.size() == 0) {
    		throw new DataNotFoundException("nonodata");
    	}
		
		List<RankedMenu> menusList = getWeekMonthRankedMenuList(sortedMenuSales);
		
		menusList = menusList.subList(0,3);
		return MenuSalesDto.builder()
				.menus(menusList)
				.build();
	}
	
	@Override
	public MenuSalesDto getMonthlyMenuRankingDetail(String userid, String dateString) {
		User user = userServiceImpl.getUserByLoginId(userid);
		
		LocalDate startDate = DateMethod.dateStringToLocalDateForMonthly(dateString);
		LocalDate endDate = DateMethod.getLastDayOfMonth(startDate);
		LocalDate lastStartDate = startDate.minusMonths(1);
		LocalDate lastEndDate = DateMethod.getLastDayOfMonth(lastStartDate);

		List<Object[]> lastSortedMenuSales = this.menuSalesRepository.findByUserAndDateBetween(user, lastStartDate, lastEndDate);
		List<Object[]> sortedMenuSales = this.menuSalesRepository.findByUserAndDateBetween(user, startDate, endDate);
		if(sortedMenuSales.size() == 0) {
    		throw new DataNotFoundException("nonodata");
    	}
		
		List<RankedMenu> menusList = getWeekMonthRankedMenuListDetail(sortedMenuSales,lastSortedMenuSales);
		
		return MenuSalesDto.builder()
				.menus(menusList)
				.build();
	}
	
	
	@Override
	public MenuDiffDto getDailyMenuDiff(String userId, LocalDate date) {
		User user = userServiceImpl.getUserByLoginId(userId);

		LocalDate preDate = date.minusDays(1);
		// 오늘 메뉴매출 리스트
		List<MenuSales> thisMenuSalesList = findAllByUserAndDate(user, date);
		// 어제 메뉴매출 리스트
		List<MenuSales> preMenuSalesList = findAllByUserAndDate(user, preDate);
		// 오늘 메뉴매출 해시맵
		HashMap<String, Long> thisMenuSalesHM = menuSalesToHashMap(thisMenuSalesList);
		// 어제 메뉴매출 해시맵
		HashMap<String, Long> preMenuSalesHM = menuSalesToHashMap(preMenuSalesList);
		// 오늘과 어제 메뉴매출 비교 리스트 생성
		List<MenuDiff> dayMenuDiffList = getDayMenuDiffList(thisMenuSalesHM, preMenuSalesHM);
		// changeRate기준으로 내림차순 정렬
		sortMenuDiffList(dayMenuDiffList);
		// DayMenuDiffDto 생성
		MenuDiffDto dayMenuDiffDto = getMenuDiffDto(dayMenuDiffList, thisMenuSalesList);
		

		return dayMenuDiffDto;
	}
	
	@Override
	public MenuDiffDto getWeeklyMenuDiff(String userId, String dateString) {
		User user = userServiceImpl.getUserByLoginId(userId);
		// dateString을 Matcher로 변환 그룹1->년, 그룹2->월, 그룹3->주차
		Matcher matcher =DateMethod.getDateStringToMatcherForWeekly(dateString);
		// 이번 주의 첫째 날, matcher를 인자로
		LocalDate firstDateOfWeek = DateMethod.getFirstDateOfWeek(matcher);
		// 지난 주의 첫째 날. 주차를 인자로
		LocalDate previousFirstDateOfWeek = DateMethod.getFristDateOfPreviousWeek(firstDateOfWeek,
						Integer.parseInt(matcher.group(3)));
		//0->nameString 1->price 2->totalCnt(Long)
		List<Object[]> thisMenuSalesList = getWeekSalesList(user, firstDateOfWeek);
		List<Object[]> preMenuSalesList = getWeekSalesList(user, previousFirstDateOfWeek);
		
		// 이번 주 메뉴매출 해시맵
		HashMap<String, Long> thisMenuSalesHM = objectListToHashMap(thisMenuSalesList);
		// 저번 주 메뉴매출 해시맵
		HashMap<String, Long> preMenuSalesHM = objectListToHashMap(preMenuSalesList);
		// 이번주와 저번 메뉴매출 비교 리스트 생성
		List<MenuDiff> menuDiffList = getDayMenuDiffList(thisMenuSalesHM, preMenuSalesHM);
		// changeRate기준으로 내림차순 정렬
		sortMenuDiffList(menuDiffList);
		// DayMenuDiffDto 생성
		MenuDiffDto menuDiffDto = getWeekMonthMenuDiffDto(menuDiffList);
		return menuDiffDto;
	}
	
	@Override
	public MenuDiffDto getMonthlyMenuDiff(String userid, String dateString) {
		User user = userServiceImpl.getUserByLoginId(userid);

		LocalDate thisMonthStartDate = DateMethod.dateStringToLocalDateForMonthly(dateString);
		LocalDate thisMonthEndDate = DateMethod.getLastDayOfMonth(thisMonthStartDate);
		
		LocalDate lastMonthStartDate = thisMonthStartDate.minusMonths(1);
		LocalDate lastMonthEndDate = DateMethod.getLastDayOfMonth(lastMonthStartDate);
		
		List<Object[]> monthMenuSalesDiff = this.menuSalesRepository.findByUserAndDateBetween(user, lastMonthStartDate, lastMonthEndDate, thisMonthStartDate, thisMonthEndDate);
		List<MenuDiff> menuDiffList = new ArrayList<MenuDiff>();
		for(Object[] e : monthMenuSalesDiff) {
			String menuName = (String)e[0];
			int price = (Integer) e[1];
			long lastTotalCount = (Long)e[2];
			long thisTotalCount = (Long)e[3];
			long changeTotalCount = thisTotalCount - lastTotalCount;
			double changeRate = (double)(thisTotalCount - lastTotalCount)/lastTotalCount * 100.0;
			
			MenuDiff menuDiff = MenuDiff.builder()
					.menuName(menuName)
					.changeRate(changeRate)
					.changeRevenue(price * changeTotalCount)
					.build();
			menuDiffList.add(menuDiff);
		}
		sortMenuDiffList(menuDiffList);
		
		if(menuDiffList.size() == 0) throw new DataNotFoundException("no data menuDiffList");
		MenuDiffDto menuDiffDto= getWeekMonthMenuDiffDto(menuDiffList);
		
		return menuDiffDto;
	}
	
	@Override
	public MenuDiffDetailDto getDailyMenuDiffDetail(String userId, LocalDate date) {
		User user = userServiceImpl.getUserByLoginId(userId);
		LocalDate preDate = date.minusDays(1);

		List<Object[]> menuDiffDetails = this.menuSalesRepository.findByUserAndDateBetween(user, preDate, preDate, date, date);
		List<MenuDiffDetail> menuDiffList = new ArrayList<MenuDiffDetail>();
		for (Object[] e : menuDiffDetails) {
			String menuName = (String)e[0];
			int price = (Integer) e[1];
			long lastTotalCount = (Long)e[2];
			long thisTotalCount = (Long)e[3];
			double changeRate = (double)(thisTotalCount - lastTotalCount)/lastTotalCount * 100.0;
			
			MenuDiffDetail menuDiffDail = MenuDiffDetail.builder()
					.menuName(menuName)
					.changeRate(changeRate)
					.lastCount(lastTotalCount)
					.thisCount(thisTotalCount)
					.lastRevenue(lastTotalCount * price)
					.thisRevenue(thisTotalCount * price)
					.build();
			
			menuDiffList.add(menuDiffDail);
		}
		sortMenuDiffDetailList(menuDiffList);
		return MenuDiffDetailDto.builder()
				.menus(menuDiffList)
				.build();
	}
	
	@Override
	public MenuDiffDetailDto getWeeklyMenuDiffDetail(String userId, String dateString) {
		User user = userServiceImpl.getUserByLoginId(userId);
		
		// dateString을 Matcher로 변환 그룹1->년, 그룹2->월, 그룹3->주차
		Matcher matcher =DateMethod.getDateStringToMatcherForWeekly(dateString);
		// 이번 주의 첫째 날, matcher를 인자로
		LocalDate thisWeekStartDate = DateMethod.getFirstDateOfWeek(matcher);
		LocalDate thisWeekEndDate = DateMethod.getLastDateOfWeek(thisWeekStartDate);
		
		LocalDate lastWeekStartDate = DateMethod.getFristDateOfPreviousWeek(thisWeekStartDate, Integer.parseInt(matcher.group(3)));
		LocalDate lastWeekEndDate = DateMethod.getLastDateOfWeek(lastWeekStartDate);

		
		List<Object[]> menuDiffDetails = this.menuSalesRepository.findByUserAndDateBetween(user, lastWeekStartDate, lastWeekEndDate, thisWeekStartDate, thisWeekEndDate);
		List<MenuDiffDetail> menuDiffList = new ArrayList<MenuDiffDetail>();
		for (Object[] e : menuDiffDetails) {
			String menuName = (String)e[0];
			int price = (Integer) e[1];
			long lastTotalCount = (Long)e[2];
			long thisTotalCount = (Long)e[3];
			double changeRate = (double)(thisTotalCount - lastTotalCount)/lastTotalCount * 100.0;
			
			MenuDiffDetail menuDiffDail = MenuDiffDetail.builder()
					.menuName(menuName)
					.changeRate(changeRate)
					.lastCount(lastTotalCount)
					.thisCount(thisTotalCount)
					.lastRevenue(lastTotalCount * price)
					.thisRevenue(thisTotalCount * price)
					.build();
			
			menuDiffList.add(menuDiffDail);
		}
		sortMenuDiffDetailList(menuDiffList);
		return MenuDiffDetailDto.builder()
				.menus(menuDiffList)
				.build();
	}
	
	@Override
	public MenuDiffDetailDto getMonthlyMenuDiffDetail(String userId, String dateString) {
		User user = userServiceImpl.getUserByLoginId(userId);

		LocalDate thisMonthStartDate = DateMethod.dateStringToLocalDateForMonthly(dateString);
		LocalDate thisMonthEndDate = DateMethod.getLastDayOfMonth(thisMonthStartDate);
		
		LocalDate lastMonthStartDate = thisMonthStartDate.minusMonths(1);
		LocalDate lastMonthEndDate = DateMethod.getLastDayOfMonth(lastMonthStartDate);
		
		List<Object[]> menuDiffDetails = this.menuSalesRepository.findByUserAndDateBetween(user, lastMonthStartDate, lastMonthEndDate, thisMonthStartDate, thisMonthEndDate);
		List<MenuDiffDetail> menuDiffList = new ArrayList<MenuDiffDetail>();
		for (Object[] e : menuDiffDetails) {
			String menuName = (String)e[0];
			int price = (Integer) e[1];
			long lastTotalCount = (Long)e[2];
			long thisTotalCount = (Long)e[3];
			double changeRate = (double)(thisTotalCount - lastTotalCount)/lastTotalCount * 100.0;
			
			MenuDiffDetail menuDiffDail = MenuDiffDetail.builder()
					.menuName(menuName)
					.changeRate(changeRate)
					.lastCount(lastTotalCount)
					.thisCount(thisTotalCount)
					.lastRevenue(lastTotalCount * price)
					.thisRevenue(thisTotalCount * price)
					.build();
			
			menuDiffList.add(menuDiffDail);
		}
		sortMenuDiffDetailList(menuDiffList);
		return MenuDiffDetailDto.builder()
				.menus(menuDiffList)
				.build();
	}
	/**
	 * 
	 * 일일 매출과 매출차이를 반환합니다.
	 * @author doyooon
	 * @param userid - String : 유저의 로그인 ID(사업자 번호) 입니다
	 * @param date - LocaDate : 매출 조회 날짜 입니다. "yyyy-MM-dd"
	 * @throws 404 - 유저가 없는 경우, 해당날짜 매출 데이터 없을 경우, 해당 날짜 매출이 0원일 경우
	 * 
	 */
    public List<MenuSales> findAllSortedByCountDesc(String userid, LocalDate date) {
        User user = userServiceImpl.getUserByLoginId(userid);
    	Sort sort = Sort.by(Sort.Direction.DESC, "count");
        
    	List<MenuSales> SortedMenuSalesList = this.menuSalesRepository.findAllByUserAndDate(user,date,sort);
    	if(SortedMenuSalesList.size() == 0) {
    		throw new DataNotFoundException("nonodata");
    	}
    	
    	else {
    		return SortedMenuSalesList;
    	}
    }

	/**
	 * 인자로 받은 list를 이용하여 api로 보내줄 형식의 새로운 menusList를 만듦니다.
	 * @author doyooon
	 * @param list - List<MenuSales>: 판매량을 기준으로 내림차순 정렬 된 리스트입니다.
	 * @return menuList
	 */
    public List<RankedMenu> getDayRankedMenuList(List<MenuSales> list) {
    	List<RankedMenu> menusList =new ArrayList<RankedMenu>();
    	int ranking = 1;
		for(MenuSales e : list) {
			
			//RankedMenu 배열 만들기
			if(ranking == 1) {
				Optional<Image> image = Optional.ofNullable(e.getMenu().getImage());
				String imageUrl;
				if(image.isPresent()) {
					imageUrl = image.get().getFilePath();
				}else {
					imageUrl = null;
				}
				
				RankedMenu rankedMenu = RankedMenu.builder()
						.rank(ranking++)
						.menuName(e.getMenu().getMenuName())
						.count(e.getCount())
						.totalRevenue(e.getMenu().getPrice() * e.getCount())
						.imageUrl(imageUrl)
						.build();
				menusList.add(rankedMenu);
			}else {
				RankedMenu rankedMenu = RankedMenu.builder()
						.rank(ranking++)
						.menuName(e.getMenu().getMenuName())
						.count(e.getCount())
						.totalRevenue(e.getMenu().getPrice() * e.getCount())
						.build();
				menusList.add(rankedMenu);
			}
		}
		
		return menusList;
    }
    /**
	 * 인자로 받은 list를 이용하여 api로 보내줄 형식의 새로운 menusList를 만듦니다. 지난 일의 리스트와 비교하여 순위 변동량을 계산합니다.
	 * @author doyooon
	 * @param list - List<MenuSales>: 판매량을 기준으로 내림차순 정렬 된 리스트입니다.
	 * @return menuList
	 */
    public List<RankedMenu> getDayRankedMenuListDetail(List<MenuSales> list, List<MenuSales> lastList) {
    	HashMap<String, Integer> lastListHM = new HashMap<String, Integer>();
    	int lastRanking = 1;
    	for(MenuSales e : lastList) {
    		String menuName = e.getMenu().getMenuName();
    		lastListHM.put(menuName, lastRanking++);
    	}
    	
    	List<RankedMenu> menusList =new ArrayList<RankedMenu>();
    	int ranking = 1;
		for(MenuSales e : list) {
			int lastRank = lastListHM.getOrDefault(e.getMenu().getMenuName(), 0);
			//RankedMenu 배열 만들기
			RankedMenu rankedMenu = RankedMenu.builder()
					.rankChange(lastRank - ranking)
					.isNew(isNewMenu(lastRank))
					.rank(ranking++)
					.menuName(e.getMenu().getMenuName())
					.count(e.getCount())
					.totalRevenue(e.getMenu().getPrice() * e.getCount())
					.build();
			menusList.add(rankedMenu);
		}
		
		return menusList;
    }
    /**
	 * 인자로 받은 list를 이용하여 api로 보내줄 형식의 새로운 menusList를 만듦니다. 가장 많이 팔린 메뉴는 이미지url도 보내줍니다.
	 * @author doyooon
	 * @param list - List<Object[]>: 판매량을 기준으로 내림차순 정렬 된 리스트입니다.
	 * @return menuList
	 */
    public List<RankedMenu> getWeekMonthRankedMenuList(List <Object[]> list){
    	List<RankedMenu> menusList = new ArrayList<RankedMenu>();
		int ranking = 1;
		for(Object[] e : list) {
			String menuName = (String)e[0];
			int price = (Integer)e[1];
			long totalCount = (Long)e[2];
			
			if(ranking == 1) {
				Menu menu = (Menu)e[3];
				Optional<Image> image = Optional.ofNullable(menu.getImage());
				String imageUrl;
				if(image.isPresent()) {
					imageUrl = image.get().getFilePath();
				}else {
					imageUrl = null;
				}
				RankedMenu rankedMenu = RankedMenu.builder()
						.rank(ranking++)
						.menuName(menuName)
						.count(totalCount)
						.totalRevenue(price * totalCount)
						.imageUrl(imageUrl)
						.build();
				menusList.add(rankedMenu);
			}else {
				RankedMenu rankedMenu = RankedMenu.builder()
						.rank(ranking++)
						.menuName(menuName)
						.count(totalCount)
						.totalRevenue(price * totalCount)
						.build();
				menusList.add(rankedMenu);
			}
		}
		return menusList;
    }
    /**
	 * 인자로 받은 list를 이용하여 api로 보내줄 형식의 새로운 menusList를 만듦니다. lastList와 비교하여 순위 변동량을 계산합니다.
	 * @author doyooon
	 * @param list - List<Object[]>: 판매량을 기준으로 내림차순 정렬 된 리스트입니다.
	 * @return menuList
	 */
    public List<RankedMenu> getWeekMonthRankedMenuListDetail(List <Object[]> list, List<Object[]> lastList){
    	HashMap<String, Integer> lastListHM = new HashMap<String, Integer>();
    	int lastRanking = 1;
    	
    	for(Object[] e : lastList) {
    		String menuName = (String)e[0];
    		lastListHM.put(menuName, lastRanking++);
    	}
    	
    	List<RankedMenu> menusList = new ArrayList<RankedMenu>();
		int ranking = 1;
		for(Object[] e : list) {
			String menuName = (String)e[0];
			int price = (Integer)e[1];
			long totalCount = (Long)e[2];
			int lastRank = lastListHM.getOrDefault(menuName, 0);
			RankedMenu rankedMenu = RankedMenu.builder()
					.rankChange(lastRank - ranking)
					.isNew(isNewMenu(lastRank))
					.rank(ranking++)
					.menuName(menuName)
					.count(totalCount)
					.totalRevenue(price * totalCount)
					.build();
			menusList.add(rankedMenu);
		}
		return menusList;
    }
	
    /**
     * 메뉴가 새로 출시된 메뉴인지 알려줍니다.
     * @author doyooon
     * @param rank - int: 메뉴의 이전 랭킹입니다.
     * @return boolean
     */
    public boolean isNewMenu(int rank) {
    	if(rank == 0) return true;
    	else return false;
    }

	/**
	 * findAllByUserAndDate를 수행하면서 예외처리를 합니다.
	 * @author ehsjtv2
	 * @param user - User: 로그인한 유저 객체입니다.
	 * @param date - LocalDate: 매출 조회 날짜 입니다. "yyyy-MM-dd"
	 * @throws 404 - 해당 날짜에 매출 데이터가 없는 경우
	 */
	public List<MenuSales> findAllByUserAndDate(User user, LocalDate date) {
		List<MenuSales> menuSalesList = menuSalesRepository.findAllByUserAndDate(user, date, null);
		if (menuSalesList.size() == 0) {
			throw new DataNotFoundException("No menu sales");
		}
		return menuSalesList;
	}

	/**
	 * List<MenuSales>를 인자로 받으면 HasMap으로 변환 menuName->KEY , totalRevenue -> VALUE
	 * @author ehtjsv2
	 * @param menuSalesList - List<MenuSales>: 판매량을 기준으로 내림차순 정렬된 메뉴별 매출 데이터 입니다.
	 */
	public HashMap<String, Long> menuSalesToHashMap(List<MenuSales> menuSalesList) {
		HashMap<String, Long> menuSalesHM = new HashMap<String, Long>();
		for (int i = 0; i < menuSalesList.size(); i++) {
			MenuSales menuSales = menuSalesList.get(i);
			Menu menu = menuSales.getMenu();
			String menuName = menu.getMenuName();
			Long price = Long.valueOf(menu.getPrice());
			Long cnt = Long.valueOf(menuSales.getCount());
			menuSalesHM.put(menuName, price * cnt);
		}
		return menuSalesHM;
	}

	/**
	 * List<DayMenuDiff>를 인자로 받아서 changeRevenue기준으로 정렬해준다.
	 * @author ehtjsv2
	 * @param menuDiffList - List<MenuDiff>
	 */
	public void sortMenuDiffList(List<MenuDiff> menuDiffList) {
		Collections.sort(menuDiffList, new Comparator<MenuDiff>() {
			@Override
			public int compare(MenuDiff o1, MenuDiff o2) {
				double o1Revenue = o1.getChangeRate();
				double o2Revenue = o2.getChangeRate();
				return (int) (o2Revenue - o1Revenue);
			}
		});
	}
	
	/**
	 * menuDiffList 를 인자로 받아서 changeRevenue기준으로 정렬해준다.
	 * @author doyooon
	 * @param MenuDiffList - List<MenuDiffDetail>
	 */
	public void sortMenuDiffDetailList(List<MenuDiffDetail> menuDiffList) {
		Collections.sort(menuDiffList, new Comparator<MenuDiffDetail>() {
			@Override
			public int compare(MenuDiffDetail o1, MenuDiffDetail o2) {
				double o1Revenue = o1.getChangeRate();
				double o2Revenue = o2.getChangeRate();
				return (int) (o2Revenue - o1Revenue);
			}
		});
	}

	/**
	 * 이전 지금 매출 해시맵을 받고 같은 메뉴 이름끼리 비교하여 리스트로 반환
	 * @author ehtjsv2
	 * @param thisMenuSalesHM - HashMap<String, Long>: 기준 날짜의 메뉴별 매출 리스트의 해쉬맵입니다.
	 * @param preMenuSalesHM - HashMap<String, Long>: 기준 날짜의 하루전 날 메뉴별 매출 리스트의 해쉬맵입니다. 
	 */
	public List<MenuDiff> getDayMenuDiffList(HashMap<String, Long> thisMenuSalesHM,
			HashMap<String, Long> preMenuSalesHM) {
		// 반복문을 위한 Iterator의 Entry타입
		Iterator<Entry<String, Long>> thisMenuSalesEntries = thisMenuSalesHM.entrySet().iterator();

		List<MenuDiff> dayMenuDiffList = new ArrayList<MenuDiff>();
		while (thisMenuSalesEntries.hasNext()) {
			Map.Entry<String, Long> thisMenuSalesEntry = thisMenuSalesEntries.next();
			String menuName = thisMenuSalesEntry.getKey();
			Long thisRevenue = (Long) thisMenuSalesEntry.getValue();
			Long preRevenue = 0L;
			
			if(preMenuSalesHM.containsKey(menuName)) {
				preRevenue = (Long)preMenuSalesHM.get(menuName);
			}
			// 매출이 0이거나 같으면 제외
			if (preRevenue.equals(0L) || thisRevenue.equals(0L) || preRevenue.equals(thisRevenue) )
				continue;
			// 어제기준 증감률
			double changeRate = ((double) (thisRevenue - preRevenue) / preRevenue) * 100;

			MenuDiff dayMenuDiff = MenuDiff.builder().menuName(menuName).changeRate(changeRate)
					.changeRevenue(thisRevenue - preRevenue).build();
			dayMenuDiffList.add(dayMenuDiff);
		}
		if(dayMenuDiffList.size()==0) throw new DataNotFoundException("No Data");
		return dayMenuDiffList;
	}
	
	/**
	 * dayMenuDiffList 에서 가장 많이 팔린 메뉴와 가장 적게 팔린 메뉴를 찾고 thisMenuSalesList에서 이미지를 가지고와 저장 후 반환합니다.
	 * @author ehtjsv2
	 * @param dayMenuDiffList - List<MenuDiff>: 날짜별 메뉴 판매량 차이 리스트입니다.
	 * @param thisMenuSalesList - List<MenuSales>: 메뉴 판매량 리스트입니다.
	 * @return
	 */
	public MenuDiffDto getMenuDiffDto(List<MenuDiff> dayMenuDiffList, List<MenuSales> thisMenuSalesList) {
		MenuDiff bestDayMenuDiff = dayMenuDiffList.get(0);
		MenuDiff worstDayMenuDiff = dayMenuDiffList.get(dayMenuDiffList.size() - 1);
		for (int i = 0; i < thisMenuSalesList.size(); i++) {
			MenuSales thisMenuSales = thisMenuSalesList.get(i);
			Menu thisMenu = thisMenuSales.getMenu();
			if (thisMenu.getMenuName() == bestDayMenuDiff.getMenuName()) {
				Image image = thisMenu.getImage();
				if (image != null)
					bestDayMenuDiff.setImageUrl(thisMenu.getImage().getFilePath());
				else
					bestDayMenuDiff.setImageUrl(null);
			}
			if (thisMenu.getMenuName() == worstDayMenuDiff.getMenuName()) {
				Image image = thisMenu.getImage();
				if (image != null)
					worstDayMenuDiff.setImageUrl(thisMenu.getImage().getFilePath());
				else
					worstDayMenuDiff.setImageUrl(null);
			}
		}
		return MenuDiffDto.builder().best(bestDayMenuDiff).worst(worstDayMenuDiff).build();
	}
	
	/**
	 * menuDiffList 에서 가장 많이 팔린 메뉴와 가장 적게 팔린 메뉴를 찾아 반환합니다.
	 * @author doyooon
	 * @param menuDiffList
	 */
	public MenuDiffDto getWeekMonthMenuDiffDto(List<MenuDiff> menuDiffList) {
		MenuDiff bestMenuDiff = menuDiffList.get(0);
		MenuDiff worstMenuDiff = menuDiffList.get(menuDiffList.size() - 1);
		Menu bestMenu  = menuService.findOneByMenuName(bestMenuDiff.getMenuName());
		Menu worstMenu = menuService.findOneByMenuName(worstMenuDiff.getMenuName());
		Image bestImage = bestMenu.getImage();
		Image worstImage = worstMenu.getImage();
		if (bestImage != null)
			bestMenuDiff.setImageUrl(bestImage.getFilePath());
		else
			bestMenuDiff.setImageUrl(null);
		if (worstImage != null)
			worstMenuDiff.setImageUrl(worstImage.getFilePath());
		else
			worstMenuDiff.setImageUrl(null);
		return MenuDiffDto.builder().best(bestMenuDiff).worst(worstMenuDiff).build();
	}
	/**
	 * 주간,월간 menuDiffList를 인자로 받아 HasMap으로 변환 menuName->KEY , totalRevenue(cnt * price) -> VALUE
	 * @author doyooon
	 * @param objectList
	 * @return menuSalesHM
	 */
	private HashMap<String, Long> objectListToHashMap(List<Object[]> objectList) {
		HashMap<String, Long> menuSalesHM = new HashMap<String, Long>();
		for(Object[] e : objectList) {
			String menuName = (String)e[0];
			int price =(Integer)e[1];
			Long cnt = (Long)e[2];
			menuSalesHM.put(menuName, (cnt * price));
		}
		
		return menuSalesHM;
	}



}