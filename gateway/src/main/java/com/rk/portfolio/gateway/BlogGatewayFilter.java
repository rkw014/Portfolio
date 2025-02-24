package com.rk.portfolio.gateway;

import java.util.List;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.server.ServerWebExchange;

import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Slf4j
public class BlogGatewayFilter implements GatewayFilter {
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        HttpMethod method = exchange.getRequest().getMethod();

        if (HttpMethod.GET == method) {
            // GET 请求，无论是否携带 token，都允许访问，嵌入 X-Is-Admin-User 头
            return ReactiveSecurityContextHolder.getContext()
                    // 当安全上下文为空时，用匿名用户构造一个默认安全上下文
                    .defaultIfEmpty(new SecurityContextImpl(
                            new AnonymousAuthenticationToken("anonymousKey", "anonymousUser",
                                    AuthorityUtils.createAuthorityList("ROLE_ANONYMOUS"))))
                    .flatMap(securityContext -> {
                        Authentication authentication = securityContext.getAuthentication();
                        if (authentication instanceof JwtAuthenticationToken) {
                            Jwt jwt = ((JwtAuthenticationToken) authentication).getToken();
                            List<String> groups = jwt.getClaimAsStringList("cognito:groups");
                            if (groups != null && groups.contains("blogAdmin")) {
                                ServerWebExchange mutatedExchange = exchange.mutate()
                                        .request(r -> r.headers(
                                                headers -> headers.set("X-Is-Admin-User", "true")))
                                        .build();
                                return chain.filter(mutatedExchange);
                            }
                        }
                        // 始终添加 X-Is-Admin-User 头，确保后端接收
                        ServerWebExchange mutatedExchange = exchange.mutate()
                                .request(r -> r
                                        .headers(headers -> headers.set("X-Is-Admin-User", "false")))
                                .build();
                        return chain.filter(mutatedExchange);
                    });
        }

        return ReactiveSecurityContextHolder.getContext()
                .flatMap(securityContext -> {
                    Authentication authentication = securityContext.getAuthentication();

                    if (authentication instanceof JwtAuthenticationToken) {
                        Jwt jwt = ((JwtAuthenticationToken) authentication).getToken();
                        // Cognito 通常会把用户组放在 "cognito:groups" 字段中
                        List<String> groups = jwt.getClaimAsStringList("cognito:groups");

                        // 检查用户是否属于 blogAdmin 组
                        if (groups == null || !groups.contains("blogAdmin")) {
                            exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                            return exchange.getResponse().setComplete();
                        }
                        return chain.filter(exchange);
                    }

                    exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                    return exchange.getResponse().setComplete();
                });

    }
}
