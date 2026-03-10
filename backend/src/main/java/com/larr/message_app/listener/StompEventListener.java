package com.larr.message_app.listener;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;
import org.springframework.web.socket.messaging.SessionUnsubscribeEvent;

import com.larr.message_app.dto.PresenceDTO;
import com.larr.message_app.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
@RequiredArgsConstructor
public class StompEventListener {
    private final ConcurrentHashMap<String, String> sessionMap = new ConcurrentHashMap<>();
    private final Set<String> onlineUsers = ConcurrentHashMap.newKeySet();

    private final SimpMessagingTemplate template;
    private final UserRepository userRepository;

    @EventListener
    public void listener(SessionConnectEvent sessionConnectEvent) {
        log.info("sessionConnectEvent: {}", sessionConnectEvent);
    }

    @EventListener
    public void listener(SessionConnectedEvent sessionConnectedEvent) {
        log.info("sessionConnectedEvent: {}", sessionConnectedEvent);
        String userId = sessionConnectedEvent.getUser().getName();
        String username = resolveUsername(userId);
        onlineUsers.add(username);

        template.convertAndSend("/topic/presence", new PresenceDTO(username, "online"));
    }

    @EventListener
    public void listener(SessionSubscribeEvent sessionSubscribeEvent) {
        log.info("sessionSubscribeEvent: {}", sessionSubscribeEvent);

        String destination = SimpMessageHeaderAccessor.wrap(sessionSubscribeEvent.getMessage()).getDestination();
        if ("/topic/presence".equals(destination)) {
            String userId = sessionSubscribeEvent.getUser().getName();
            log.info("Sending online users to {}: {}", userId, Set.copyOf(onlineUsers));
            template.convertAndSendToUser(userId, "/queue/presence/online-users", Set.copyOf(onlineUsers));
        }
    }

    @EventListener
    public void listener(SessionUnsubscribeEvent sessionUnsubscribeEvent) {
        log.info("sessionUnsubscribeEvent: {}", sessionUnsubscribeEvent);

    }

    @EventListener
    public void listener(SessionDisconnectEvent sessionDisconnectedEvent) {
        log.info("sessionDisconnectedEvent: {}", sessionDisconnectedEvent);
        String userId = sessionDisconnectedEvent.getUser().getName();
        String username = resolveUsername(userId);
        onlineUsers.remove(username);

        template.convertAndSend("/topic/presence", new PresenceDTO(username, "offline"));

    }

    public Set<String> getOnlineUsers() {
        return Set.copyOf(onlineUsers);
    }

    public String resolveUsername(String userId) {
        return userRepository.findById(userId)
                .map(user -> user.getUsername())
                .orElse(userId);
    }

    public String getSessionIdByUserId(String userId) {
        return sessionMap.get(userId);
    }

    public String getUserIdBySessionId(String sessionId) {
        return sessionMap.entrySet().stream().filter(e -> e.getValue().equals(sessionId)).map(Map.Entry::getKey)
                .findFirst().orElse(null);
    }
}
