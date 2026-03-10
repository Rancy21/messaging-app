import type { UserDTO } from "../types";
import { apiClient } from "./client";

export const userApi = {
  searchByUsername: (username: string) =>
    apiClient.get<UserDTO[]>(`/api/users/${encodeURIComponent(username)}`),
};
