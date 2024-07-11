package com.MoReport.domain.dateSales.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DateSalesDto {
	private int thisSales;
	private int previousSales;
	private int diffSales;
}
