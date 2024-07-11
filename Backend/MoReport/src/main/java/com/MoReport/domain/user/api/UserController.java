package com.MoReport.domain.user.api;

import com.MoReport.domain.user.dto.UserData;
import com.MoReport.domain.user.service.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;


@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {

    private final UserServiceImpl userServiceImpl;

    @GetMapping()
    public ResponseEntity<?> getUserInfoByUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId=authentication.getName();

        UserData userData = userServiceImpl.getUserInfo(userId);
        return ResponseEntity.ok(userData);
    }

    @PutMapping()
    public ResponseEntity<?> updateUserInfoByUser(@RequestBody UserData userDetails) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId=authentication.getName();

        UserData updatedUserData = userServiceImpl.updateUserInfoByUser(userId,userDetails);
        return ResponseEntity.ok(updatedUserData);
    }
    @PutMapping("/{months}")
    public ResponseEntity<?> applyForServiceByUser(@PathVariable int months)  {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId=authentication.getName();

        UserData updatedUserData = userServiceImpl.applyForServiceByUser(userId, months);
        return ResponseEntity.ok(updatedUserData);
    }

}
