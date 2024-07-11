package com.MoReport.domain.menuSales.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MenuDiffDetail {
	private String menuName;
	private double changeRate;
	private long lastCount;
	private long thisCount;
	private long lastRevenue;
	private long thisRevenue;
}
