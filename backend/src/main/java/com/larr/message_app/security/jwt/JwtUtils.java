package com.larr.message_app.security.jwt;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;
import org.springframework.web.util.WebUtils;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

@Component
public class JwtUtils {
    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private int expiration;

    public SecretKey key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
    }

    public String generateToken(String userId) {
        return Jwts.builder().subject(userId).issuedAt(new Date())
                .expiration(new Date(new Date().getTime() + expiration)).signWith(key()).compact();
    }

    public String getJwtTokenFromCookie(HttpServletRequest request) {
        Cookie cookie = WebUtils.getCookie(request, "auth-token");

        if (cookie != null) {
            return cookie.getValue();
        }

        return null;
    }

    public ResponseCookie generateCookie(String userId) {
        String token = generateToken(userId);
        return ResponseCookie.from("auth-token", token).httpOnly(true).secure(false).path("/").maxAge(expiration / 1000)
                .build();
    }

    public ResponseCookie generateCleanCookie() {
        return ResponseCookie.from("auth-token", "").httpOnly(true).secure(false).path("/").maxAge(0)
                .build();
    }

    public String getUserIdFromJwtToken(String token) {
        return Jwts.parser().verifyWith(key()).build().parseSignedClaims(token).getPayload().getSubject();
    }

    public boolean validateJwtToken(String token) {
        try {
            Jwts.parser().verifyWith(key()).build().parse(token);
            return true;
        } catch (ExpiredJwtException e) {
            throw new JwtValidationException("Token expired", e);
        } catch (IllegalArgumentException e) {
            throw new JwtValidationException("Token is empty or null", e);
        } catch (MalformedJwtException e) {
            throw new JwtValidationException("Invalid token", e);
        }
    }
}