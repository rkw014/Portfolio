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
        Optional<User> curUser = userService.getUserBySub(userId);
        if (curUser.isEmpty()){
            User newUser = new User();
            newUser.setSub( userId);
            newUser.setEmail(email);
            newUser.setUserName(userName);
            newUser.setCreatedAt(LocalDateTime.now());
            newUser.setUpdatedAt(LocalDateTime.now());
            newUser.setVersion(0L);
            User createdUser = userService.createUser(newUser);
            return ResponseEntity.ok("OK " + createdUser.getId().toString());
        }
        return ResponseEntity.ok("OK");
    }

    @GetMapping("/{sub}")
    public ResponseEntity<User> getUserBySub(@PathVariable String sub) {
        Optional<User> user = userService.getUserBySub(sub);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{sub}")
    @Transactional
    public ResponseEntity<String> updateUser(@PathVariable String sub, @RequestBody User userDetails) {
        Optional<User> existingUser = userService.getUserBySub(sub);
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
    @DeleteMapping("/{sub}")
    @Transactional
    public ResponseEntity<Void> deleteUser(@PathVariable String sub) {
        Optional<User> existingUser = userService.getUserBySub(sub);
        if (existingUser.isPresent()) {
            userService.deleteUser(existingUser.get().getSub());
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
