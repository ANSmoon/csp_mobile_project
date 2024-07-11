package com.MoReport.domain.menu.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.MoReport.domain.menu.domain.Menu;

public interface MenuRepository extends JpaRepository<Menu, Integer> {
	@Query("SELECT m FROM Menu m LEFT JOIN FETCH m.image WHERE m.menuName =:menuName")
	List<Menu> findAllByMenuName(@Param("menuName")String menuName);
}
