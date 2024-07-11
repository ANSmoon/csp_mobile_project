package com.MoReport.domain.banner.service;

import com.MoReport.domain.banner.dao.BannerRepository;
import com.MoReport.domain.banner.domain.Banner;
import com.MoReport.domain.banner.domain.BannerState;
import com.MoReport.domain.banner.dto.BannerDto;
import com.MoReport.domain.image.Image;
import com.MoReport.domain.image.ImageRepository;
import com.MoReport.domain.image.ImageService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
public class BannerServicesImpl implements BannerService {

    private final BannerRepository bannerRepository;
    private final ImageService imageService;
    private final ImageRepository imageRepository;
    @Override
    public BannerDto getAllBanner() {

        List<Banner> bannerList = this.bannerRepository.findAll();

        return BannerDto.builder().banners(bannerList).build();
    }

    @Override
    public ResponseEntity uploadNewBanner(List<MultipartFile> files, String loginId, String bannerName) {

        String url = this.imageService.uploadFile(files, loginId, "banner");
        Image image = this.imageRepository.findImageByFilePath(url).get();
        Banner newBanner = new Banner();
        newBanner.setBannerName(bannerName);
        newBanner.setImage(image);
        newBanner.setState(BannerState.NOT_USING);

        bannerRepository.save(newBanner);


        return ResponseEntity.ok(HttpStatus.CREATED);
    }

    @Override
    @Transactional
    public ResponseEntity deleteBanner(List<Integer> ids, String loginId) {
        for(Integer e : ids){
            if(bannerRepository.getBannerById(e) != null){
                Banner banner = bannerRepository.getBannerById(e).orElseThrow();
                Image image = banner.getImage();

                this.bannerRepository.deleteById(e);
                this.imageService.deleteImages(image, loginId, "banner");

                return ResponseEntity.ok(HttpStatus.OK);
            }
            else{
                log.info("banner not found");
                return null;
            }
        }
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @Override
    public ResponseEntity changeBannersState(List<Integer> ids) {

        for(Integer e : ids){
            updateBannerState(e);
        }
        return ResponseEntity.ok(HttpStatus.ACCEPTED);
    }

    @Override
    public BannerDto getUsingStateBanner() {
        List<Banner> bannerList = this.bannerRepository.findBannersByState(BannerState.USING);

        return BannerDto.builder().banners(bannerList).build();
    }

    public Banner updateBannerState(int id) {
        Optional<Banner> banner = this.bannerRepository.getBannerById(id);

        Banner changedBanner = banner.get();
        if(changedBanner.getState() == BannerState.NOT_USING){
            changedBanner.setState(BannerState.USING);
        }
        else{
            changedBanner.setState(BannerState.NOT_USING);
        }

        changedBanner = this.bannerRepository.save(changedBanner);
        return changedBanner;
    }
}
