package com.example.projectTap.repositories;

import com.example.projectTap.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByLogin(String login);
    @Modifying
    @Query("UPDATE User u SET u.photo_id = NULL WHERE u.photo_id = :photoId")
    void updatePhotoIdToNull(@Param("photoId") Integer photoId);
}
