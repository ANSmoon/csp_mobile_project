package com.MoReport.domain.user.api;

import com.MoReport.domain.user.dto.UserData;
import com.MoReport.domain.user.dto.UserDto;
import com.MoReport.domain.user.service.UserServiceImpl;
import com.MoReport.global.common.ResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class AdminController {
    private final UserServiceImpl userServiceImpl;
    @GetMapping()
    public ResponseEntity<?> showAllUserData() {
        UserDto userDto = userServiceImpl.getAllUser();
        ResponseDto<UserDto> responseDto = ResponseDto.<UserDto>builder()
                .success(true)
                .code(200)
                .message("userList success")
                .data(userDto)
                .build();
        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }
    @GetMapping("/apply")
    public ResponseEntity<?> showWaitingPermissionUserData() {
        UserDto userDto = userServiceImpl.getWaitingPermissionUser();
        ResponseDto<UserDto> responseDto = ResponseDto.<UserDto>builder()
                .success(true)
                .code(200)
                .message("wp-userList- success")
                .data(userDto)
                .build();
        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable int id, @RequestBody UserData userDetails) {
        UserData updatedUserData = userServiceImpl.updateUser(id,userDetails);
        return ResponseEntity.ok(updatedUserData);
    }

    @PutMapping("/{idList}/approve")
    public ResponseEntity<?> updateUserStateToApproved(@PathVariable List<Integer> idList) {
        ResponseDto<?> updatedUserData = userServiceImpl.multipleApprove(idList);
        return ResponseEntity.ok(updatedUserData);
    }

    @PutMapping("/{id}/expire")
    public ResponseEntity<?> updateUserStateToExpired(@PathVariable int id) {
        UserData updatedUserData = userServiceImpl.updateUserStateToExpired(id);
        return ResponseEntity.ok(updatedUserData);
    }

    @PutMapping("/{id}/{date}")
    public ResponseEntity<?> extendUserStateToExpired(@PathVariable int id, @PathVariable LocalDate date) {
        UserData updatedUserData = userServiceImpl.extendUserExpirationDate(id, date);
        return ResponseEntity.ok(updatedUserData);
    }
}
