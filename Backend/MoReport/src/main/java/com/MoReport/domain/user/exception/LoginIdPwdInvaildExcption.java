package com.MoReport.domain.user.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.MoReport.global.error.DataNotFoundException;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@ResponseStatus(value = HttpStatus.UNAUTHORIZED, reason = "Id or Pwd invaild")
public class LoginIdPwdInvaildExcption extends RuntimeException {

	private static final long serialVersionUID = 1L;
	
	public LoginIdPwdInvaildExcption(String message){
		super(message);
		log.info("[LoginIdPwdInvaildExcption] : Id or Pwd invaild");
	}
}
