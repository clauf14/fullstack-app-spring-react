package com.example.projectTap.mappers;

import com.example.projectTap.dto.SignUpDto;
import com.example.projectTap.dto.UserDto;
import com.example.projectTap.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDto toUserDto(User user);

    @Mapping(target = "password", ignore = true)  //se ignora campul parola pentru ca nu are acelasi format
    User signUpToUser(SignUpDto userDto);
}
