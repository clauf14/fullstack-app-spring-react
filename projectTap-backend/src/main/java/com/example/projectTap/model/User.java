package com.example.projectTap.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    private String firstName;
    private String lastName;
    private LocalDate dob; //year-month-day
    private String status;

    public User() {}

    public User(String firstName, String lastName, LocalDate dob, String status) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.dob = dob;
        this.status = status;
    }

    public Integer getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public LocalDate getDob() {
        return dob;
    }

    public String getStatus() {
        return status;
    }
}
