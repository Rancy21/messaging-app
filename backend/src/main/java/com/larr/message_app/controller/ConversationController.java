package com.larr.message_app.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.larr.message_app.dto.ConversationRequest;
import com.larr.message_app.service.ConversationService;
import com.larr.message_app.service.MessageService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/conversations/")
public class ConversationController {
    private final ConversationService conversationService;
    private final MessageService messageService;

    /**
     * Fetch list of conversations.
     * 
     * @param userId
     * @return
     */

    @GetMapping("/list")
    public ResponseEntity<?> listConversations(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        return ResponseEntity.ok(conversationService.getUserConversations(userId));
    }

    /**
     * Fetch conversation history.
     * 
     * @param conversationId
     * @return
     */

    @GetMapping("/history/{conversationId}")
    public ResponseEntity<?> getConversationHistory(@PathVariable String conversationId) {
        return ResponseEntity.ok(messageService.getMessageHistory(conversationId));
    }

    /**
     * Create a conversation or fetch an existing one.
     * 
     * @param request
     * @return
     */
    @GetMapping("/get-conversation")
    public ResponseEntity<?> getConversation(@RequestBody ConversationRequest request) {
        return ResponseEntity.ok(conversationService.getOrCreateConversation(request.userId1(), request.userId2()));
    }

}