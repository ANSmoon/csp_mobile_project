package com.MoReport.domain.image;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ImageRepository extends JpaRepository<Image, Long>{
	Optional<Image> findByOriginalFileName(String imageName);
	Optional<Image> findImageByFilePath(String filePath);
	Optional<Image> deleteByFilePath(String filePath);
}
