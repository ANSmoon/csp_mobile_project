package com.MoReport.domain.user.service;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.reactive.function.client.WebClient;

import com.MoReport.domain.user.dto.LoginRequestDto;
import com.MoReport.domain.user.dto.LoginResponseDto;
import com.MoReport.domain.user.dto.MokiLoginResponseDto;
import com.MoReport.domain.user.dto.SignupRequestDto;

import reactor.core.publisher.Mono;

public interface LoginService {
	/**
	 * 실제 서비스에서는 사용하지 않는 메서드 입니다. 수동으로 아이디와 비밀번호를 등록하고 싶을 때 사용
	 * @author ehtjsv2
	 * @param signupDto - signupRequestDto : branchName, ID, PW를 담고 있습니다.
	 */
	public void regist(SignupRequestDto signupDto);
	/**
	 * 로그인 함수입니다. 토큰과 지점명을 반환합니다. 매니저서버의 로그인 API를 사용합니다. 최초 로그인 시 Report서버에 로그인 정보를 저장합니다. 더 자세한 정보는 '로그인 과정' 문서를 참조해 주십시오.
	 * @author ehtjsv2
	 * @param loginDto - LoginRequestDto : ID(사업자번호)와 PW를 담고 있습니다.
	 */
	public LoginResponseDto login(LoginRequestDto loginDto);
	    
}
