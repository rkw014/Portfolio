package com.rk.portfolio.user_service.service;

import com.rk.portfolio.user_service.model.User;
import com.rk.portfolio.user_service.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Transactional
    public User createUser(String id, String email, String name) {
        Optional<User> curUser = userRepository.findBySub(id);
        if (curUser.isEmpty()){
            User newUser = new User();
            newUser.setSub(id);
            newUser.setEmail(email);
            newUser.setUserName(name);
            newUser.setCreatedAt(LocalDateTime.now());
            newUser.setUpdatedAt(LocalDateTime.now());
            User createdUser = userRepository.save(newUser);
            return createdUser;
        }
        return null;
    }

    @Transactional
    public User updateUser(String sub, User userDetails) {
        Optional<User> existingUser = userRepository.findBySub(sub);
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            user.setUserName(userDetails.getUserName());
            user.setEmail(userDetails.getEmail());
            user.setUpdatedAt(LocalDateTime.now());
            User updatedUser = userRepository.save(user);
            return updatedUser;
        } else {
            throw new EntityNotFoundException();
        }
    }

    @Transactional
    public void deleteUser(String sub) {
        userRepository.deleteBySub(sub);
    }

    public Optional<User> getUserBySub(String sub) {
        return userRepository.findBySub(sub);
    }
}