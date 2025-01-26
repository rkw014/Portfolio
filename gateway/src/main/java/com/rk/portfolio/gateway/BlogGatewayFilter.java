package com.rk.portfolio.gateway;

import java.util.List;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.server.ServerWebExchange;

import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Slf4j
public class BlogGatewayFilter implements GatewayFilter {
  @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        return ReactiveSecurityContextHolder.getContext()
            .flatMap(securityContext -> {
                Authentication authentication = securityContext.getAuthentication();

                if (authentication instanceof JwtAuthenticationToken) {
                    Jwt jwt = ((JwtAuthenticationToken) authentication).getToken();
                    // Cognito 通常会把用户组放在 "cognito:groups" 字段中
                    List<String> groups = jwt.getClaimAsStringList("cognito:groups");

                    // 检查用户是否属于 blogAdmin 组
                    if (groups == null || !groups.contains("blogAdmin")){
                        exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                        return exchange.getResponse().setComplete();
                    }
                    return chain.filter(exchange);
                }

                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            });

    }
}
