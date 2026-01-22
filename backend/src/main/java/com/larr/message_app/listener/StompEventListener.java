package com.larr.message_app.listener;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;
import org.springframework.web.socket.messaging.SessionUnsubscribeEvent;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class StompEventListener {
    private final ConcurrentHashMap<String, String> sessionMap = new ConcurrentHashMap<>();

    public Set<String> getSession() {
        return sessionMap.keySet();
    }

    @EventListener
    public void listener(SessionConnectEvent sessionConnectEvent) {
        log.info("sessionConnectEvent: {}", sessionConnectEvent);

    }

    @EventListener
    public void listener(SessionConnectedEvent sessionConnectedEvent) {
        log.info("sessionConnectedEvent: {}", sessionConnectedEvent);
        String sessionId = sessionConnectedEvent.getMessage().getHeaders().get("simpSessionId").toString();
        sessionMap.put(sessionId, sessionId);

    }

    @EventListener
    public void listener(SessionSubscribeEvent sessionSubscribeEvent) {
        log.info("sessionSubscribeEvent: {}", sessionSubscribeEvent);

    }

    @EventListener
    public void listener(SessionUnsubscribeEvent sessionUnsubscribeEvent) {
        log.info("sessionUnsubscribeEvent: {}", sessionUnsubscribeEvent);

    }

    @EventListener
    public void listener(SessionDisconnectEvent sessionDisconnectedEvent) {
        log.info("sessionDisconnectedEvent: {}", sessionDisconnectedEvent);
        String sessionId = sessionDisconnectedEvent.getMessage().getHeaders().get("simpSessionId").toString();
        sessionMap.remove(sessionId);

    }
}
