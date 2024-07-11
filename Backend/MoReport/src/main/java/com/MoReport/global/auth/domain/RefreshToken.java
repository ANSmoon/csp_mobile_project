package com.MoReport.global.auth.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;
import org.springframework.data.redis.core.index.Indexed;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
@RedisHash("refreshToken")
public class RefreshToken {
    @Id
    private Long userId;

    @Indexed
    private String refreshToken;

    @TimeToLive
    private Long expiration;

    @Builder
    public RefreshToken(Long userId, String refreshToken, Long expiration) {
        this.userId = userId;
        this.refreshToken = refreshToken;
        this.expiration = expiration;
    }

}
