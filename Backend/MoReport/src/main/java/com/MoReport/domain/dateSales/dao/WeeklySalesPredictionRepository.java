package com.MoReport.domain.dateSales.dao;

import com.MoReport.domain.dateSales.domain.WeeklySalesPrediction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WeeklySalesPredictionRepository extends JpaRepository<WeeklySalesPrediction, Integer> {

    WeeklySalesPrediction findByUserId(int userId);
}
