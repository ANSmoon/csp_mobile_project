package com.MoReport.domain.image;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ImageService {
	/**
	 * 메뉴의 이미지 리스트를 Amazon S3 저장소에 저장합니다.
	 * 그와 동시에 DB에 Image 레코드를 저장합니다.
	 * 마지막에 저장된 이미지의 url을 반환합니다. (확인용)
	 * @author ehtjsv2
	 * @param file - List[MultipartFile] : DB와 S3에 저장할 이미지 MultipartFile
	 * @param loginId - String : 유저의 로그인 ID(사업자 번호) 입니다
	 */
	String uploadFile(List<MultipartFile> file, String loginId, String type);
	/**
	 * 어떤 메뉴의 이미지를 변경해야하는 경우에 사용합니다. !주의! 이미지명(originalFileName)이 같아야합니다.
	 * @author ehtjsv2
	 * @param file - List[MultipartFile] : 변경하고 싶은 이미지 MultipartFile
	 * @param loginId - String : 유저의 로그인 ID(사업자 번호) 입니다
	 */
	String updateImages(List<MultipartFile> file, String loginId);
	void deleteImages(Image image, String loginId, String type);
}
