package com.MoReport.domain.image;

import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


@RequiredArgsConstructor
@RestController //자리변경
public class ImageContorller {

	private final ImageServiceImpl imageServiceImpl;

	/*
	 * login-id는 사업자 등록번호, 즉 로그인아이디
	 */
	@PutMapping("image/{login-id}/{type}")
	public String postImage(@PathVariable("login-id") @Positive String memberId,
			@RequestParam(value = "file") List<MultipartFile> file, @PathVariable("type") @Positive String type) {

		String url = imageServiceImpl.uploadFile(file, memberId, type);
		
		return url;
	}

	/*
	 * image를 s3에 삽입하면서 기존 광명하안점의 이미지 file_path를 s3의 image url로 변경 
	 */
	@PostMapping("images/{login-id}")
	public String updateImages(@PathVariable("login-id") @Positive String loginId,
			@RequestParam(value = "file") List<MultipartFile> files) {
		String url = imageServiceImpl.updateImages(files, loginId);
		return url;
	}
	
}
