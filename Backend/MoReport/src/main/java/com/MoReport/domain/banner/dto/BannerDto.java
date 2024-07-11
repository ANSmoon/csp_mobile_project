package com.MoReport.domain.banner.dto;

import com.MoReport.domain.banner.domain.Banner;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class BannerDto {
    List<Banner> banners;
}
