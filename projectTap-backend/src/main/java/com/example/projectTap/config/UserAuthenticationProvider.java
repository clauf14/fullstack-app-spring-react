package com.example.projectTap.config;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.example.projectTap.dto.UserDto;
import com.example.projectTap.services.UserService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Base64;
import java.util.Collections;
import java.util.Date;

@RequiredArgsConstructor
@Component
public class UserAuthenticationProvider {

    @Value("${security.jwt.token.secret-key:secret-value}")
    private String secretKey;

    private final UserService userService;

    @PostConstruct
    protected  void init() {
        secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes()); //Am criptat cheia ca sa nu apara in format text
    }

    public String createToken(UserDto user) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + 36000000); // 1 hour

        Algorithm algorithm = Algorithm.HMAC256(secretKey);
        return JWT.create()
                .withSubject(user.getLogin())
                .withIssuedAt(now)
                .withExpiresAt(validity)
                .withClaim("firstName", user.getFirstName())
                .withClaim("lastName", user.getLastName())
                .withClaim("id", user.getId())
                .sign(algorithm);
    }

    public Authentication validateToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secretKey);
            JWTVerifier verifier = JWT.require(algorithm).build();
            DecodedJWT decoded = verifier.verify(token); // Decode the token

            UserDto user = userService.findByLogin(decoded.getSubject());
            return new UsernamePasswordAuthenticationToken(user, null, Collections.emptyList());
        } catch (TokenExpiredException e) {
            System.out.println("TOKEN Is EXPIRED");
            throw new TokenExpiredException("Token has expired", e.getExpiredOn());
        } catch (Exception e) {
            // Handle other exceptions here
            // For example, log the error or throw a custom exception
            throw new RuntimeException("Failed to validate token", e);
        }
    }

}

