package com.MoReport.global.common;

import java.io.BufferedReader;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Component
public class Interceptor implements HandlerInterceptor {
	
	 @Override
	    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
	            throws Exception {
	        // 요청 처리 이전에 수행할 작업을 구현합니다.
		 	log.info("url : {}",request.getRequestURI());
		 	log.info("HTTP Method: " + request.getMethod());
		 	log.info("Headers: "+extractHeaders(request));
	        return true; // true를 반환하면 다음 인터셉터 또는 핸들러로 요청을 전달합니다.
	    }

	    @Override
	    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
	            ModelAndView modelAndView) throws Exception {
	        // 요청 처리 후에 수행할 작업을 구현합니다.
	    }

	    @Override
	    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler,
	            Exception ex) throws Exception {
	    	log.info("Response status : "+response.getStatus());
	        // 요청 처리 완료 후에 수행할 작업을 구현합니다.
	    }
	    private String extractHeaders(HttpServletRequest request) {
	        StringBuilder headers = new StringBuilder();
	        request.getHeaderNames().asIterator().forEachRemaining(headerName -> {
	            String headerValue = request.getHeader(headerName);
	            headers.append(headerName).append(": ").append(headerValue).append(", ");
	        });
	        if (headers.length() > 0) {
	            headers.delete(headers.length() - 2, headers.length()); // 마지막 ", " 제거
	        }
	        return headers.toString();
	    }
}

