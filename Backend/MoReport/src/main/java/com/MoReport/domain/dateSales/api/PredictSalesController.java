package com.MoReport.domain.dateSales.api;

import java.time.LocalDate;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.MoReport.domain.dateSales.dto.PredictSalesDto;
import com.MoReport.domain.dateSales.service.PredictSalesServiceImpl;
import com.MoReport.domain.user.domain.User;
import com.MoReport.domain.user.service.UserServiceImpl;
import com.MoReport.domain.weight.service.WeightServiceImpl;
import com.MoReport.global.common.ResponseDto;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/predict")
public class PredictSalesController {
	
	private final PredictSalesServiceImpl predictSalesServiceImpl;
	private final WeightServiceImpl weightServiceImpl;
	private final UserServiceImpl userServiceImpl;
	@GetMapping("/daily")
	public ResponseEntity<?> getDailySales(@RequestParam LocalDate date) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String userId=authentication.getName();
		
		PredictSalesDto predictSalesDto = predictSalesServiceImpl.getDailyPredict(userId, date);
		ResponseDto<PredictSalesDto> responseDto = ResponseDto.<PredictSalesDto>builder()
				.success(true)
				.code(200)
				.message("success")
				.data(predictSalesDto)
				.build();
		return new ResponseEntity<>(responseDto, HttpStatus.OK);
	}
	
	@GetMapping("/weekly")
	public ResponseEntity<?> getWeeklySales(@RequestParam String dateString) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String userId=authentication.getName();
		
		PredictSalesDto predictSalesDto = predictSalesServiceImpl.getWeeklyPredict(userId, dateString);
		ResponseDto<PredictSalesDto> responseDto = ResponseDto.<PredictSalesDto>builder()
				.success(true)
				.code(200)
				.message("success")
				.data(predictSalesDto)
				.build();
		return new ResponseEntity<>(responseDto, HttpStatus.OK);
	}
	
	@GetMapping("/monthly")
	public ResponseEntity<?> getMonthlySales(@RequestParam String dateString) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String userId=authentication.getName();
		
		PredictSalesDto predictSalesDto = predictSalesServiceImpl.getMonthlyPredict(userId, dateString);
		ResponseDto<PredictSalesDto> responseDto = ResponseDto.<PredictSalesDto>builder()
				.success(true)
				.code(200)
				.message("success")
				.data(predictSalesDto)
				.build();
		return new ResponseEntity<>(responseDto, HttpStatus.OK);
	}
	
	@GetMapping("/daily-test")
	public ResponseEntity<?> getDailyPredict(@RequestParam LocalDate date) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String userId=authentication.getName();
		User user = userServiceImpl.getUserByLoginId(userId);
		Long predict = weightServiceImpl.getPredictRevenueByUserAndDate(user, date);
		ResponseDto<Long> responseDto = ResponseDto.<Long>builder()
				.success(true)
				.code(200)
				.message("success")
				.data(predict)
				.build();
		return new ResponseEntity<>(responseDto, HttpStatus.OK);
	}
	
}
