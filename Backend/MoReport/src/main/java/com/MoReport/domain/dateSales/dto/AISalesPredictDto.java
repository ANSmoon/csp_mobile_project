package com.MoReport.domain.dateSales.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AISalesPredictDto {
    private List<Double> mean;

    public Double get(int index) {
        return mean.get(index);
    }

    public Double getTomorrowSalePrediction() {
        return mean.get(0);
    }

    public Long getNextWeekSalePrediction() {
        Double sum = 0.0;
        for (int i = 0; i < 7; i++) {
            sum += mean.get(i);
        }
        return sum.longValue();
    }

    public Long getNextMonthSalePrediction() {
        Double sum = 0.0;
        for (int i = 0; i < 30; i++) {
            sum += mean.get(i);
        }
        return sum.longValue();
    }
}
