package com.MoReport.domain.banner.dao;

import com.MoReport.domain.banner.domain.Banner;
import com.MoReport.domain.banner.domain.BannerState;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BannerRepository extends JpaRepository<Banner, Integer> {
    List<Banner> findAll();
    List<Banner> findBannersByState(BannerState state);
    Optional<Banner> getBannerById(int id);
}
