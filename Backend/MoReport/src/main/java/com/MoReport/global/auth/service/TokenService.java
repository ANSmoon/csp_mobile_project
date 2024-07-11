package com.MoReport.global.auth.service;

import com.MoReport.domain.user.domain.User;
import com.MoReport.domain.user.service.UserServiceImpl;
import com.MoReport.global.auth.TokenProvider;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
@RequiredArgsConstructor
@Service
public class TokenService {
    //토큰을 생성해주기 위함
    private final TokenProvider tokenProvider;

    //RefreshToken이 있는지 확인하기 위함
    //만드는 건 RefreshToken에서 하지 않음!
    private final RefreshTokenService refreshTokenService;

    //유저 id에 해당하는 유저가 있는지 탐색
    private final UserServiceImpl userService;

    // client <-> resource server(토큰 전체적 다룸) <-> auth server(RefreshToken) 느낌
    //일단 resource server를 거치고 확인해서, refreshToken을 활용해 auth server에서 토큰을 발급하거나
    //resource server에서 JWT인증을 끝내거나
    public String createNewAccessToken(HttpServletRequest request) {

        String refreshToken = getCookieValue(request);

        if (refreshToken==null) {
            throw new IllegalArgumentException("There's no cookie");
        }

        // refresh 토큰이 유효한 토큰이 아니면 예외 발생
        if(!tokenProvider.validToken(refreshToken)) {
            throw new IllegalArgumentException("Unexpected token");
        }

        // refreshToken이 유효하다면
        // String을 활용해서 RefreshToken 객체를 받고, 거기서 user ID를 얻어냄
        Long userId = refreshTokenService.findByRefreshToken(refreshToken).getUserId();

        //유저 id로 User를 얻어냄
        User user = userService.findById(userId);

        //user에 해당하는 토큰을 생성해서 리턴 (AccessToken을 리턴하는 것)
        return tokenProvider.createAccessToken(user);
    }

    private String getCookieValue(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies!=null){
            for (Cookie cookie : cookies){
                if (cookie.getName().equals("refreshToken")){
                    return cookie.getValue();
                }
            }
        }

        return null;
    }

}
