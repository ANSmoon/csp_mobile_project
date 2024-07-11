package com.MoReport.global.error;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@ResponseStatus(value = HttpStatus.NOT_FOUND, reason = "data not found")
public class DataNotFoundException extends RuntimeException{
	private static final long serialVersionUID = 1L;
	
	public DataNotFoundException(String message) {
		super(message);
		log.error("[DataNotFoundException] : data not found exception");
	}
}
