package com.MoReport.domain.dateSales.domain;

import com.MoReport.domain.user.domain.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "WeeklySalesPrediction")
public class WeeklySalesPrediction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "this_week_sales_prediction")
    private int thisWeekSalesPrediction;

    @Column(name = "next_week_sales_prediction")
    private int nextWeekSalesPrediction;

}
