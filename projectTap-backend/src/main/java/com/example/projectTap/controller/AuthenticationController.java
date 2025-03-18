package com.example.projectTap.controller;

import com.example.projectTap.config.UserAuthenticationProvider;
import com.example.projectTap.dto.CredentialsDto;
import com.example.projectTap.dto.SignUpDto;
import com.example.projectTap.dto.UserDto;
import com.example.projectTap.entities.User;
import com.example.projectTap.repositories.UserRepository;
import com.example.projectTap.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Optional;

@RequiredArgsConstructor
@RestController
public class AuthenticationController {

    private final UserService userService;
    private final UserAuthenticationProvider userAuthenticationProvider;
    private final UserRepository userRepository;

    @GetMapping("/register")
    public Iterable<User> findAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/users/{userId}")
    public Optional<User> findUserById(@PathVariable("userId") Integer userId) {
        return userRepository.findById(userId);
    }

    @PutMapping("/users/edit/{userId}/{photoId}")
    public ResponseEntity<UserDto> updateUser(@PathVariable("userId") Integer userId,
                                              @PathVariable("photoId") Integer photoId,
                                              @RequestBody @Valid UserDto userDto) {
        UserDto updatedUser = userService.updateUserInfo(userId, photoId,userDto);
        return ResponseEntity.ok(updatedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<UserDto> login(@RequestBody @Valid CredentialsDto credentialsDto) {
        UserDto user = userService.login(credentialsDto);

        user.setToken(userAuthenticationProvider.createToken(user)); //once logged in, return a fresh, new JWT
        return ResponseEntity.ok(user);
    }

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@RequestBody @Valid SignUpDto signUpDto) {
        UserDto user = userService.register(signUpDto);
        System.out.println(signUpDto.toString());

        user.setToken(userAuthenticationProvider.createToken(user)); //once registered in, return a fresh, new JWT
        return ResponseEntity.created(URI.create("/users/" + user.getId())).body(user);
    }
}
