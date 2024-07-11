package com.MoReport.domain.dateSales.dto;

import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PredictSalesDto {
	private int prePredictRevenue;
	private int nextPredictRevenue;
	private List<Integer> preRevenueList;
}
