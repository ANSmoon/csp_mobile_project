package com.MoReport.domain.dateSales.dao;

import com.MoReport.domain.dateSales.domain.DailySalesPrediction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DailySalesPredictionRepository extends JpaRepository<DailySalesPrediction, Integer> {

    DailySalesPrediction findByUserId(int userId);
}
