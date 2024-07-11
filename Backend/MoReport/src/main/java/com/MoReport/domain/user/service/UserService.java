package com.MoReport.domain.user.service;

import com.MoReport.domain.user.domain.User;
import com.MoReport.domain.user.dto.UserData;
import com.MoReport.domain.user.dto.UserDto;
import com.MoReport.global.common.ResponseDto;

import java.time.LocalDate;
import java.util.List;

public interface UserService {
	/**
	 * loginId(사업자번호)로 유저를 조회하고 반환합니다.
	 * @author ehtjsv2
	 * @param loginId - String : 유저의 로그인 ID(사업자 번호) 입니다
	 */
	User getUserByLoginId(String loginId);
	UserDto getAllUser();
	UserData getUserInfo(String loginId);
	User getUserById(int id);
	UserData updateUser(int id, UserData changedUserInfo);
	UserData updateUserStateToApproved(int id);
	ResponseDto<?> multipleApprove(List<Integer> idList);
	UserData ConvertUsertoUserData(User user);
	UserData updateUserStateToExpired(int id);
	UserData extendUserExpirationDate(int id, LocalDate date);
	User findById(Long userId);
	UserData updateUserInfoByUser(String loginId, UserData changedUserInfo);
	UserData applyForServiceByUser(String loginId, int months);
	UserDto getWaitingPermissionUser();
}
