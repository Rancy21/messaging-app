package com.larr.message_app.controller;

import com.larr.message_app.dto.ConversationDTO;
import com.larr.message_app.dto.ConversationRequest;
import com.larr.message_app.model.Conversation;
import com.larr.message_app.service.ConversationService;
import com.larr.message_app.service.MessageService;
import com.larr.message_app.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/conversations")
public class ConversationController {

    private final ConversationService conversationService;
    private final MessageService messageService;
    private final UserService userService;

    /**
     * Fetch list of conversations.
     *
     * @param userId
     * @return
     */

    @GetMapping
    public ResponseEntity<?> listConversations(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        return ResponseEntity.ok(
                conversationService.getUserConversations(userId));
    }

    /**
     * Fetch conversation history.
     *
     * @param conversationId
     * @return
     */

    @GetMapping("/{conversationId}/messages")
    public ResponseEntity<?> getConversationHistory(
            @PathVariable String conversationId) {
        return ResponseEntity.ok(
                messageService.getMessageHistory(conversationId));
    }

    /**
     * Create a conversation or fetch an existing one.
     *
     * @param request
     * @return
     */
    @GetMapping("/conversation")
    public ResponseEntity<?> getConversation(
            @RequestBody ConversationRequest request) {
        Conversation conversation = conversationService.getOrCreateConversation(
                userService.findByUsername(request.username()).getId(),
                userService.findByUsername(request.recipient()).getId());
        return ResponseEntity.ok(
                new ConversationDTO(
                        conversation.getId(),
                        conversation.getCreatedAt()));
    }
}
