package com.MoReport.domain.user.service;

import com.MoReport.domain.user.dao.UserRepository;
import com.MoReport.domain.user.domain.User;
import com.MoReport.domain.user.dto.UserData;
import com.MoReport.domain.user.dto.UserDto;
import com.MoReport.global.common.ResponseDto;
import com.MoReport.global.error.DataNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static com.MoReport.domain.user.domain.State.*;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService{

	private final UserRepository userRepository;
	
	@Override
	public User getUserByLoginId(String loginId) {
		Optional<User> user = this.userRepository.findByLoginId(loginId);
		if(user.isPresent()) {
			return user.get();
		}
		else throw new DataNotFoundException("not found user");
	}

	@Override
	public UserDto getAllUser() {
		List<User> userList = this.userRepository.findAll();
		List<UserData> userDataList = new ArrayList<UserData>();
		for(User e : userList){
			userDataList.add(ConvertUsertoUserData(e));
		}

		return UserDto.builder().userDataList(userDataList).build();
	}

	@Override
	public UserData getUserInfo(String loginId){
		User user = getUserByLoginId(loginId);

		return ConvertUsertoUserData(user);
	}

	@Override
	public User getUserById(int id) {
		Optional<User> user = this.userRepository.findById(id);
		if(user.isPresent()) {
			return user.get();
		}
		else throw new DataNotFoundException("not found user");
	}

	@Override
	public UserData updateUser(int id, UserData userDetail) {
		User user = getUserById(id);
		user.setUserName(userDetail.getUserName());
		user.setAddress(userDetail.getAddress());
		user.setPhone(userDetail.getPhone());

		user = (User) this.userRepository.save(user);
		UserData userData = ConvertUsertoUserData(user);

		return userData;
	}

	@Override
	public UserData updateUserStateToApproved(int id) {
		User user = getUserById(id);
		LocalDate now = LocalDate.now();
		user.setState(PERMITTED);
		user.setApprovalDate(now);
		user = (User) this.userRepository.save(user);
		UserData userData = ConvertUsertoUserData(user);
		return userData;
	}

	@Override
	public ResponseDto<?> multipleApprove(List<Integer> idList) {
		for(Integer e : idList){
			updateUserStateToApproved(e);
		}
		return ResponseDto.builder().code(200).success(true).message("다중 승인 완료").build();
	}

	@Override
	public UserData ConvertUsertoUserData(User user) {
		UserData userData = UserData.builder()
				.id(user.getId())
				.branchName(user.getBranchName())
				.userName(user.getUserName())
				.state(user.getState())
				.phone(user.getPhone())
				.address(user.getAddress())
				.approvalDate(user.getApprovalDate())
				.expirationDate(user.getExpirationDate())
				.build();

		return userData;
	}

	@Override
	public UserData updateUserStateToExpired(int id) {
		User user = getUserById(id);
		LocalDate now = LocalDate.now();
		user.setState(EXPIRED);
		user.setExpirationDate(now);
		user = (User) this.userRepository.save(user);
		UserData userData = ConvertUsertoUserData(user);
		return userData;
	}

	@Override
	public UserData extendUserExpirationDate(int id, LocalDate date) {
		User user = getUserById(id);
		user.setExpirationDate(date);

		user = (User) this.userRepository.save(user);
		UserData userData = ConvertUsertoUserData(user);
		return userData;
	}

	@Override
	public User findById(Long userId) {
		return (User) userRepository.findById(userId).orElse(null);
	}
  	@Override
	public UserData updateUserInfoByUser(String loginId, UserData changedUserInfo) {
		User user = getUserByLoginId(loginId);

		user.setUserName(changedUserInfo.getUserName());
		user.setAddress(changedUserInfo.getAddress());
		user.setPhone(changedUserInfo.getPhone());

		user = (User) this.userRepository.save(user);
		UserData userData = ConvertUsertoUserData(user);

		return userData;
	}

	@Override
	public UserData applyForServiceByUser(String loginId, int months) {
		User user = getUserByLoginId(loginId);
		LocalDate now = LocalDate.now();

		user.setState(WAITING_PERMISSION);
		user.setApprovalDate(now);
		user.setExpirationDate(now.plusMonths(months));

		user = (User) this.userRepository.save(user);
		UserData userData = ConvertUsertoUserData(user);

		return userData;
	}

	@Override
	public UserDto getWaitingPermissionUser() {
		List<User> userList = this.userRepository.findAll();
		List<UserData> userDataList = new ArrayList<UserData>();
		for(User e : userList){
			if(e.getState() == WAITING_PERMISSION){
				userDataList.add(ConvertUsertoUserData(e));
			}
		}

		return UserDto.builder().userDataList(userDataList).build();

	}
}
