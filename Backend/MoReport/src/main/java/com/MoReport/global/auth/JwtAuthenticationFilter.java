package com.MoReport.global.auth;

import java.io.IOException;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;


@Slf4j
@RequiredArgsConstructor
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {


	private final TokenProvider tokenProvider;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
		try {
			// 리퀘스트에서 토큰 가져오기.
			log.info("Filter is running...");
			//헤더에서 토큰 추출
			String token = parseBearerToken(request);
			
			// 토큰 검사하기. JWT이므로 인가 서버에 요청 하지 않고도 검증 가능.
			if (token != null && !token.equalsIgnoreCase("null")) {

				// userId 가져오기(토큰에서). 위조 된 경우 예외 처리 된다.
				String userId = tokenProvider.validateAndGetUserId(token);
				log.info("Authenticated user ID : " + userId );

				//보통 토큰에서 검증할 때, 권한도 같이 가져온다.
				//
				// 인증 완료; SecurityContextHolder에 등록해야 인증된 사용자라고 생각한다.
				//스프링 시큐리티의 객체 : UsernamePasswordAuthenticationToken
				//Principal Credential 기반의 인증방식
//				AbstractAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
//								userId, // 인증된 사용자의 정보. 문자열이 아니어도 아무거나 넣을 수 있다.
//								null, //
//								AuthorityUtils.createAuthorityList("ROLE_ADMIN")
//				);
				AbstractAuthenticationToken authentication=tokenProvider.getAuthentication(token);

				authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
				SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
				securityContext.setAuthentication(authentication);
				SecurityContextHolder.setContext(securityContext);
			}
			else {
				log.info("token = "+token);
			}
		} catch (Exception ex) {
			log.info("No Token");
			logger.error("Could not set user authentication in security context", ex);
		}

		filterChain.doFilter(request, response);
	}

	private String parseBearerToken(HttpServletRequest request){
		// Http 리퀘스트의 헤더를 파싱해 Bearer 토큰을 리턴한다.
		String bearerToken = request.getHeader("Authorization");

		if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
			//"Bearer "을 떼어내고 리턴함.
			return bearerToken.substring(7);
		}
		return null;
	}
}
