package com.larr.message_app.dto;

public record Discussion(
                String conversationId,
                String lastMessageContent,
                String otherParticipantUsername) {
}