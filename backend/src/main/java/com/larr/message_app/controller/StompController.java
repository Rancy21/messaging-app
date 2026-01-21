package com.larr.message_app.controller;

import java.time.LocalDateTime;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.larr.message_app.dto.MessageRequest;
import com.larr.message_app.dto.MessageResponse;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
public class StompController {
    @MessageMapping("/hello")
    @SendTo("/topic/hello")
    public MessageResponse hello(MessageRequest request) {
        log.info("Message Request: {}", request);

        return new MessageResponse(request.getMessage().toUpperCase(), LocalDateTime.now());
    }
}
