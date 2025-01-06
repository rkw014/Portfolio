package com.rk.portfolio.user_service.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    @PostMapping(path = "/users")
    public String postUser(){
        return "user Posted";
    }

    @GetMapping(path = "/users")
    public String getUser(){
        return "user Got";
    }
}
