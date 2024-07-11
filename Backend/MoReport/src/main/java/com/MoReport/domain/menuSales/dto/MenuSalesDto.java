package com.MoReport.domain.menuSales.dto;

import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MenuSalesDto {
	private List<RankedMenu> menus;
}