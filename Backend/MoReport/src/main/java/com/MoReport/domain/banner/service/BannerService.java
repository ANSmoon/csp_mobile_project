package com.MoReport.domain.banner.service;

import com.MoReport.domain.banner.dto.BannerDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface BannerService {
    BannerDto getAllBanner();

    ResponseEntity uploadNewBanner(List<MultipartFile> files, String loginId, String bannerName);

    ResponseEntity deleteBanner(List<Integer> ids, String loginId);

    ResponseEntity changeBannersState(List<Integer> ids);

    BannerDto getUsingStateBanner();
}
