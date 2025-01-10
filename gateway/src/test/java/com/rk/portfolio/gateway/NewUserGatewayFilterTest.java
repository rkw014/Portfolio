package com.rk.portfolio.gateway;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.mock.http.server.reactive.MockServerHttpRequest;
import org.springframework.mock.web.server.MockServerWebExchange;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;

public class NewUserGatewayFilterTest {

    private NewUserGatewayFilter filter;
    private GatewayFilterChain chain;

    @BeforeEach
    void setup() {
        filter = new NewUserGatewayFilter();
        chain = mock(GatewayFilterChain.class);
        // 当 chain.filter(...) 被调用时，返回一个空的 Mono<Void>
        when(chain.filter(any(ServerWebExchange.class))).thenReturn(Mono.empty());
    }

    @Test
    void testFilterWithJwt() {
        // 1) 创建模拟的 Jwt
        Jwt jwt = Jwt.withTokenValue("test-token")
                .header("alg", "none")
                .claim("sub", "user123")
                .claim("email", "user@example.com")
                .claim("cognito:username", "username")
                .build();

        // 2) 创建 Authentication（传入自定义权限）
        Authentication authentication = new JwtAuthenticationToken(
                jwt,
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
        );

        // 3) 创建 SecurityContext
        SecurityContext securityContext = new SecurityContextImpl(authentication);

        // 4) 创建 mock 请求和 exchange
        MockServerHttpRequest request = MockServerHttpRequest.get("/api/users/test").build();
        MockServerWebExchange exchange = MockServerWebExchange.from(request);

        // 5) 将 SecurityContext 放入 Reactor 上下文：
        //    关键点：必须使用 withSecurityContext(Mono.just(securityContext))
        Mono<Void> result = Mono.defer(() -> filter.filter(exchange, chain))
                .contextWrite(ReactiveSecurityContextHolder.withSecurityContext(Mono.just(securityContext)));

        // 6) 验证结果：应当 onComplete()
        StepVerifier.create(result)
                .expectSubscription()
                .expectComplete()
                .verify();

        // 7) 验证 chain.filter(...) 只调用一次，并且 Exchange 里应当带了头
        verify(chain, times(1))
                .filter(argThat(ex -> {
                    String userId = ex.getRequest().getHeaders().getFirst("X-User-Id");
                    String email = ex.getRequest().getHeaders().getFirst("X-User-Email");
                    String username = ex.getRequest().getHeaders().getFirst("X-User-Name");
                    return "user123".equals(userId)
                            && "user@example.com".equals(email)
                            && "username".equals(username);
                }));
    }

    @Test
    void testFilterWithoutJwt() {
        // 1) 创建一个没有 Authentication 的 SecurityContext
        SecurityContext securityContext = new SecurityContextImpl(null);

        // 2) 创建 mock 请求
        MockServerHttpRequest request = MockServerHttpRequest.get("/api/users/test").build();
        MockServerWebExchange exchange = MockServerWebExchange.from(request);

        // 3) 将空的 SecurityContext 放入 Reactor 上下文
        Mono<Void> result = Mono.defer(() -> filter.filter(exchange, chain))
                .contextWrite(ReactiveSecurityContextHolder.withSecurityContext(Mono.just(securityContext)));

        // 4) 验证结果：应当 onComplete()
        StepVerifier.create(result)
                .expectSubscription()
                .expectComplete()
                .verify();

        // 5) 验证 chain.filter(...) 被调用时，
        //    不应携带 "X-User-Id" / "X-User-Email" / "X-User-Name" 等头
        verify(chain, times(1)).filter(exchange);
    }
}
