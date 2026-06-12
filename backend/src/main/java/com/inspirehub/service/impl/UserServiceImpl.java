package com.inspirehub.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.inspirehub.common.BusinessException;
import com.inspirehub.common.ErrorCode;
import com.inspirehub.dto.*;
import com.inspirehub.entity.User;
import com.inspirehub.mapper.UserMapper;
import com.inspirehub.service.UserService;
import com.inspirehub.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    @Transactional
    public LoginResponse register(RegisterRequest request) {
        // 检查邮箱唯一
        if (findByEmail(request.getEmail()) != null) {
            throw new BusinessException(ErrorCode.EMAIL_EXISTS);
        }
        // 检查用户名唯一
        if (userMapper.selectOne(
                new LambdaQueryWrapper<User>().eq(User::getUsername, request.getUsername())) != null) {
            throw new BusinessException(ErrorCode.USERNAME_EXISTS);
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .build();

        userMapper.insert(user);

        String token = jwtUtil.generate(user.getId(), user.getEmail());
        UserVO userVO = toVO(user);

        log.info("用户注册成功: {} ({})", user.getUsername(), user.getEmail());
        return new LoginResponse(token, userVO);
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        User user = findByEmail(request.getEmail());
        if (user == null) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BusinessException(ErrorCode.WRONG_PASSWORD);
        }

        String token = jwtUtil.generate(user.getId(), user.getEmail());
        UserVO userVO = toVO(user);

        log.info("用户登录成功: {}", user.getEmail());
        return new LoginResponse(token, userVO);
    }

    @Override
    public UserVO getProfile(Long userId) {
        User user = findById(userId);
        return toVO(user);
    }

    @Override
    @Transactional
    public UserVO updateProfile(Long userId, UpdateProfileRequest request) {
        User user = findById(userId);

        if (StringUtils.hasText(request.getUsername())) {
            // 检查新用户名是否冲突
            User existing = userMapper.selectOne(
                    new LambdaQueryWrapper<User>()
                            .eq(User::getUsername, request.getUsername())
                            .ne(User::getId, userId));
            if (existing != null) {
                throw new BusinessException(ErrorCode.USERNAME_EXISTS);
            }
            user.setUsername(request.getUsername());
        }

        if (StringUtils.hasText(request.getPassword())) {
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }

        userMapper.updateById(user);
        return toVO(user);
    }

    @Override
    public User findByEmail(String email) {
        return userMapper.selectOne(
                new LambdaQueryWrapper<User>().eq(User::getEmail, email));
    }

    @Override
    public User findById(Long id) {
        User user = userMapper.selectById(id);
        if (user == null) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }
        return user;
    }

    @Override
    @Transactional
    public void deleteAccount(Long userId, String password) {
        User user = findById(userId);
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new BusinessException(ErrorCode.WRONG_PASSWORD, "密码错误，无法删除账号");
        }
        userMapper.deleteById(userId);
        log.info("用户已删除: {} ({})", user.getUsername(), user.getEmail());
    }

    private UserVO toVO(User user) {
        return UserVO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
