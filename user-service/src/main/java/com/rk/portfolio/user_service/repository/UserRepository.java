package com.rk.portfolio.user_service.repository;

import com.rk.portfolio.user_service.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {
}