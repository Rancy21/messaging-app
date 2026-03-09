import type { LoginRequest, RegisterRequest, UserDTO } from "../types";
import { apiClient } from "./client";

export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<UserDTO>("/api/auth/login", data),

  register: (data: RegisterRequest) =>
    apiClient.post<UserDTO>("/api/auth/register", data),
};
