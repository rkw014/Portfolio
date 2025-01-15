package com.rk.portfolio.user_service.repository;

import com.rk.portfolio.user_service.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findBySub(String sub);

    void deleteBySub(String sub);
}