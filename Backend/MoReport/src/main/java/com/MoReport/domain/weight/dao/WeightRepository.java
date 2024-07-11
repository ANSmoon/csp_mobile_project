package com.MoReport.domain.weight.dao;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.MoReport.domain.user.domain.User;
import com.MoReport.domain.weight.domain.Weight;

public interface WeightRepository extends JpaRepository<Weight,Integer>{
	Optional<Weight> findByUserAndDate(User user,LocalDate date);
}
