package com.rk.portfolio.gateway;

import java.net.InetSocketAddress;
import java.time.Duration;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.RequestPath;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class RateLimiterFilter implements GatewayFilter {

    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

    private Bucket createNewBucket() {
        Bandwidth limit = Bandwidth.builder()
            .capacity(10)
            .refillGreedy(10, Duration.ofMinutes(1))
            .build();
        return Bucket.builder().addLimit(limit).build();
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        HttpMethod method = exchange.getRequest().getMethod();
        if (method == HttpMethod.OPTIONS) {  // CORS preflight checks
            return chain.filter(exchange);
        }

        // public accessble blogs
        RequestPath path = exchange.getRequest().getPath();
        if (path.toString().startsWith("/api/blogs") && method == HttpMethod.GET) {
            return chain.filter(exchange);
        }

        java.net.InetSocketAddress remoteAddress = exchange.getRequest().getRemoteAddress();
        if (remoteAddress == null || remoteAddress.getHostString() == null){
            return chain.filter(exchange);
        }
        InetSocketAddress addr = exchange.getRequest().getRemoteAddress();
        if (addr == null){
            exchange.getResponse().setStatusCode(HttpStatus.BAD_REQUEST);
            return exchange.getResponse().setComplete();
        }
        String ip = addr.getHostString();
        Bucket bucket = cache.computeIfAbsent(ip, k -> createNewBucket());

        if (bucket.tryConsume(1)) {
            return chain.filter(exchange);
        } else {
            exchange.getResponse().setStatusCode(HttpStatus.TOO_MANY_REQUESTS);
            return exchange.getResponse().setComplete();
        }
    }
}

