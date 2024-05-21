package com.example.projectTap.repositories;

import com.example.projectTap.entities.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Integer> {
    Optional<Favorite> findByPostIdAndUserId(Integer postId, Integer userId);

    List<Favorite> findAllByUserId(Integer userId);

    void deleteByPostId(Integer postId);
}
