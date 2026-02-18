package com.larr.message_app;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import com.larr.message_app.security.WebSocketAuthInterceptor;
import com.larr.message_app.security.jwt.JwtUtils;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    private final JwtUtils jwtUtils;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Raw WebSocket endpoint (for Postman, mobile clients, etc.)
        registry.addEndpoint("/message-app-websocket")
                .addInterceptors(new WebSocketAuthInterceptor(jwtUtils))
                .setAllowedOriginPatterns("*");

        // SockJS endpoint (for browsers that need fallback)
        registry.addEndpoint("/message-app-websocket")
                .addInterceptors(new WebSocketAuthInterceptor(jwtUtils))
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }

}
