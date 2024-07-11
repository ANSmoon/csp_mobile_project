package com.MoReport.domain.menu.service;


import java.util.List;

import org.springframework.stereotype.Service;

import com.MoReport.domain.menu.dao.MenuRepository;
import com.MoReport.domain.menu.domain.Menu;
import com.MoReport.global.error.DataNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MenuService {
	private final MenuRepository menuRepository;
	
	public Menu findOneByMenuName(String menuName) {
		List<Menu> menuList = menuRepository.findAllByMenuName(menuName);
		if(menuList.size()==0)throw new DataNotFoundException("No data");
		Menu menu = menuList.get(0);
		return menu;
	}
}
