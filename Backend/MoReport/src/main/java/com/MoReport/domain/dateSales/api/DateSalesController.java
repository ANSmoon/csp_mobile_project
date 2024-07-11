package com.MoReport.domain.dateSales.api;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.time.LocalDate;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.MoReport.domain.dateSales.dto.DateSalesDto;
import com.MoReport.domain.dateSales.service.DateSalesServiceImpl;
import com.MoReport.global.common.ResponseDto;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/date")
public class DateSalesController {
	
	private final DateSalesServiceImpl dateSalesServiceImpl;
	
	
	@GetMapping("/daily-sales")
	public ResponseEntity<?> getDailySales(@RequestParam LocalDate date) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String userId=authentication.getName();
		DateSalesDto daySalesDto = dateSalesServiceImpl.getDailyRevenueDifference(userId, date);
		ResponseDto<DateSalesDto> responseDto = ResponseDto.<DateSalesDto>builder()
				.success(true)
				.code(200)
				.message("success")
				.data(daySalesDto)
				.build();
		return new ResponseEntity<>(responseDto, HttpStatus.OK);
	}
	
	@GetMapping("/weekly-sales")
	public ResponseEntity<?> getWeeklySales(@RequestParam String dateString) throws UnsupportedEncodingException{
		dateString=URLDecoder.decode(dateString, "UTF-8");
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String userId=authentication.getName();
		DateSalesDto weekSalesDto = dateSalesServiceImpl.getWeeklyRevenueDifference(userId, dateString);
		ResponseDto<DateSalesDto> responseDto = ResponseDto.<DateSalesDto>builder()
				.success(true)
				.code(200)
				.message("success")
				.data(weekSalesDto)
				.build();
		return new ResponseEntity<>(responseDto, HttpStatus.OK);
	}

	@GetMapping("/monthly-sales")
	public ResponseEntity<?> getMonthlySales(@RequestParam String dateString) throws UnsupportedEncodingException{
		dateString=URLDecoder.decode(dateString, "UTF-8");
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String userId=authentication.getName();
		
		DateSalesDto monthSalesDto = dateSalesServiceImpl.getMonthlyRevenueDifference(userId, dateString);
		ResponseDto<DateSalesDto> responseDto = ResponseDto.<DateSalesDto>builder()
				.success(true)
				.code(200)
				.message("success")
				.data(monthSalesDto)
				.build();
		return new ResponseEntity<>(responseDto, HttpStatus.OK);
	}
}
