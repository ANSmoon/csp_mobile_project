package com.MoReport.domain.user.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum State {
    PERMITTED("PERMITTED"),
    WAITING_PERMISSION("WAITING_PERMISSION"),
    EXPIRED("EXPIRED");

    private final String stateName;
    public String getStateName(){
        return stateName;
    }
}
