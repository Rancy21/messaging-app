package com.larr.message_app.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.larr.message_app.dto.MessageDTO;
import com.larr.message_app.model.Conversation;
import com.larr.message_app.model.Message;
import com.larr.message_app.model.User;
import com.larr.message_app.repository.ConversationRepository;
import com.larr.message_app.repository.MessageRepository;
import com.larr.message_app.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository repository;
    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;

    public Message saveMessage(String conversationId, String senderId, String content) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("user with Id:" + senderId + " does not exist."));

        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("conversation with Id:" + conversationId + " does not exists"));

        Message newMessage = Message.builder().content(content).conversation(conversation).sender(sender).build();

        return repository.save(newMessage);
    }

    public List<MessageDTO> getMessageHistory(String conversationId) {
        return repository.findByConversation(conversationId);
    }
}