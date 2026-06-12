import { useMutation } from "@tanstack/react-query";
import { postData } from "@/api/client";
import type { LoginRequest, LoginResponse, RegisterRequest } from "@/types/index";

export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginRequest) =>
      postData<LoginResponse>("/auth/login", data),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterRequest) =>
      postData<LoginResponse>("/auth/register", data),
  });
}
