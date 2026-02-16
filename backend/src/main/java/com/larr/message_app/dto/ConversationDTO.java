package com.larr.message_app.dto;

import java.time.LocalDateTime;

public record ConversationDTO(String conversationId, LocalDateTime createdAt) {
}