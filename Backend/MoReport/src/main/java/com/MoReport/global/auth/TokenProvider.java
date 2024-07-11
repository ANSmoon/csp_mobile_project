package com.MoReport.global.auth;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

import com.MoReport.domain.user.domain.Role;
import com.MoReport.domain.user.domain.User;
import com.MoReport.domain.user.service.UserServiceImpl;
import com.MoReport.global.auth.dao.RefreshTokenRepository;
import com.MoReport.global.auth.domain.RefreshToken;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class TokenProvider {
	@Value("${key}")
	private String SECRET_KEY;

	private final UserServiceImpl userService;
	private final RefreshTokenRepository refreshTokenRepository;

	//로그인 성공시, id에 해당하는 토큰 생성 후 발급
	//현재 토큰 발급 로그인시에만 진행
	//리프레시로 바꾸려면 로그인시에는, refresh + acceess반환해주고
	// access만 만드는 함수 필요함
	public String createAccessToken(User user) {
		Date expityDate = Date.from(
				Instant.now()
				.plus(30,ChronoUnit.MINUTES));

		return Jwts.builder()
				.signWith(SignatureAlgorithm.HS512, SECRET_KEY)
				.setSubject(user.getLoginId()) //.claim("key",value)식으로 토큰에 설정 추가할 수 있음.
				.setIssuer("Moki Report")
				.setIssuedAt(new Date())
				.claim("state",user.getState())
				.claim("role",user.getRole())
				.setExpiration(expityDate)
				.compact();
		 
	}

	public String createRefreshToken(User user) {
		Date expityDate = Date.from(
				Instant.now()
						.plus(6,ChronoUnit.HOURS));

		String refreshToken = Jwts.builder()
				.signWith(SignatureAlgorithm.HS512, SECRET_KEY)
				.setSubject(user.getLoginId()) //.claim("key",value)식으로 토큰에 설정 추가할 수 있음.
				.setIssuedAt(new Date())
				.setExpiration(expityDate)
				.compact();


		refreshTokenRepository.save(new RefreshToken((long)user.getId(),refreshToken, 21600L));
		return refreshToken;
	}


	public String validateAndGetUserId(String token) {
		Claims claims = Jwts.parser()
				.setSigningKey(SECRET_KEY) //서명키를 활용해서 id를 추출할 수 있다.
				.parseClaimsJws(token)
				.getBody();
		//위 로직에서 id는 바로 알 수 있는데도 secret_key로 유효성 검증을 하는 이유
		// ---> JWT의 무결성 확인 가능
		return claims.getSubject();
	}

	public UsernamePasswordAuthenticationToken getAuthentication(String token){
		Claims claims = Jwts.parser()
				.setSigningKey(SECRET_KEY) //서명키를 활용해서 id를 추출할 수 있다.
				.parseClaimsJws(token)
				.getBody();

		User user = userService.getUserByLoginId(claims.getSubject());
		if (user.getRole()== Role.ROLE_USER) {
			log.info("role == user");
			return new UsernamePasswordAuthenticationToken(claims.getSubject(), null, AuthorityUtils.createAuthorityList("ROLE_USER"));
		}
		else return new UsernamePasswordAuthenticationToken(claims.getSubject(),null,AuthorityUtils.createAuthorityList("ROLE_ADMIN"));
		//위 로직에서 id는 바로 알 수 있는데도 secret_key로 유효성 검증을 하는 이유
		// ---> JWT의 무결성 확인 가능

	}


	public boolean validToken(String token) {
		try {
			Jwts.parser()
					.setSigningKey(SECRET_KEY)
					.parseClaimsJws(token);

			return true;
		} catch (Exception e) {
			return false;
		}
	}
}
