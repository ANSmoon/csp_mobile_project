package com.MoReport.global.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.MoReport.global.common.Interceptor;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer{
	private final long MAX_AGE_SECS = 3600;
	
	@Override
	public void addCorsMappings(CorsRegistry registry) {
		//모든 경로에 대해
		registry.addMapping("/**")
		.allowedOrigins("http://localhost:3000","http://192.168.219.115:3000","http://192.168.219.104:3000",
				"https://cspsummerproject.netlify.app")
		.allowedMethods("GET","POST","PUT","PATCH","DELETE","OPTIONS")
		.allowedHeaders("*")
		.allowCredentials(true)
		.maxAge(MAX_AGE_SECS);
		
	}
	
	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		 registry.addInterceptor(new Interceptor())
		 //우선순위 인터셉터 여러개 있을경우 필요하다.
         .order(1)
         //인서텝터 적용할 경로
         .addPathPatterns("/**")
         //인터셉터 적용하지 않아도되는 경로
         .excludePathPatterns("/css/**", "/*.ico", "/error");
	}
}
