package com.MoReport;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClient.ResponseSpec;

import com.MoReport.domain.dateSales.dto.DateSalesDto;
import com.MoReport.domain.dateSales.dto.PredictSalesDto;
import com.MoReport.domain.dateSales.service.DateSalesServiceImpl;
import com.MoReport.domain.dateSales.service.PredictSalesServiceImpl;
import com.MoReport.domain.menuSales.dto.MenuDiffDto;
import com.MoReport.domain.menuSales.dto.MenuSalesDto;
import com.MoReport.domain.menuSales.service.MenuSalesServiceImpl;
import com.MoReport.domain.user.service.UserServiceImpl;
import com.MoReport.global.common.ReportDto;
import com.MoReport.global.common.ResponseDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/report")
public class ReportController {

	private final DateSalesServiceImpl dateSalesServiceImpl;
	private final PredictSalesServiceImpl predictSalesServiceImpl;
	private final MenuSalesServiceImpl menuSalesServiceImpl;
	private final UserServiceImpl userServiceImpl;

	@GetMapping("/daily")
	public ResponseEntity<?> getDailyReport(@RequestParam LocalDate date) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String userId = authentication.getName();

		// 오늘 어제 매출 확인
		DateSalesDto dateSalesDto = dateSalesServiceImpl.getDailyRevenueDifference(userId, date);
		// 내일 메출예상 오늘 매출예상
		PredictSalesDto predictSalesDto = predictSalesServiceImpl.getDailyPredict(userId, date);
		// 가장 많이 팔린메뉴 3순위
		MenuSalesDto menuSalesDto = menuSalesServiceImpl.getDailyMenuRanking(userId, date);
		// 어제 대비 많이/적게 팔린 메뉴
		MenuDiffDto menuDiffDto = menuSalesServiceImpl.getDailyMenuDiff(userId, date);
		ReportDto reportDto = ReportDto.builder().dateSalesDto(dateSalesDto).predictSalesDto(predictSalesDto)
				.menuSalesDto(menuSalesDto).menuDiffDto(menuDiffDto).build();
		ResponseDto responseDto = ResponseDto.builder().success(true).code(200).message("daliyReport Success")
				.data(reportDto).build();

		return new ResponseEntity<>(reportDto, HttpStatus.OK);
	}

	@GetMapping("/weekly")
	public ResponseEntity<?> getWeeklyReport(@RequestParam String dateString) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String userId = authentication.getName();
		// 이번주 저번 주 매출 확인
		DateSalesDto dateSalesDto = dateSalesServiceImpl.getWeeklyRevenueDifference(userId, dateString);
		// 다음주 메출예상 이번주 매출예상
		PredictSalesDto predictSalesDto = predictSalesServiceImpl.getWeeklyPredict(userId, dateString);
		// 가장 많이 팔린메뉴 3순위
		MenuSalesDto menuSalesDto = menuSalesServiceImpl.getWeeklyMenuRanking(userId, dateString);
		// 지난 주 대비 많이/적게 팔린 메뉴
		MenuDiffDto menuDiffDto = menuSalesServiceImpl.getWeeklyMenuDiff(userId, dateString);
		ReportDto reportDto = ReportDto.builder().dateSalesDto(dateSalesDto).predictSalesDto(predictSalesDto)
				.menuSalesDto(menuSalesDto).menuDiffDto(menuDiffDto).build();
		ResponseDto responseDto = ResponseDto.builder().success(true).code(200).message("daliyReport Success")
				.data(reportDto).build();

		return new ResponseEntity<>(reportDto, HttpStatus.OK);
	}

	@GetMapping("/monthly")
	public ResponseEntity<?> getMonthlyReport(@RequestParam String dateString) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String userId = authentication.getName();
		// 이번 달 저번 달 매출 확인
		DateSalesDto dateSalesDto = dateSalesServiceImpl.getMonthlyRevenueDifference(userId, dateString);
		// 다음 달 메출예상 이번 달 매출예상
		PredictSalesDto predictSalesDto = predictSalesServiceImpl.getMonthlyPredict(userId, dateString);
		// 가장 많이 팔린메뉴 3순위
		MenuSalesDto menuSalesDto = menuSalesServiceImpl.getMonthlyMenuRanking(userId, dateString);
		// 지난 달 대비 많이/적게 팔린 메뉴
		MenuDiffDto menuDiffDto = menuSalesServiceImpl.getMonthlyMenuDiff(userId, dateString);
		ReportDto reportDto = ReportDto.builder().dateSalesDto(dateSalesDto).predictSalesDto(predictSalesDto)
				.menuSalesDto(menuSalesDto).menuDiffDto(menuDiffDto).build();
		ResponseDto responseDto = ResponseDto.builder().success(true).code(200).message("daliyReport Success")
				.data(reportDto).build();

		return new ResponseEntity<>(reportDto, HttpStatus.OK);

	}

	@GetMapping("/test")
	public String getDailyReportTest(@RequestParam LocalDate date) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String userId = authentication.getName();
		WebClient client = WebClient.create();
		PredictSalesDto predictSalesDto;
		int[] isError = { 0 };
		String url = "http://localhost:8080/helloTest";
//        Mono<ResponseEntity<String>> a=client.get().uri(url).retrieve().toEntity(String.class);
//        a.doOnError(result->{
//        	log.info("status : "+result.getMessage());
//        	isError[0]=1;
//        });
		Mono<ResponseEntity<String>> response = client.get().uri(url).retrieve().toEntity(String.class);

		Mono<String> responseBodyMono = response.onErrorResume(throwable -> {
			log.info("status : " + throwable.getMessage());
			isError[0] = 1;
			return Mono.empty(); // Return an empty Mono as a fallback
		}).flatMap(entity -> {
			if (isError[0] == 1) {
				return Mono.empty(); // Handle error with empty Mono
			}
			return Mono.just(entity.getBody());
		});

		String responseBody = responseBodyMono.block();
//        HttpStatusCode statusCode = response.toBodilessEntity().block().getStatusCode();
//        log.info("status"+statusCode);
//        if (statusCode == HttpStatus.NOT_FOUND) {
//            return null;
//        }
//
//        return response.bodyToMono(String.class).block();
		return null;
	}

}
