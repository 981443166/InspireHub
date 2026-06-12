package com.inspirehub.service;

import com.inspirehub.dto.*;
import com.inspirehub.entity.User;

public interface UserService {

    /** 注册 */
    LoginResponse register(RegisterRequest request);

    /** 登录 */
    LoginResponse login(LoginRequest request);

    /** 获取当前用户信息 */
    UserVO getProfile(Long userId);

    /** 更新用户信息 */
    UserVO updateProfile(Long userId, UpdateProfileRequest request);

    /** 根据 email 查询（内部用） */
    User findByEmail(String email);

    /** 根据 id 查询 */
    User findById(Long id);

    /** 删除账号（物理删除，级联灵感） */
    void deleteAccount(Long userId, String password);
}
