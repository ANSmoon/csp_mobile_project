package com.MoReport.domain.dateSales.scheduler;

import com.MoReport.domain.dateSales.dao.WeeklySalesPredictionRepository;
import com.MoReport.domain.dateSales.dto.AISalesPredictDto;
import com.MoReport.domain.dateSales.service.PredictSalesService;
import com.MoReport.domain.user.dao.UserRepository;
import com.MoReport.domain.user.domain.State;
import com.MoReport.domain.user.domain.User;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Slf4j
@RequiredArgsConstructor
@Component
public class PredictionScheduler {
    private final UserRepository userRepository;
    private final WeeklySalesPredictionRepository weeklySalesPredictionRepository;
    private final PredictSalesService predictSalesService;
    private final String url = "http://52.79.95.147:8000/predict";

    @Scheduled(cron = "0 0 22 * * ?", zone = "Asia/Seoul")  // 매일 22시에 실행, 서울 기준
    public void schedulePredictionUpdate() {
        //사용 유저 받고,
        List<User> usersWhoPermitted = userRepository.findByState(State.PERMITTED);

        String formattedDate = getFormattedToday();
        AISalesPredictDto response = getPrediction(formattedDate);

        //그 prediction을 통해 prediction DB를 업데이트 한다.
        predictSalesService.updateDailyPredictionAllUsers(usersWhoPermitted, response);

        //토요일이라면 주간 예측 업데이트
        if (isSaturday()) {
            predictSalesService.updateWeeklyPredictionAllUsers(usersWhoPermitted, response);
        }

        if (isLastDayOfMonth()) {
            AISalesPredictDto monthlyResponse = getPredictionMonthly(formattedDate);
            predictSalesService.updateMonthlyPredictionAllUsers(usersWhoPermitted, monthlyResponse);
        }

    }

    private boolean isSaturday() {
        LocalDate currentDate = LocalDate.now();
        return currentDate.getDayOfWeek().getValue() == DayOfWeek.SATURDAY.getValue();
    }

    private boolean isLastDayOfMonth() {
        LocalDate currentDate = LocalDate.now();
        return currentDate.getDayOfMonth() == currentDate.lengthOfMonth();
    }

    // AI서버로 요청해서 예측값을 받아옴
    private AISalesPredictDto getPrediction(String formattedDate) {
        WebClient webClient = WebClient.create();
        AISalesPredictDto response = webClient.get()
                .uri(url + "?date=" + formattedDate)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(AISalesPredictDto.class)
                .block();
        return response;
    }

    private AISalesPredictDto getPredictionMonthly(String formattedDate) {
        WebClient webClient = WebClient.create();
        AISalesPredictDto response = webClient.get()
                .uri(url + "-monthly" + "?date=" + formattedDate)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(AISalesPredictDto.class)
                .block();
        return response;
    }

    private String getFormattedToday() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        return LocalDate.now().format(formatter);
    }
}
