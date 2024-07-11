package com.MoReport;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.MoReport.global.common.ResponseDto;
import com.MoReport.global.error.DataNotFoundException;

import lombok.extern.slf4j.Slf4j;


@Slf4j
@RestController
public class TestController {
	@GetMapping("helloTest")
	public String getHello() {
		log.trace("helloTest 메서드 실행");
		log.info("helloTest 메서드 실행");
		throw new DataNotFoundException("");
//		return "Hello";
	}
	
	@PostMapping("responseDtoTest")
	public ResponseDto<String> getResponseDto() {
		ResponseDto<String> responseDto = ResponseDto.<String>builder()
				.success(true)
				.code(200)
				.message("good success, 한글도 잘 받아지네요! 현재시각 : "+LocalDate.now()+"/"+LocalTime.now())
				.build();
		return responseDto;
				
	}
	
	@GetMapping("listTest")
	public ResponseEntity<?> getList(){
		ArrayList<String> list =new ArrayList<String>();
		list.add("hello");
		list.add("world!");
		ResponseDto<ArrayList<String>> responseDto = ResponseDto.<ArrayList<String>>builder()
				.success(true)
				.code(200)
				.message("List도 잘 받아지네요!")
				.data(list)
				.build();
		return new ResponseEntity<>(responseDto,HttpStatus.OK);
	}
}
