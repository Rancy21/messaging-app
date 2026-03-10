package com.larr.message_app.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.larr.message_app.dto.UserDTO;
import com.larr.message_app.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

    @Query("select new com.larr.message_app.dto.UserDTO(u.id, u.username) from User u where u.username like %?1%and u.id != ?2")
    List<UserDTO> listByUsername(String username, String userId);
}
