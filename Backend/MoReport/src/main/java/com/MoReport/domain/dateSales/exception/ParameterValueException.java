package com.MoReport.domain.dateSales.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;


import lombok.extern.slf4j.Slf4j;

@Slf4j
@ResponseStatus(value = HttpStatus.BAD_REQUEST, reason = "Invalid parameter value")
public class ParameterValueException extends RuntimeException{
	private static final long serialVersionUID = 1L;
	
	public ParameterValueException(String message) {
		super(message);
		log.error("[ParameterValueException] : Invalid parameter value");
	}
}
