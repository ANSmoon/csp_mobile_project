package com.MoReport.domain.weight.dto;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class WeightSetDto {
	private BigDecimal sunday;
	private BigDecimal monday;
	private BigDecimal tuesday;
	private BigDecimal wensday;
	private BigDecimal thursday;
	private BigDecimal friday;
	private BigDecimal saturday;
}
