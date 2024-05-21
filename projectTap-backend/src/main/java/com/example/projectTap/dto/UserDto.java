package com.example.projectTap.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class UserDto {

    private Integer id;

    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private String password;
    private String login;
    private String token;
    private String phoneNumber;
}
