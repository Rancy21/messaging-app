package com.larr.message_app.dto;

public record Discussion(
                String conversationID,
                String lastMessageContent,
                String OtherParticipantUsername) {
}