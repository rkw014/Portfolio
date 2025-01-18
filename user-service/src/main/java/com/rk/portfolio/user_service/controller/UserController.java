package com.rk.portfolio.user_service.controller;

import com.rk.portfolio.user_service.model.User;
import com.rk.portfolio.user_service.service.UserService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<String> createUser(
            @RequestHeader("X-User-Id") String userId,
            @RequestHeader("X-User-Email") String email,
            @RequestHeader("X-User-Name") String userName,
            @RequestBody User user
    ){
        User curUser = userService.createUser(userId,email,userName);
        if (curUser == null){
            return ResponseEntity.ok("OK");
        }
            return ResponseEntity.ok("OK " + curUser.getId().toString());
    }

    @GetMapping("/{sub}")
    public ResponseEntity<User> getUserBySub(@PathVariable String sub) {
        Optional<User> user = userService.getUserBySub(sub);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{sub}")
    public ResponseEntity<String> updateUser(@PathVariable String sub, @RequestBody User userDetails) {
        try {
            userService.updateUser(sub, userDetails);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok("OK");
    }

    // Delete User
    @DeleteMapping("/{sub}")
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
