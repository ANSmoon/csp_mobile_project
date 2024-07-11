package com.MoReport.domain.user.dao;

import com.MoReport.domain.user.domain.State;
import com.MoReport.domain.user.domain.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository<T> extends JpaRepository<User,Long> {
	//생성
	//검색
	Optional<T> findByLoginId(String name);
	//수정
	//삭제
	List<String> findEmailsByState(State state);

	List<User> findByState(State state);
}
