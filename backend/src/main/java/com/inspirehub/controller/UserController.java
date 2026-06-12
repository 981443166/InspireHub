package com.inspirehub.controller;

import com.inspirehub.common.Result;
import com.inspirehub.dto.DeleteAccountRequest;
import com.inspirehub.dto.UpdateProfileRequest;
import com.inspirehub.dto.UserVO;
import com.inspirehub.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /** 获取当前用户信息 */
    @GetMapping("/profile")
    public Result<UserVO> getProfile(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return Result.success(userService.getProfile(userId));
    }

    /** 更新用户信息 */
    @PutMapping("/profile")
    public Result<UserVO> updateProfile(Authentication authentication,
                                         @Valid @RequestBody UpdateProfileRequest request) {
        Long userId = (Long) authentication.getPrincipal();
        return Result.success(userService.updateProfile(userId, request));
    }

    /** 删除账号 */
    @DeleteMapping("/account")
    public Result<Void> deleteAccount(Authentication authentication,
                                       @Valid @RequestBody DeleteAccountRequest request) {
        Long userId = (Long) authentication.getPrincipal();
        userService.deleteAccount(userId, request.getPassword());
        return Result.success();
    }
}
