package com.MoReport.domain.menuSales.dto;

import com.MoReport.domain.menu.domain.Menu;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MenuCountResponseDto {
	private Menu menuName;
	private int count;
}
