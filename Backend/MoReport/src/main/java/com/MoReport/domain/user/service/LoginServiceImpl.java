package com.MoReport.domain.user.service;

import java.time.LocalDate;
import java.util.Optional;

import com.MoReport.domain.user.domain.Role;
import com.MoReport.domain.user.domain.State;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.MoReport.domain.user.dao.UserRepository;
import com.MoReport.domain.user.domain.User;
import com.MoReport.domain.user.dto.LoginRequestDto;
import com.MoReport.domain.user.dto.LoginResponseDto;
import com.MoReport.domain.user.dto.MokiLoginResponseDto;
import com.MoReport.domain.user.dto.SignupRequestDto;
import com.MoReport.domain.user.exception.LoginIdPwdInvaildExcption;
import com.MoReport.global.auth.TokenProvider;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.Disposable;

@Slf4j
@Service
@RequiredArgsConstructor
public class LoginServiceImpl implements LoginService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncodoer;
	private final UserServiceImpl userServiceImpl;
	private final TokenProvider tokenProvider;
	
	@Override
	public void regist(SignupRequestDto signupDto) {
		User user = new User();
		user.setBranchName(signupDto.getBranchName());
		user.setLoginId(signupDto.getLoginId());
		user.setLoginPwd(passwordEncodoer.encode(signupDto.getLoginPwd()));
		user.setUserName("empty");
		user.setState(State.EXPIRED);
		user.setRole(Role.ROLE_USER);
		user.setPhone("010-0000-0000");
		user.setAddress("empty");
		user.setEmail("empty");
		user.setApprovalDate(LocalDate.now());
		user.setExpirationDate(LocalDate.now());
		this.userRepository.save(user);
	}

	@Override
	public LoginResponseDto login(LoginRequestDto loginDto) {
		// Spring WebFlux api통신
		WebClient client = WebClient.create();

		//https://www.kioskmanager.co.kr/admin/api/login.php에 ?mb_id=~~mb_password=~~를 쿼리파라미터로 넣음
		String url = "https://www.kioskmanager.co.kr/admin/api/login.php" + "?mb_id=" + loginDto.getLoginId()
				+ "&mb_password=" + loginDto.getLoginPwd();

		//WebFlux의 client를 활용ㅎ여 지정된 URL(매니저 서버)에 GET요청을 보냄
		//그리고 retrieve()를 통해 값을 받아내고,이걸 우리의 DTO형식으로 변환
		MokiLoginResponseDto mokiLoginResponseDto = client.get().uri(url).retrieve()
				.bodyToMono(MokiLoginResponseDto.class).block();


		//manager서버에 접속을 성공함 -> 우리 DB(manaer서버가 아닌, 예측 출력 서버)에도 있는지 확인해야 함
		if (mokiLoginResponseDto.getResult().equals("Y")) {// manager서버 로그인성공 시

			// 우리 서버에 없는 아이디 라면 우리 DB에 자체적으로 ID, PASSWORD보관
			if (!isInOurDb(loginDto)) {
				log.info("[로그인] 우리서버에 ID 없음 -> 등록");

				//회원가입에 필요한 정보를 moki dto를 이용해서 만들어서 등록 시켜버림
				SignupRequestDto signupRequestDto = SignupRequestDto.builder()
						.branchName(mokiLoginResponseDto.getMb_name()).loginId(loginDto.getLoginId())
						.loginPwd(loginDto.getLoginPwd()).build();
				regist(signupRequestDto);
			} else {// 우리 서버에 있다면
				User user = this.userServiceImpl.getUserByLoginId(loginDto.getLoginId());

				// 우리서버의 비밀번호와 일치하지 않는다면 비밀번호 동기화(manager서버의 비번이 변경되었을 경우)
				if (!passwordEncodoer.matches(loginDto.getLoginPwd(), user.getLoginPwd())) {
					log.info("[로그인] 우리서버의 비밀번호와 불일치 -> 비밀번호 동기화");
					user.setLoginPwd(passwordEncodoer.encode(loginDto.getLoginPwd()));


					//애초에 userImpl로 처리할 수 있을 듯?
					this.userRepository.save(user);
				}
			}

			//여기를 수정해야 함 (토큰에 admin or else)
			// 1. User Entity에 role과 관련된 column 추가
			// 2. 현재 존재하는 모든 객체에 user로 넣기
			// 3. 우리가 만들 새로운 관리자 id만 admin으로 넣기
			// 4. 토큰 생성시, role관련 데이터 넣어주기
			// 5. 토큰 확인시(필터역할), role==admin인 경우에 특별 페이지로 리다이렉트
			User user = (User)this.userRepository.findByLoginId(loginDto.getLoginId()).orElse(null);
			final String accessToken = tokenProvider.createAccessToken(user);
			final String refreshToken = tokenProvider.createRefreshToken(user);
			//로그인의 성공에 관련한 토큰 및 정보 던져줌
			return LoginResponseDto.builder()
					.accessToken(accessToken)
					.refreshToken(refreshToken)
					.branchName(mokiLoginResponseDto.getMb_name())
					.build();
		} else {// 로그인 실패 시
			throw new LoginIdPwdInvaildExcption("Id or Pwd invaild");
		}

	}

	/**
	 * 사용자가 DB에 존재하는 지 유무를 알려줍니다.
	 * @author ehtjsv2
	 * @param loginRequestDto - LoginRequestDto : id(사업자번호)와 비밀번호를 담고있습니다.
	 */
	public boolean isInOurDb(LoginRequestDto loginRequestDto) {
		Optional<User> user = this.userRepository.findByLoginId(loginRequestDto.getLoginId());
		if (user.isPresent()) {
			return true;
		} else
			return false;
	}


	/**
	 * WebClient 사용 시 쌓이는 쓰레기를 정리합니다.
	 * @author ehtjsv2
	 */
	public void cleanup() {
		Disposable disposable;
		WebClient client = WebClient.create();
		disposable = client.get().uri("https://dummyurl.com").retrieve().bodyToMono(Void.class).subscribe();
		disposable.dispose();
		log.info("cleanup()");
	}

}
