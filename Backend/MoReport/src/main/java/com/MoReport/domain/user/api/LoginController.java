package com.MoReport.domain.user.api;

//import io.netty.handler.codec.http.cookie.Cookie;
import com.MoReport.domain.user.dto.*;
import com.MoReport.domain.user.service.LoginService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.MoReport.domain.user.service.LoginServiceImpl;
import com.MoReport.domain.user.service.UserServiceImpl;
import com.MoReport.global.auth.TokenProvider;
import com.MoReport.global.common.ResponseDto;

import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Slf4j
@RestController
@RequiredArgsConstructor
public class LoginController {

	private final LoginServiceImpl loginServiceImpl;

	@PostMapping("/regist")
	public ResponseEntity<?> regist(@RequestBody SignupRequestDto signupDto) {
		log.info("request : " + signupDto.getBranchName());
		loginServiceImpl.regist(signupDto);
		ResponseDto<?> responseDto = ResponseDto.builder().code(200).success(true).message("비밀번호 암호화 후 등록완료").build();

		log.info("비밀번호 암호화 후 등록 성공");
		return new ResponseEntity<>(responseDto, HttpStatus.OK);

	}

	//토큰을 body에 싣고 보냄
	//refresh쓴다면 고쳐야 함->httpOnly Cookie로 response에 달아서 보내기
	//이후에는 그냥 평소하던대로 검증절차 거치면 되고, 혹시나 /api/token으로 요청이 날라오는 경우에는 refresh token을 확인하고 access만들어주면 됨
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginRequestDto loginDto, HttpServletResponse response) {
		//토큰값과 매장명이 들어있는 dto
		LoginResponseDto LoginresponseDto = loginServiceImpl.login(loginDto);
		AccessTokenDto accessTokenDto = AccessTokenDto.builder().code(200).success(true).message("login success")
				.accessToken(LoginresponseDto.getAccessToken())
				.branchName(LoginresponseDto.getBranchName())
				.build();

		ResponseCookie cookie = ResponseCookie.from("refreshToken", LoginresponseDto.getRefreshToken())
				// 토큰의 유효 기간
				.maxAge(7 * 24 * 60 * 60)
				.path("/")
				// https 환경에서만 쿠키가 발동합니다.
//				.secure(true) .secure(true)는 로컬에서는 정상적으로 작동하지만, EC2에서는 작동 안 함 -> Localhost, HTTPS만 지원
				// 동일 사이트과 크로스 사이트에 모두 쿠키 전송이 가능합니다
			//	.sameSite("None")
				.httpOnly(true)
				// 브라우저에서 쿠키에 접근할 수 없도록 제한
				.build();
		response.setHeader("Set-Cookie", cookie.toString());
		response.setHeader("Access-Control-Allow-Credentials","true");
		return new ResponseEntity<>(accessTokenDto, HttpStatus.OK);
	}

	@PreDestroy
	public void cleanup() {
		// WebClient 리소스 정리
		loginServiceImpl.cleanup();
	}
}
