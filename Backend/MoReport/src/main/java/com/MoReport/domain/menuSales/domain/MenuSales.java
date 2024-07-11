package com.MoReport.domain.menuSales.domain;

import java.time.LocalDate;

import com.MoReport.domain.menu.domain.Menu;
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
@Table(name = "MenuSales")
public class MenuSales {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@ManyToOne
	@JoinColumn(name = "user_id", nullable = false)
	private User user;
	
	@Column(name = "date", nullable = false)
	private LocalDate date;
	
	@ManyToOne
	@JoinColumn(name = "menu_id", nullable = false)
	private Menu menu;
	
	@Column(name = "count", nullable = false)
	private int count;
	
}
