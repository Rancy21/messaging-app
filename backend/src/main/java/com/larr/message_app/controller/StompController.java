package com.larr.message_app.controller;

import java.io.IOException;
import java.security.InvalidParameterException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Random;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ScheduledFuture;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Controller;

import com.larr.message_app.dto.MessageRequest;
import com.larr.message_app.dto.MessageResponse;
import com.larr.message_app.dto.SessionResponse;
import com.larr.message_app.listener.StompEventListener;

import jakarta.annotation.Nullable;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequiredArgsConstructor
public class StompController {
    private final StompEventListener eventListener;
    private final SimpMessagingTemplate template;
    private final TaskScheduler scheduler;

    private final ConcurrentHashMap<String, ScheduledFuture<?>> sessionMap = new ConcurrentHashMap<>();

    @MessageMapping("/hello")
    @SendTo("/topic/hello")
    public MessageResponse hello(MessageRequest request) {
        log.info("Message Request: {}", request);

        return new MessageResponse(request.getMessage().toUpperCase(),
                LocalDateTime.now());
    }

    @MessageMapping("/greeting")
    @SendTo({ "/topic/hello", "/topic/hello2" })
    public MessageResponse greeting(MessageRequest request, Message<MessageRequest> message, MessageHeaders headers) {
        log.info("Message Request: {}", request.getMessage());
        log.info("Message: {}", message);
        log.info("Headers: {}", headers);

        return new MessageResponse(request.getMessage().toUpperCase(),
                LocalDateTime.now());
    }

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

    /**
     * Forwarding Programmatically without using Annotation (@SendTo, @SendToUser)
     */

    @MessageMapping("message1")
    public void message1(MessageRequest request) {
        MessageResponse response = new MessageResponse(request.getMessage(), LocalDateTime.now());
        template.convertAndSend("/topic/message1", response);
    }

    @MessageMapping("/message2")
    public void message2(MessageRequest request, MessageHeaders headers) {
        String sessionId = headers.get("simpSessionId").toString();

        Set<String> sessions = eventListener.getSession();
        log.info("sessionId: {}", sessionId);

        SessionResponse response = new SessionResponse(sessions.size(), sessions.stream().toList(), sessionId,
                LocalDateTime.now());

        template.convertAndSendToUser(sessionId, "/queue/sessions", response, createHeaders(sessionId));
    }

    private MessageHeaders createHeaders(@Nullable String sessionId) {
        SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.create(SimpMessageType.MESSAGE);

        headerAccessor.setSessionId(sessionId);
        headerAccessor.setLeaveMutable(true);
        return headerAccessor.getMessageHeaders();
    }

    // Live Trading app

    @MessageMapping("/start")
    public void start(MessageRequest request, MessageHeaders headers) {
        log.info("headers: {}", headers);
        String sessionId = headers.get("simpSessionId").toString();
        log.info("sessionId: {}", sessionId);

        ScheduledFuture<?> scheduledFuture = scheduler.scheduleAtFixedRate(() -> {
            Random random = new Random();
            int currentPrice = random.nextInt(150);
            template.convertAndSendToUser(sessionId, "/queue/trade", currentPrice, createHeaders(sessionId));
        }, Duration.ofSeconds(3));

        sessionMap.put(sessionId, scheduledFuture);
    }

    @MessageMapping("/stop")
    public void stop(MessageRequest request, MessageHeaders headers) {
        log.info("headers: {}", headers);
        String sessionId = headers.get("simpSessionId").toString();
        log.info("sessionId: {}", sessionId);

        ScheduledFuture<?> scheduledFuture = sessionMap.remove(sessionId);

        scheduledFuture.cancel(true);
    }

    // Triggering Exception
    @MessageMapping("/exception")
    @SendTo("/topic/hello")
    public void exception(MessageRequest request, MessageHeaders headers) throws Exception {
        log.info("request: {}", request);
        String message = request.getMessage();
        switch (message) {
            case "runtime":
                throw new RuntimeException();
            case "nullPointer":
                throw new NullPointerException();
            case "io":
                throw new IOException();
            case "exception":
                throw new Exception();
            default:
                throw new InvalidParameterException();
        }
    }

}
