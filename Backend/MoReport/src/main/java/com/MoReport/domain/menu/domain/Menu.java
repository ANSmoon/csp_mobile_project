package com.MoReport.domain.menu.domain;

import com.MoReport.domain.image.Image;
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
@Table(name = "Menu")
public class Menu {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@ManyToOne
	@JoinColumn(name = "user_id")
	private User user;
	
	@Column (name = "menu_name", nullable = false, unique = true)
	private String menuName;
	
	@Column (name = "price", nullable = false)
	private int price;
	@ManyToOne
	@JoinColumn (name = "image_id", nullable =true)
	private Image image;
	
}
