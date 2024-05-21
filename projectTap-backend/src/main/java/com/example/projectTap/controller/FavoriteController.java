package com.example.projectTap.controller;

import com.example.projectTap.entities.Favorite;
import com.example.projectTap.entities.Post;
import com.example.projectTap.services.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/favourites")
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;

    record NewFavoriteRequest(Integer favoriteId,Integer userId,Integer postId){}
    record RemoveFavoriteRequest(Integer userId, Integer postId){}

    @GetMapping("/all")
    public List<Favorite> getAllFavourites(){
        return favoriteService.viewAll();
    }

    @GetMapping("/all/{favoriteId}")
    public Favorite getOneFavorite(@PathVariable("favoriteId") Integer favoriteId){
        return favoriteService.viewById(favoriteId);
    }

    @GetMapping("/all/user/{userId}")
    public List<Favorite> getByUserId(@PathVariable("userId") Integer userId){
        return favoriteService.viewByUserId(userId);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addFavorite(@RequestBody NewFavoriteRequest request){
        try {
            Favorite favorite = new Favorite();
            favorite.setFavoriteId(request.favoriteId);
            favorite.setPostId(request.postId);
            favorite.setUserId(request.userId);

            Favorite createdFavorite = favoriteService.create(favorite);

            return ResponseEntity.ok(createdFavorite);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create favorite: " + e.getMessage());
        }
    }

    @DeleteMapping("/remove")
    public ResponseEntity<?> removeFavorite(@RequestBody RemoveFavoriteRequest favoriteRequest) {
        favoriteService.removeFavorite(favoriteRequest.postId, favoriteRequest.userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/remove/{postId}")
    public ResponseEntity<?> removeFavorite(@PathVariable("postId") Integer postId) {
        favoriteService.removeFavoriteByPostId(postId);
        return ResponseEntity.ok().build();
    }
}
