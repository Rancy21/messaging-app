package com.larr.message_app.dto;

public record ChatMessageRequest(String conversationId, String content) {
}