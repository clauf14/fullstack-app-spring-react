package com.example.projectTap.services;

import com.example.projectTap.entities.Favorite;
import com.example.projectTap.repositories.FavoriteRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FavoriteService {

    @Autowired
    private FavoriteRepository favoriteRepository;

    public Favorite create(Favorite favorite){
        return favoriteRepository.save(favorite);
    }

    public List<Favorite> viewAll(){
        return favoriteRepository.findAll();
    }

    public Favorite viewById(Integer id){
        return favoriteRepository.findById(id).get();
    }

    public List<Favorite> viewByUserId(Integer id){
        return favoriteRepository.findAllByUserId(id);
    }

    @Transactional
    public void removeFavorite(Integer postId, Integer userId) {
        Optional<Favorite> favorite = favoriteRepository.findByPostIdAndUserId(postId, userId);
        favorite.ifPresent(favoriteRepository::delete);
    }

    @Transactional
    public void removeFavoriteByPostId(Integer postId) {
        favoriteRepository.deleteByPostId(postId);
    }
}
