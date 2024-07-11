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
@Table(name = "MonthlySalesPrediction")
public class MonthlySalesPrediction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "this_month_sales_prediction")
    private int thisMonthSalesPrediction;

    @Column(name = "next_month_sales_prediction")
    private int nextMonthSalesPrediction;
}
