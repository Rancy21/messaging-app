package com.larr.message_app.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class SessionResponse {
    private int count;
    private List<String> sessions;
    private String sourceSessionId;
    private LocalDateTime localDateTime;

}
