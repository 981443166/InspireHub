package com.inspirehub.controller;

import com.inspirehub.common.Result;
import com.inspirehub.dto.DeleteAccountRequest;
import com.inspirehub.dto.UpdateProfileRequest;
import com.inspirehub.dto.UserVO;
import com.inspirehub.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@Tag(name = "用户", description = "个人信息管理")
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @Operation(summary = "获取个人信息", description = "获取当前登录用户的资料")
    @GetMapping("/profile")
    public Result<UserVO> getProfile(@Parameter(hidden = true) Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return Result.success(userService.getProfile(userId));
    }

    @Operation(summary = "更新个人信息", description = "修改用户名或密码（至少提供一个字段）")
    @PutMapping("/profile")
    public Result<UserVO> updateProfile(@Parameter(hidden = true) Authentication authentication,
                                         @Valid @RequestBody UpdateProfileRequest request) {
        Long userId = (Long) authentication.getPrincipal();
        return Result.success(userService.updateProfile(userId, request));
    }

    @Operation(summary = "删除账号", description = "验证密码后永久删除账号及所有关联灵感数据")
    @DeleteMapping("/account")
    public Result<Void> deleteAccount(@Parameter(hidden = true) Authentication authentication,
                                       @Valid @RequestBody DeleteAccountRequest request) {
        Long userId = (Long) authentication.getPrincipal();
        userService.deleteAccount(userId, request.getPassword());
        return Result.success();
    }
}
