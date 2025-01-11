package com.rk.portfolio.user_service.service;

import com.rk.portfolio.user_service.model.User;
import com.rk.portfolio.user_service.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public User updateUser(User user) {
        return userRepository.save(user);
    }

    public void deleteUser(String sub) {
        userRepository.deleteBySub(sub);
    }

    public Optional<User> getUserBySub(String sub) {
        return userRepository.findBySub(sub);
    }
}