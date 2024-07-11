package com.MoReport.domain.menuSales.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RankedMenu{
	private int rank;
	private String menuName;
	private long count;
	private long totalRevenue;
	private String imageUrl;
	private int rankChange;
	private boolean isNew;
}
