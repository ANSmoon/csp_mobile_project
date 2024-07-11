package com.MoReport.domain.banner.api;

import com.MoReport.domain.banner.dto.BannerDto;
import com.MoReport.domain.banner.service.BannerServicesImpl;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/banner")
public class BannerController {

    private final BannerServicesImpl bannerServiceImpl;

    @PostMapping("{login-id}/{bannerName}")
    public ResponseEntity<?> postBanner(@PathVariable("login-id") @Positive String memberId,
                                        @PathVariable("bannerName") @Positive String bannerName,
                                     @RequestParam(value = "file") List<MultipartFile> file) {

        return bannerServiceImpl.uploadNewBanner(file, memberId, bannerName);
    }

    @PutMapping()
    public ResponseEntity<?> updateBannerState(@RequestBody List<Integer> ids) {

        return bannerServiceImpl.changeBannersState(ids);
    }

    @GetMapping()
    public ResponseEntity<?> getAllBanners(){
        BannerDto bannerDto = this.bannerServiceImpl.getAllBanner();

        return ResponseEntity.ok(bannerDto);
    }

    @GetMapping("{using}")
    public ResponseEntity<?> getUsingBanners(){
        BannerDto bannerDto = this.bannerServiceImpl.getUsingStateBanner();

        return ResponseEntity.ok(bannerDto);
    }

    @DeleteMapping()
    public ResponseEntity<?> deleteBanners(@RequestBody List<Integer> ids){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String adminId=authentication.getName();

        return bannerServiceImpl.deleteBanner(ids,adminId);
    }

}
