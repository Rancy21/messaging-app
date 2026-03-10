import type {
  ConversationDTO,
  ConversationRequest,
  Discussion,
  MessageDTO,
} from "../types";
import { apiClient } from "./client";

export const conversationsApi = {
  getAll: () => apiClient.get<Discussion[]>("/api/conversations"),

  getOrCreate: (data: ConversationRequest) =>
    apiClient.post<ConversationDTO>(
      "/api/conversations/conversation",
      data,
    ),

  getMessages: (conversationId: string) =>
    apiClient.get<MessageDTO[]>(
      `/api/conversations/${conversationId}/messages`,
    ),
};
