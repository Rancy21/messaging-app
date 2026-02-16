package com.larr.message_app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.larr.message_app.dto.MessageDTO;
import com.larr.message_app.model.Message;

@Repository
public interface MessageRepository extends JpaRepository<Message, String> {

    @Query("""
            select new com.larr.message_app.dto.MessageDTO(m.content, m.sender.username)
            from Message m where m.conversation.id = ?1
            """)
    List<MessageDTO> findByConversation(String conversationId);

}