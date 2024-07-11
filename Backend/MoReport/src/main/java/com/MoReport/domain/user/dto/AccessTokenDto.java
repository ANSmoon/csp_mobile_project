package com.MoReport.domain.user.dto;

import lombok.Builder;
import lombok.Data;
@Builder
@Data
public class AccessTokenDto {
    private final Boolean success;
    private final Integer code;
    private final String message;
    private final String accessToken;
    private final String branchName;
}