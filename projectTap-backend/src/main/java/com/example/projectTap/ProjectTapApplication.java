package com.example.projectTap;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
public class ProjectTapApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProjectTapApplication.class, args);
		System.out.println("http://localhost:8080");
	}

}
