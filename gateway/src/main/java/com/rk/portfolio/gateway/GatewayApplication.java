package com.rk.portfolio.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;

import java.util.Collections;

@SpringBootApplication
public class GatewayApplication {

	public static void main(String[] args) {
		SpringApplication.run(GatewayApplication.class, args);
	}

	@Bean
	public RouteLocator gatewayRoutes(RouteLocatorBuilder builder) {
		return builder.routes()
			.route("user-service-route", r -> r
				.path("/api/users/**")
//						.filters(f -> f.rewritePath("/api/users/(?<segment>.*)", "/users/${segment}"))
				.filters(f -> f
					.filter(new RateLimiterFilter())
					.filter(new NewUserGatewayFilter())
				)
				.uri("http://localhost:6100")
			)
			.build();
	}

}
