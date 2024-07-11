package com.MoReport.domain.weight.domain;

import java.math.BigDecimal;
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
import lombok.Setter;

@Entity
@Setter
@Getter
@Table(name = "Weight")
public class Weight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "next_weight", nullable = false, precision = 5, scale = 2)
    private BigDecimal nextWeight;

    @Column(name = "predict_revenue", nullable = false)
    private Long predictRevenue;

    // Constructors, getters, setters (You can generate these using IDE or Lombok)
}


