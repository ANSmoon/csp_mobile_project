package com.MoReport;

import java.io.File;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling // 스케줄러 사용
@SpringBootApplication
@Slf4j
public class MoReportApplication {

	public static void main(String[] args) {
		log.info(new File("").getAbsolutePath() + File.separator + File.separator);
		SpringApplication.run(MoReportApplication.class, args);
	}

}
