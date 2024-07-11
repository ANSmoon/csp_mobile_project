package com.MoReport.global.config;

import java.util.Arrays;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.config.annotation.web.configurers.HttpBasicConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.MoReport.global.auth.JwtAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

//원래 config에서 Authentication Manager를 사용하는데, 여기에서는 사용하지 않았음
@EnableWebSecurity
@Configuration
public class SecurityConfig {
	
	@Autowired
	private JwtAuthenticationFilter jwtAuthenticationFilter;
	
	@Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception{

		//우리가 만든 필터를 먼저 걸어놓음\
        return httpSecurity.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
        		.httpBasic(HttpBasicConfigurer::disable) //http기본인증 비활성화 (?)
        		.csrf(CsrfConfigurer::disable) // csrf 보호 비활성화 (?)
                .cors(Customizer.withDefaults()) //cors 활성화
                .authorizeHttpRequests(authorize->authorize //특정 엔드포인트에는 인증을 필요로 하게 함
						.requestMatchers("/admin/**").hasRole("ADMIN")
                		.requestMatchers("/date/**","/menu/**","/predict/**","/user/**").authenticated()
                		.anyRequest().permitAll())
              //springSecurity 자체 로그인 제거
                .sessionManagement((sessiopnManagement)->sessiopnManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .build();
    }
	
	@Bean
    public BCryptPasswordEncoder encoder() {
        return new BCryptPasswordEncoder();
    }


	//	@Bean
//	public CorsConfigurationSource corsConfigurationSource() {
//		CorsConfiguration configuration = new CorsConfiguration();
//		configuration.setAllowedOrigins(Arrays.asList("*"));
//		configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
//		configuration.setAllowedHeaders(Arrays.asList("*"));
//		configuration.setAllowCredentials(true);
//
//		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//		source.registerCorsConfiguration("/**", configuration);
//		return source;
//	}

}


		
        
