package com.inspirehub.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileRequest {

    @Size(min = 2, max = 50, message = "用户名长度为 2-50 字符")
    private String username;

    @Size(min = 6, max = 20, message = "密码长度为 6-20 位")
    private String password;
}
