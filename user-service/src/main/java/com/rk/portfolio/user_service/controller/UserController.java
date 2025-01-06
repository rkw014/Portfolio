package com.rk.portfolio.user_service.controller;

import com.rk.portfolio.user_service.model.User;
import com.rk.portfolio.user_service.service.UserService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLIntegrityConstraintViolationException;
import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping()
    public String getUser(){
        return "user Got";
    }

    @PostMapping()
    @Transactional
    public ResponseEntity<String> createUser(
            @RequestHeader("X-User-Id") String userId,
            @RequestHeader("X-User-Email") String email,
            @RequestHeader("X-User-Name") String userName,
            @RequestBody User user
    ){
        Optional<User> curUser = userService.getUserById(userId);
        if (curUser.isEmpty()){
            User newUser = new User(
                    userId,
                    email,
                    userName,
                    LocalDateTime.now(),
                    LocalDateTime.now()
            );
            User createdUser = userService.createUser(newUser);
        }
        return ResponseEntity.ok("OK");
    }

    @GetMapping("/{id}")
    public ResponseEntity<String> getUserById(@PathVariable String id) {
        Optional<User> user = userService.getUserById(id);
        if(user.isPresent()){return ResponseEntity.ok("OK");}
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<String> updateUser(@PathVariable String id, @RequestBody User userDetails) {
        Optional<User> existingUser = userService.getUserById(id);
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            user.setUserName(userDetails.getUserName());
            user.setEmail(userDetails.getEmail());
            user.setUpdatedAt(LocalDateTime.now());
            User updatedUser = userService.updateUser(user);
            return ResponseEntity.ok("OK");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete User
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        Optional<User> existingUser = userService.getUserById(id);
        if (existingUser.isPresent()) {
            userService.deleteUser(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
