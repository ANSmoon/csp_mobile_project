package com.MoReport.domain.menuSales.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuDiff {
	private String menuName;
	private double changeRate;
	private Long changeRevenue;
	private String imageUrl;
}
