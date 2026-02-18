package com.larr.message_app.security;

import java.util.Map;

import org.jspecify.annotations.Nullable;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;
import org.springframework.web.util.WebUtils;

import com.larr.message_app.security.jwt.JwtUtils;
import com.larr.message_app.security.jwt.JwtValidationException;

import jakarta.servlet.http.Cookie;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Slf4j
public class WebSocketAuthInterceptor implements HandshakeInterceptor {
    private final JwtUtils jwtUtils;

    @Override
    public void afterHandshake(ServerHttpRequest arg0, ServerHttpResponse arg1, WebSocketHandler arg2,
            @Nullable Exception arg3) {
    }

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler,
            Map<String, Object> attributes) throws Exception {

        log.info("WebSocket handshake attempt");
        log.info("Request type: {}", request.getClass().getName());

        // Add this before checking instanceof
        if (!(request instanceof ServletServerHttpRequest)) {
            log.warn("Request is not ServletServerHttpRequest");
        }

        if (request instanceof ServletServerHttpRequest) {
            ServletServerHttpRequest servletRequest = (ServletServerHttpRequest) request;

            Cookie cookie = WebUtils.getCookie(servletRequest.getServletRequest(), "auth-token");
            if (cookie != null) {
                String token = cookie.getValue();
                try {
                    if (jwtUtils.validateJwtToken(token)) {
                        String userId = jwtUtils.getUserIdFromJwtToken(token);

                        attributes.put("userId", userId);

                        return true;
                    }
                } catch (JwtValidationException e) {
                    log.error("Jwt Error: {}", e.getMessage());
                    return false;
                }

            }

            // If no token is provided reject connection
            log.error("No jwt token provided!!");
            return false;

        }

        return true;
    }

}