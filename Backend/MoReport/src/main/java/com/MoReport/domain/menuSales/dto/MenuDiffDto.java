package com.MoReport.domain.menuSales.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MenuDiffDto {
	private MenuDiff best;
	private MenuDiff worst;
}
