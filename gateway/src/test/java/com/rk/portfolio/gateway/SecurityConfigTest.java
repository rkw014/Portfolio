package com.rk.portfolio.gateway;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.test.web.reactive.server.SecurityMockServerConfigurers;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.security.test.web.reactive.server.SecurityMockServerConfigurers.*;

@SpringBootTest
@AutoConfigureWebTestClient
@Import(SecurityConfigTest.MockUserServiceController.class) // 导入模拟控制器
public class SecurityConfigTest {

    @Autowired
    private WebTestClient webTestClient;

    @RestController
    static class MockUserServiceController {
        @GetMapping("/api/users/test")
        public String testEndpoint() {
            return "Authenticated";
        }
    }

    @Test
    public void testUnauthenticatedAccess() {
        webTestClient.get()
                .uri("/api/users/test")
                .exchange()
                .expectStatus().isUnauthorized();
    }

    @Test
    public void testAuthenticatedAccess() {
        // 创建 Mock JWT
        Jwt jwt = Jwt.withTokenValue("token")
                .header("alg", "none")
                .claim("sub", "user123")
                .build();

        webTestClient.mutateWith(mockJwt())
                .get()
                .uri("/api/users/test")
                .exchange()
                .expectStatus().isOk()
                .expectBody(String.class).isEqualTo("Authenticated");
    }

    @Test
    public void testCorsConfiguration() {
        webTestClient.options()
                .uri("/api/users")
                .header("Access-Control-Request-Method", "POST")
                .header("Origin", "http://localhost")
                .exchange()
                .expectStatus().isOk()  // 预检请求应返回200 OK
                .expectHeader().valueEquals("Access-Control-Allow-Origin", "http://localhost")
                .expectHeader().valueEquals("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    }
}
