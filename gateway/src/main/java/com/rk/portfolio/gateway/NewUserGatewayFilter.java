package com.rk.portfolio.gateway;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import reactor.core.publisher.Mono;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;

public class NewUserGatewayFilter implements GatewayFilter {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        return ReactiveSecurityContextHolder.getContext()
            .flatMap(securityContext -> {
                Authentication authentication = securityContext.getAuthentication();

                if (authentication instanceof JwtAuthenticationToken) {
                    Jwt jwt = ((JwtAuthenticationToken) authentication).getToken();
                    // Cognito 通常会把用户 ID 放在 "sub" 字段中，或使用自定义 claims
                    String userId = jwt.getClaimAsString("sub");
                    String email = jwt.getClaimAsString("email");
                    String username = jwt.getClaimAsString("cognito:username");

                    // 将 userId 放到请求头中传给下游
                    ServerWebExchange mutedExchange = exchange.mutate()
                        .request(r -> r.headers(
                            headers -> {
                                headers.add("X-User-Id", userId);
                                headers.add("X-User-Email", email);
                                headers.add("X-User-Name", username);
                            }))
                        .build();
                    return chain.filter(mutedExchange);
                }
                return chain.filter(exchange);
            });

    }
}
