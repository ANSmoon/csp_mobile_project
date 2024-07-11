package com.MoReport.domain.banner.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
@Getter
@RequiredArgsConstructor
public enum BannerState {
    USING("USING"),
    NOT_USING("NOT_USING");

    private final String stateName;
    public String getStateName(){

        return stateName;
    }

}
