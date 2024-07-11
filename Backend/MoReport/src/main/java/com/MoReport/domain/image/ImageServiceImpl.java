package com.MoReport.domain.image;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

import com.amazonaws.services.s3.model.DeleteBucketRequest;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.MoReport.global.error.DataNotFoundException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Slf4j
@Repository
@Service
@RequiredArgsConstructor
public class ImageServiceImpl implements ImageService {
	private final ImageRepository imageRepository;

	private final AmazonS3 s3Client;

	private final String TEMP_DIR = System.getProperty("java.io.tmpdir");

	//얘가 문제다.
	@Value("${application.bucket.name}")
	private String bucketName;



	@Override
	public String uploadFile(List<MultipartFile> files, String loginId, String type) {
		String url="";
		for(MultipartFile file : files) {
			File fileObj = convertMultiPartFileToFile(file);
			String fileName = type + "/" + loginId + "/" + file.getOriginalFilename();
			s3Client.putObject(new PutObjectRequest(bucketName, fileName, fileObj));
			fileObj.delete();
			url = "" + s3Client.getUrl(bucketName, fileName);
			
			Image image = convertMultiPartFileToImage(file, url);
			this.imageRepository.save(image);
		}
		return url;
	}
	
	@Override
	public String updateImages(List<MultipartFile> files, String loginId) {
        String url = "";

        for (MultipartFile file : files) {
            File fileObj = convertMultiPartFileToFile(file);
            String fileName = file.getOriginalFilename() + loginId;
            s3Client.putObject(new PutObjectRequest(bucketName, fileName, fileObj));
            fileObj.delete();

            url = "" + s3Client.getUrl(bucketName, fileName);

            Optional<Image> opImage = imageRepository.findByOriginalFileName(file.getOriginalFilename());
            if (!opImage.isPresent()) {
                throw new DataNotFoundException("no data");
            }
            Image image = opImage.get();
            image.setFilePath(url);
            imageRepository.save(image);
        }

        return url;
    }

	/**
	 * MultipartFile을 Image객체로 변환해줍니다. Image객체의 속성 중 filePath에 들어갈 filePath도 인자로 주어야 합니다.
	 * @author ehtjsv2
	 * @param file - MultipartFile : 변환할 이미지 파일입니다.
	 * @param filePath : S3에 저장된 이미지파일의 경로입니다.
	 */
	public Image convertMultiPartFileToImage(MultipartFile file,String filePath) {
		Image image = new Image();
		image.setFilePath(filePath);
		image.setFileSize(file.getSize());
		image.setOriginalFileName(file.getOriginalFilename());
		return image;
	}
	/**
	 * MultipartFile을 File 타입으로 변환하여 반환합니다.
	 * @author ehtjsv2
	 * @param file - MultipartFile : 변환할 MultipartFile
	 */
	private File convertMultiPartFileToFile(MultipartFile file) {
		File convertedFile = new File(TEMP_DIR + File.separator + file.getOriginalFilename());
		try (FileOutputStream fos = new FileOutputStream(convertedFile)) {
			fos.write(file.getBytes());
		} catch (IOException e) {
			// Handle exception
			e.printStackTrace();
		}
		return convertedFile;
	}

	@Override
	public void deleteImages(Image image, String loginId, String type) {

		Optional<Image> opImage = imageRepository.findByOriginalFileName(image.getOriginalFileName());
		if (!opImage.isPresent()) {
			throw new DataNotFoundException("no data");
		}
		else{
			log.info("filename is =" + image.getOriginalFileName() + loginId);
		}

		String fileName = type + "/" + loginId + "/" + image.getOriginalFileName();
		s3Client.deleteObject(new DeleteObjectRequest(bucketName,fileName));

		this.imageRepository.deleteByFilePath(image.getFilePath());
	}
}
