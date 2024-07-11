package com.MoReport.global.auth.controller;

import com.MoReport.global.auth.dto.CreateAccessTokenRequest;
import com.MoReport.global.auth.dto.CreateAccessTokenResponse;
import com.MoReport.global.auth.service.TokenService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
@RequiredArgsConstructor
@RestController
public class RefreshTokenApiController {
    private final TokenService tokenService;

    // 리프레시 토큰을 기반으로 새로운 엑세스 토큰을 만들어줌
    // 이후에는 그냥 평소하던대로 검증절차 거치면 되고, 혹시나 /api/token으로 요청이 날라오는 경우에는 refresh token을 확인하고 access만들어주면 됨
    @PostMapping("/api/token")
    public ResponseEntity<CreateAccessTokenResponse> createNewAccessToken(HttpServletRequest request) {
        String newAccessToken = tokenService.createNewAccessToken(request);
        //여기서 refresh 토큰을 쿠키에서 꺼내고 확인하는 로직이 필요함
        //유효한 refresh 토큰 -> access 토큰 재발급
        //유효하지 않은 refresh 토큰 -> 어떻겧 ㅏ지?
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new CreateAccessTokenResponse(newAccessToken));
    }
}
