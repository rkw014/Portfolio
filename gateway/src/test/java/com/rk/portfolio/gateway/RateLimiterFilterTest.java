package com.rk.portfolio.gateway;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.mock.http.server.reactive.MockServerHttpRequest;
import org.springframework.mock.web.server.MockServerWebExchange;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.net.InetSocketAddress;

public class RateLimiterFilterTest {

    private RateLimiterFilter rateLimiterFilter;
    private GatewayFilterChain chain;

    @BeforeEach
    public void setup() {
        rateLimiterFilter = new RateLimiterFilter();
        chain = mock(GatewayFilterChain.class);
        // 当 chain.filter(...) 被调用时，返回一个空的 Mono<Void>
        when(chain.filter(any(ServerWebExchange.class))).thenReturn(Mono.empty());
    }

    private InetSocketAddress newAddr(String ip, int port){
        return new InetSocketAddress(ip, port);
    }

    private MockServerWebExchange createExchange(String path, String ip, int port) {
        MockServerHttpRequest request = MockServerHttpRequest.get(path)
                .remoteAddress(newAddr(ip, port))
                .build();
        return MockServerWebExchange.from(request);
    }

    @Test
    public void testRateLimiterAllows() {
        MockServerWebExchange exchange = createExchange("/api/users", "127.0.0.1", 8080);
        Mono<Void> result = rateLimiterFilter.filter(exchange, chain);
        StepVerifier.create(result)
                .verifyComplete();
        verify(chain, times(1)).filter(exchange);
    }

    @Test
    public void testRateLimiterBlocksAfterLimit() {
        String testIp = "192.168.1.1";

        // 模拟10次通过
        for (int i = 0; i < 10; i++) {
            MockServerWebExchange exchange = createExchange("/api/users", testIp, 8080);
            Mono<Void> result = rateLimiterFilter.filter(exchange, chain);
            StepVerifier.create(result)
                    .verifyComplete();
            verify(chain, times(i + 1)).filter(any(ServerWebExchange.class));
        }

        // 第11次请求应该被阻止
        MockServerWebExchange blockedExchange = createExchange("/api/users", testIp, 8080);
        Mono<Void> blockedResult = rateLimiterFilter.filter(blockedExchange, chain);
        StepVerifier.create(blockedResult)
                .verifyComplete();
        assert blockedExchange.getResponse().getStatusCode() == HttpStatus.TOO_MANY_REQUESTS;
        verify(chain, times(10)).filter(any(ServerWebExchange.class));
    }
}
