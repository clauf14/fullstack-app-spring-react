package com.example.projectTap.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class HomePageController {

    @GetMapping("/")
    public String homepage(@RequestParam(name="name", required = false, defaultValue = "User")
                           String name, Model model){
        model.addAttribute("name", name);
        return "homepage";
    }
}
