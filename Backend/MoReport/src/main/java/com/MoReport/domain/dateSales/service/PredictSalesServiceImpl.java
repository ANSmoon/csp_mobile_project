package com.MoReport.domain.dateSales.service;

import com.MoReport.domain.dateSales.dao.DailySalesPredictionRepository;
import com.MoReport.domain.dateSales.dao.MonthlySalesPredictionRepository;
import com.MoReport.domain.dateSales.dao.WeeklySalesPredictionRepository;
import com.MoReport.domain.dateSales.domain.DailySalesPrediction;
import com.MoReport.domain.dateSales.domain.MonthlySalesPrediction;
import com.MoReport.domain.dateSales.domain.WeeklySalesPrediction;
import com.MoReport.domain.dateSales.dto.AISalesPredictDto;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;

import org.springframework.stereotype.Service;

import com.MoReport.domain.dateSales.dao.DateSalesRepository;
import com.MoReport.domain.dateSales.domain.DateSales;
import com.MoReport.domain.dateSales.dto.PredictSalesDto;
import com.MoReport.domain.user.domain.User;
import com.MoReport.domain.user.service.UserServiceImpl;
import com.MoReport.domain.weight.service.WeightServiceImpl;
import com.MoReport.global.common.DateMethod;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;


@Service
@Slf4j
@RequiredArgsConstructor
public class PredictSalesServiceImpl implements PredictSalesService {

    private final DateSalesRepository dateSalesRepository;
    private final DateSalesServiceImpl dateSalesServiceImpl;
    private final UserServiceImpl userServiceImpl;
    private final WeightServiceImpl weightServiceImpl;
    private final DailySalesPredictionRepository dailySalesPredictionRepository;
    private final WeeklySalesPredictionRepository weeklySalesPredictionRepository;
    private final MonthlySalesPredictionRepository monthlySalesPredictionRepository;

    @Override
    public PredictSalesDto getDailyPredict(String loginId, LocalDate date) {
        User user = userServiceImpl.getUserByLoginId(loginId);
        int userId = user.getId();
        DailySalesPrediction dailySalesPrediction = dailySalesPredictionRepository.findByUserId(userId);
        // 이전 예측
        int prePredictRevenue = dailySalesPrediction.getTodaySalesPrediction();

        // 다음 예측
        int nextPredictRevenue = dailySalesPrediction.getTomorrowSalesPrediction();

        // 이전 매출 리스트 op
        Optional<List<DateSales>> opPreRevenueList = dateSalesRepository.findByUserAndDateBetween(user,
                date.minusDays(4), date.minusDays(1));

        // 이전 매출 리스트 Integer
        List<Integer> preRevenueList = getRevenueList(opPreRevenueList.get());
        PredictSalesDto predictSalesDto = PredictSalesDto.builder()
                .prePredictRevenue(prePredictRevenue)
                .nextPredictRevenue(nextPredictRevenue)
                .preRevenueList(preRevenueList)
                .build();

        return predictSalesDto;
    }

    @Override
    public PredictSalesDto getWeeklyPredict(String loginId, String dateString) {
        User user = userServiceImpl.getUserByLoginId(loginId);
        int userId = user.getId();
        WeeklySalesPrediction weeklySalesPrediction = weeklySalesPredictionRepository.findByUserId(userId);

        Matcher matcher =DateMethod.getDateStringToMatcherForWeekly(dateString);
        // 이번 주의 첫째 날, matcher를 인자로
        LocalDate thisWeekStartDate = DateMethod.getFirstDateOfWeek(matcher);
        LocalDate thisWeekEndDate = DateMethod.getLastDateOfWeek(thisWeekStartDate);

        // 다음 주 예상매출
        int nextPredictRevenue = weeklySalesPrediction.getNextWeekSalesPrediction();

        // 이번 주 예상했던 매출
        //(매주 토요일에서 일요일 정각으로 넘어가는 타이밍에 repository 새로 정리하는 빈이 등록되어야 할 듯)
        int preTotalPredictRevenue = weeklySalesPrediction.getThisWeekSalesPrediction();

        // 4주간 주간 매출 데이터리스트
        List<Integer> preRevenueList = new ArrayList<Integer>();
        for (int i = 4; i >= 1; i--) {
            int totalRevenue = 0;
            List<DateSales> previousWeekSalesList = dateSalesServiceImpl.getWeekSalesList(user,
                    thisWeekStartDate.minusWeeks(i));
			for (DateSales dateSales : previousWeekSalesList) {
				totalRevenue += dateSales.getTotalRevenue();
			}
            preRevenueList.add(totalRevenue);
        }
        PredictSalesDto predictSalesDto = PredictSalesDto.builder()
                .prePredictRevenue(nextPredictRevenue)
                .nextPredictRevenue(preTotalPredictRevenue)
                .preRevenueList(preRevenueList)
                .build();
        return predictSalesDto;
    }

    @Override
    public PredictSalesDto getMonthlyPredict(String loginId, String dateString) {
        User user = userServiceImpl.getUserByLoginId(loginId);
        // 이번 주의 첫째 날, matcher를 인자로
        LocalDate thisMonthStartDate = DateMethod.dateStringToLocalDateForMonthly(dateString);
        LocalDate thisMonthEndDate = DateMethod.getLastDayOfMonth(thisMonthStartDate);
        LocalDate preMonthStartDate = thisMonthStartDate.minusMonths(1);
        LocalDate preMonthEndDate = DateMethod.getLastDayOfMonth(preMonthStartDate);
        // 이번 달 요일 평균 가중치
        List<BigDecimal> weightList = new ArrayList<BigDecimal>();
        for (Long i = 0L; i < thisMonthEndDate.getDayOfMonth(); i++) {
            BigDecimal weight = weightServiceImpl.getNextWeightByUserAndDate(user, thisMonthStartDate.plusDays(i));
            weightList.add(weight);
        }
        // 저번 달 요일 평균 가중치
        List<BigDecimal> preWeightList = new ArrayList<BigDecimal>();
        for (Long i = 0L; i < preMonthEndDate.getDayOfMonth(); i++) {
            BigDecimal weight = weightServiceImpl.getNextWeightByUserAndDate(user, preMonthStartDate.plusDays(i));
            preWeightList.add(weight);
        }
        // 이번 달까지의 6개울간 평균 매출
        BigDecimal avgSixMonthsRevenue = dateSalesServiceImpl.findAverageRevenueForLastSixMonths(user,
                thisMonthEndDate.minusMonths(6), thisMonthEndDate);
        // 저번 달까지의 6개월간 평균 매출
        BigDecimal preAvgSixMonthsRevenue = dateSalesServiceImpl.findAverageRevenueForLastSixMonths(user,
                preMonthEndDate.minusMonths(6), preMonthEndDate);
        // 이번 달 평균 매출에 가중치 적용 매출 합
        Long totalPredictRevenue = 0L;
        for (BigDecimal weight : weightList) {
            totalPredictRevenue +=
                    avgSixMonthsRevenue.longValue() + (avgSixMonthsRevenue.multiply(weight).longValue() / 100L);
        }
        // 저번 달 평균 매출에 가중치 적용 매출 합
        Long preTotalPredictRevenue = 0L;
        for (BigDecimal weight : preWeightList) {
            preTotalPredictRevenue +=
                    preAvgSixMonthsRevenue.longValue() + (preAvgSixMonthsRevenue.multiply(weight).longValue() / 100L);
        }
        // 이전 4개월 매출 데이터리스트
        List<Integer> preRevenueList = new ArrayList<Integer>();
        for (int i = 4; i >= 1; i--) {
            LocalDate monthEndDate = DateMethod.getLastDayOfMonth(thisMonthStartDate.minusMonths(i));
            Optional<Integer> optionalThisTotalRevenue = dateSalesRepository.sumTotalRevenueByUserAndDateBetween(user,
                    thisMonthStartDate.minusMonths(i),
                    monthEndDate);
            int totalRevenue = 0;
            if (optionalThisTotalRevenue.isPresent()) {
                totalRevenue = optionalThisTotalRevenue.get();
            }
            preRevenueList.add(totalRevenue);
        }
        PredictSalesDto predictSalesDto = PredictSalesDto.builder()
                .prePredictRevenue(preTotalPredictRevenue.intValue())
                .nextPredictRevenue(totalPredictRevenue.intValue())
                .preRevenueList(preRevenueList)
                .build();
        return predictSalesDto;
    }

    /**
     * DateSales List를 매출만 담긴 List로 변환하여 반환합니다.
     *
     * @param salesList - List[DateSales] : DateSales를 담은 리스트
     * @author ehtjsv2
     */
    public List<Integer> getRevenueList(List<DateSales> salesList) {
        List<Integer> revenueList = new ArrayList<Integer>();
        for (DateSales sales : salesList) {
            revenueList.add(sales.getTotalRevenue());
        }
        return revenueList;
    }

    @Transactional
    public void updateDailyPredictionAllUsers(List<User> usersWhoPermitted, AISalesPredictDto response) {
        for (User user : usersWhoPermitted) {
            updateDailyPredictionOneUser(user, response);
        }
    }


    private void updateDailyPredictionOneUser(User user, AISalesPredictDto response) {
        DailySalesPrediction dailySalesPrediction = dailySalesPredictionRepository.findByUserId(user.getId());
        dailySalesPrediction.setTodaySalesPrediction(dailySalesPrediction.getTomorrowSalesPrediction());
        dailySalesPrediction.setTomorrowSalesPrediction(response.getTomorrowSalePrediction().intValue());
    }

    @Transactional
    public void updateWeeklyPredictionAllUsers(List<User> usersWhoPermitted, AISalesPredictDto response) {
        for (User user : usersWhoPermitted) {
            updateWeeklyPredictionOneUser(user, response);
        }
    }

    private void updateWeeklyPredictionOneUser(User user, AISalesPredictDto response) {
        WeeklySalesPrediction weeklySalesPrediction = weeklySalesPredictionRepository.findByUserId(user.getId());
        weeklySalesPrediction.setThisWeekSalesPrediction(weeklySalesPrediction.getNextWeekSalesPrediction());
        weeklySalesPrediction.setNextWeekSalesPrediction(response.getNextWeekSalePrediction().intValue());
    }

    @Transactional
    public void updateMonthlyPredictionAllUsers(List<User> usersWhoPermitted, AISalesPredictDto response) {
        for (User user : usersWhoPermitted) {
            updateMonthlyPredictionOneUser(user, response);
        }
    }

    private void updateMonthlyPredictionOneUser(User user, AISalesPredictDto response) {
        MonthlySalesPrediction monthlySalesPrediction = monthlySalesPredictionRepository.findByUserId(user.getId());
        monthlySalesPrediction.setThisMonthSalesPrediction(monthlySalesPrediction.getNextMonthSalesPrediction());
        monthlySalesPrediction.setNextMonthSalesPrediction(response.getNextMonthSalePrediction().intValue());
    }


}
