package com.example.projectTap.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Arrays;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SignUpDto {

    private String firstName;

    private String lastName;

    private String username;

    private String email;

    private String login;

    private String phoneNumber;

    private char[] password;


}
