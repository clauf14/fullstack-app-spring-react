package com.example.projectTap.config;

import com.example.projectTap.dto.ErrorDto;
import com.example.projectTap.exceptions.AppException;
import com.auth0.jwt.exceptions.TokenExpiredException; // Import this exception
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

@ControllerAdvice
public class RestExceptionHandler {

    @ExceptionHandler(value = {AppException.class})
    @ResponseBody
    public ResponseEntity<ErrorDto> handleException(AppException ex) {
        return ResponseEntity.status(ex.getCode())
                .body(ErrorDto.builder().message(ex.getMessage()).build());
    }

    @ExceptionHandler(value = {TokenExpiredException.class})
    @ResponseBody
    public ResponseEntity<ErrorDto> handleTokenExpiredException(TokenExpiredException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ErrorDto.builder().message("Your authentication token has expired. Please login again!").build());
    }
}
