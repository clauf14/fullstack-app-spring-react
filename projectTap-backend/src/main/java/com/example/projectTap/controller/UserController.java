package com.example.projectTap.controller;

import com.example.projectTap.model.User;
import com.example.projectTap.model.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.OptionalInt;

@RestController
@RequestMapping("/")
@CrossOrigin
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/users")
    public Iterable<User> findAllUsers() {
        return this.userRepository.findAll();
    }

    @GetMapping("/users/{id}")
    public Optional<User> findOneUser(@PathVariable("id") Integer id) {
        return this.userRepository.findById(id);
    }

    @PostMapping("/users/add")
    public void addOneUser(@RequestBody User user) {
        this.userRepository.save(user);
    }

    @DeleteMapping("/users/{id}")
    public String deleteOneUser(@PathVariable("id") Integer id){
        this.userRepository.deleteById(id);
       return ("User deleted successfully from database!");
    }
}
