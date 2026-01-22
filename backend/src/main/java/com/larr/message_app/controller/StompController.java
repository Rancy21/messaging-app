package com.larr.message_app.controller;

import java.time.LocalDateTime;
import java.util.Set;

import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import com.larr.message_app.dto.MessageRequest;
import com.larr.message_app.dto.MessageResponse;
import com.larr.message_app.dto.SessionResponse;
import com.larr.message_app.listener.StompEventListener;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequiredArgsConstructor
public class StompController {
    private final StompEventListener eventListener;

    @MessageMapping("/hello")
    @SendTo("/topic/hello")
    public MessageResponse hello(MessageRequest request) {
        log.info("Message Request: {}", request);

        return new MessageResponse(request.getMessage().toUpperCase(),
                LocalDateTime.now());
    }

    // @MessageMapping("/hello")
    // @SendTo({ "/topic/hello", "/topic/hello2" })
    // public MessageResponse hello(MessageRequest request, Message<MessageRequest>
    // message, MessageHeaders headers) {
    // log.info("Message Request: {}", request.getMessage());
    // log.info("Message: {}", message);
    // log.info("Headers: {}", headers);

    // return new MessageResponse(request.getMessage().toUpperCase(),
    // LocalDateTime.now());
    // }

    @MessageMapping("/hello/{detail}")
    @SendTo("/topic/hello")
    public MessageResponse detail(MessageRequest request, @DestinationVariable("detail") String detail) {
        log.info("Message Request: {}", request);
        log.info("detail: {}", detail);
        return new MessageResponse(request.getMessage().toUpperCase(),
                LocalDateTime.now());
    }

    // One - to - One Messaging

    @MessageMapping("/sessions")
    @SendToUser("/queue/sessions")
    public SessionResponse sessions(MessageRequest request, MessageHeaders headers) {
        String sessionId = headers.get("simpSessionId").toString();

        Set<String> sessions = eventListener.getSession();
        log.info("sessionId: {}", sessionId);

        return new SessionResponse(sessions.size(), sessions.stream().toList(), sessionId, LocalDateTime.now());
    }
}
