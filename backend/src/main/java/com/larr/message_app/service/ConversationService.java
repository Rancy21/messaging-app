package com.larr.message_app.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.larr.message_app.dto.Discussion;
import com.larr.message_app.model.Conversation;
import com.larr.message_app.model.User;
import com.larr.message_app.repository.ConversationRepository;
import com.larr.message_app.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ConversationService {
    private final ConversationRepository repository;
    private final UserRepository userRepository;

    public Conversation getOrCreateConversation(String userId1, String userId2) {
        User user1 = userRepository.findById(userId1)
                .orElseThrow(() -> new RuntimeException("user with Id:" + userId1 + " does not exist."));
        User user2 = userRepository.findById(userId2)
                .orElseThrow(() -> new RuntimeException("user with Id:" + userId2 + " does not exist."));

        return repository.findConversation(userId1, userId2).orElseGet(() -> {
            List<User> participants = List.of(user1, user2);
            Conversation conversation = new Conversation();
            conversation.setParticipants(participants);
            return repository.save(conversation);
        });
    }

    public List<Discussion> getUserConversations(String userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("user with Id:" + userId + " does not exist.");
        }
        return repository.findUserConversations(userId);
    }
}