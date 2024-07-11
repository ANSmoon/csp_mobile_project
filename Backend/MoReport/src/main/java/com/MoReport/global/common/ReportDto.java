package com.MoReport.global.common;

import com.MoReport.domain.dateSales.dto.DateSalesDto;
import com.MoReport.domain.dateSales.dto.PredictSalesDto;
import com.MoReport.domain.menuSales.dto.MenuDiffDto;
import com.MoReport.domain.menuSales.dto.MenuSalesDto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReportDto {
	private DateSalesDto dateSalesDto;
	private PredictSalesDto predictSalesDto;
	private MenuSalesDto menuSalesDto;
	private MenuDiffDto menuDiffDto;
}
