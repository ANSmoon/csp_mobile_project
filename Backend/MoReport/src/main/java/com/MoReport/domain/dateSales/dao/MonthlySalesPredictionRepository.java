package com.MoReport.domain.dateSales.dao;

import com.MoReport.domain.dateSales.domain.DailySalesPrediction;
import com.MoReport.domain.dateSales.domain.MonthlySalesPrediction;
import com.MoReport.domain.dateSales.domain.WeeklySalesPrediction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MonthlySalesPredictionRepository extends JpaRepository<MonthlySalesPrediction, Integer> {
    MonthlySalesPrediction findByUserId(int userId);
}
