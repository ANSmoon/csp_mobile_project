package com.MoReport.domain.menuSales.api;

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

import com.MoReport.domain.menuSales.dto.MenuDiffDetailDto;
import com.MoReport.domain.menuSales.dto.MenuDiffDto;
import com.MoReport.domain.menuSales.dto.MenuSalesDto;
import com.MoReport.domain.menuSales.service.MenuSalesServiceImpl;
import com.MoReport.global.common.ResponseDto;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/menu")
public class MenuSalesController {
	
	private final MenuSalesServiceImpl menuSalesServiceImpl;
	
	@GetMapping("/daily-sales")
	public ResponseEntity<?> getDailyMenuSales(@RequestParam LocalDate date){
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String userId=authentication.getName();
		
		MenuSalesDto dayMenuSalesDto = menuSalesServiceImpl.getDailyMenuRanking(userId, date);
		ResponseDto<MenuSalesDto> responseDto= ResponseDto.<MenuSalesDto>builder()
				.success(true)
				.code(200)
				.message("daily-menu-sale success")
				.data(dayMenuSalesDto)
				.build();
		return new ResponseEntity<>(responseDto, HttpStatus.OK);
	}
	@GetMapping("/weekly-sales")
	public ResponseEntity<?> getWeeklySales(@RequestParam String dateString) throws UnsupportedEncodingException{
		dateString=URLDecoder.decode(dateString, "UTF-8");
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String userId=authentication.getName();
		MenuSalesDto weekMenuSalesDto = menuSalesServiceImpl.getWeeklyMenuRanking(userId, dateString);
		ResponseDto<MenuSalesDto> responseDto = ResponseDto.<MenuSalesDto>builder()
				.success(true)
				.code(200)
				.message("weekly-menu-sale success")
				.data(weekMenuSalesDto)
				.build();
		return new ResponseEntity<>(responseDto, HttpStatus.OK);
	}
	
	@GetMapping("/monthly-sales")
	public ResponseEntity<?> getMonthlySales(@RequestParam String dateString) throws UnsupportedEncodingException{
		dateString=URLDecoder.decode(dateString, "UTF-8");
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String userId=authentication.getName();
		MenuSalesDto monthMenuSalesDto = menuSalesServiceImpl.getMonthlyMenuRanking(userId, dateString);
		ResponseDto<MenuSalesDto> responseDto = ResponseDto.<MenuSalesDto>builder()
				.success(true)
				.code(200)
				.message("weekly-menu-sale success")
				.data(monthMenuSalesDto)
				.build();
		return new ResponseEntity<>(responseDto, HttpStatus.OK);
	}
	@GetMapping("/daily-sales/detail")
	public ResponseEntity<?> getDailyMenuSalesDetail(@RequestParam LocalDate date){
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String userId=authentication.getName();
		
		MenuSalesDto dayMenuSalesDto = menuSalesServiceImpl.getDailyMenuRankingDetail(userId, date);
		ResponseDto<MenuSalesDto> responseDto= ResponseDto.<MenuSalesDto>builder()
				.success(true)
				.code(200)
				.message("daily-menu-sale-detail success")
				.data(dayMenuSalesDto)
				.build();
		return new ResponseEntity<>(responseDto, HttpStatus.OK);
	}
	@GetMapping("/weekly-sales/detail")
	public ResponseEntity<?> getWeeklySalesDetail(@RequestParam String dateString) throws UnsupportedEncodingException{
		dateString=URLDecoder.decode(dateString, "UTF-8");
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String userId=authentication.getName();
		MenuSalesDto weekMenuSalesDto = menuSalesServiceImpl.getWeeklyMenuRankingDetail(userId, dateString);
		ResponseDto<MenuSalesDto> responseDto = ResponseDto.<MenuSalesDto>builder()
				.success(true)
				.code(200)
				.message("weekly-menu-sale-detail success")
				.data(weekMenuSalesDto)
				.build();
		return new ResponseEntity<>(responseDto, HttpStatus.OK);
	}
	
	@GetMapping("/monthly-sales/detail")
	public ResponseEntity<?> getMonthlySalesDetail(@RequestParam String dateString) throws UnsupportedEncodingException{
		dateString=URLDecoder.decode(dateString, "UTF-8");
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String userId=authentication.getName();
		MenuSalesDto monthMenuSalesDto = menuSalesServiceImpl.getMonthlyMenuRankingDetail(userId, dateString);
		ResponseDto<MenuSalesDto> responseDto = ResponseDto.<MenuSalesDto>builder()
				.success(true)
				.code(200)
				.message("weekly-menu-sale-detail success")
				.data(monthMenuSalesDto)
				.build();
		return new ResponseEntity<>(responseDto, HttpStatus.OK);
	}
	
	@GetMapping("/daily-diff")
	public ResponseEntity<?> getDailyMenuDiff(@RequestParam LocalDate date){
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String userId=authentication.getName();
		
		MenuDiffDto dayMenuDiffDto = menuSalesServiceImpl.getDailyMenuDiff(userId, date);
		ResponseDto<MenuDiffDto> responseDto = ResponseDto.<MenuDiffDto>builder()
				.success(true)
				.code(200)
				.message("dailly-menu-diff success")
				.data(dayMenuDiffDto)
				.build();
		
		return new ResponseEntity<>(responseDto,HttpStatus.OK);
	}
	
	@GetMapping("/weekly-diff")
	public ResponseEntity<?> getWeeklyMenuDiff(@RequestParam String dateString){
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String userId=authentication.getName();
		
		MenuDiffDto dayMenuDiffDto = menuSalesServiceImpl.getWeeklyMenuDiff(userId, dateString);
		ResponseDto<MenuDiffDto> responseDto = ResponseDto.<MenuDiffDto>builder()
				.success(true)
				.code(200)
				.message("weekly-menu-diff success")
				.data(dayMenuDiffDto)
				.build();
		
		return new ResponseEntity<>(responseDto,HttpStatus.OK);
	}
	
	@GetMapping("/monthly-diff")
	public ResponseEntity<?> getMonhtlyMenuDiff(@RequestParam String dateString){
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String userId=authentication.getName();
		
		MenuDiffDto monthMenuDiffDto = menuSalesServiceImpl.getMonthlyMenuDiff(userId, dateString);
		ResponseDto<MenuDiffDto> responseDto = ResponseDto.<MenuDiffDto>builder()
				.success(true)
				.code(200)
				.message("monthly-menu-diff success")
				.data(monthMenuDiffDto)
				.build();
		
		return new ResponseEntity<>(responseDto,HttpStatus.OK);
	}
	
	@GetMapping("/daily-diff/detail")
	public ResponseEntity<?> getDailyMenuDiffDetail(@RequestParam LocalDate date){
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String userId=authentication.getName();
		
		MenuDiffDetailDto dayMenuDiffDetailDto = menuSalesServiceImpl.getDailyMenuDiffDetail(userId, date);
		ResponseDto<MenuDiffDetailDto> responseDto = ResponseDto.<MenuDiffDetailDto>builder()
				.success(true)
				.code(200)
				.message("daily-menu-diff success")
				.data(dayMenuDiffDetailDto)
				.build();
		
		return new ResponseEntity<>(responseDto,HttpStatus.OK);
	}
	
	@GetMapping("/weekly-diff/detail")
	public ResponseEntity<?> getWeeklyMenuDiffDetail(@RequestParam String dateString){
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String userId=authentication.getName();
		
		MenuDiffDetailDto weekMenuDiffDetailDto = menuSalesServiceImpl.getWeeklyMenuDiffDetail(userId, dateString);
		ResponseDto<MenuDiffDetailDto> responseDto = ResponseDto.<MenuDiffDetailDto>builder()
				.success(true)
				.code(200)
				.message("weekly-menu-diff success")
				.data(weekMenuDiffDetailDto)
				.build();
		
		return new ResponseEntity<>(responseDto,HttpStatus.OK);
	}
	
	@GetMapping("/monthly-diff/detail")
	public ResponseEntity<?> getMonthlyMenuDiffDetail(@RequestParam String dateString){
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String userId=authentication.getName();
		
		MenuDiffDetailDto monthMenuDiffDetailDto = menuSalesServiceImpl.getMonthlyMenuDiffDetail(userId, dateString);
		ResponseDto<MenuDiffDetailDto> responseDto = ResponseDto.<MenuDiffDetailDto>builder()
				.success(true)
				.code(200)
				.message("monthly-menu-diff success")
				.data(monthMenuDiffDetailDto)
				.build();
		
		return new ResponseEntity<>(responseDto,HttpStatus.OK);
	}
	
}
