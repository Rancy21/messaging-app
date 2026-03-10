/** Auth */
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface UserDTO {
  userId: string;
  username: string;
}

export interface MessageDTO {
  id: string;
  content: string;
  sender: string;
  time: string;
}

export interface ChatMessageRequest {
  conversationId: string;
  content: string;
}

export interface ConversationDTO {
  conversationId: string;
  createdAt: string;
}

export interface ConversationRequest {
  username: string;
  recipient: string;
}

export interface Discussion {
  conversationId: string;
  lastMessageContent: string;
  otherParticipantUsername: string;
}

export interface MessageRequest {
  message: string;
}

export interface MessageResponse {
  message: string;
  time: string;
}

export interface SessionResponse {
  count: number;
  sessions: string[];
  sourceSessionId: string;
  localDateTime: string;
}

export interface ChatEvent {
  senderUsername: string;
  action: string;
}

// Auth context
export interface AuthContextValue {
  username: string | null;
  login: (username: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}
