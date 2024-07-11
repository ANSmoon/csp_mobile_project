package com.MoReport.domain.dateSales.domain;


import java.time.LocalDate;

import com.MoReport.domain.user.domain.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;

@Entity
@Getter
@Table(name = "DateSales")
public class DateSales {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "count")
    private int count;

    @Column(name = "total_revenue")
    private int totalRevenue;

    // Constructors, getters, and setters (You can generate these using IDE or Lombok)
}


