package com.larr.message_app.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.larr.message_app.dto.Discussion;
import com.larr.message_app.model.Conversation;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, String> {
    @Query(value = """
                        SELECT c.*
            FROM conversations c
            JOIN conversation_participants cp ON cp.conversation_id = c.id
            WHERE cp.user_id IN (?1, ?2)
            GROUP BY c.id
            HAVING COUNT(DISTINCT cp.user_id) = 2;
                        """, nativeQuery = true)
    Optional<Conversation> findConversation(String participant1, String participant2);

    @Query(value = """
            SELECT distinct on (c.id) c.id as conversation_id, u.username AS other_participant_username, m.content as last_message_content
            FROM conversations c
            JOIN conversation_participants cp ON cp.conversation_id = c.id
            JOIN users u ON cp.user_id = u.id
            join messages m on m.conversation_id = c.id
            WHERE c.id IN (
                SELECT conversation_id
                FROM conversation_participants
                WHERE user_id = ?1
            )
            AND cp.user_id != ?1
            order by c.id, m."timestamp" desc
                    """, nativeQuery = true)
    List<Discussion> findUserConversations(String userId);
}