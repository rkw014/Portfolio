package com.rk.portfolio.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;


@SpringBootApplication
public class GatewayApplication {

	public static void main(String[] args) {
		SpringApplication.run(GatewayApplication.class, args);
	}

	@Bean
	public RouteLocator gatewayRoutes(RouteLocatorBuilder builder) {
		return builder.routes()
			// ==========================
			// 1. User Service Route
			// ==========================
			.route("user-service-route", r -> r
				.path("/api/users/**")
				.filters(f -> f
					.filter(new RateLimiterFilter())
					.filter(new NewUserGatewayFilter())
				)
				.uri("http://localhost:6100")
			)
			// ==========================
			// 2. Blog Service Route
			// ==========================
			.route("blog-service-route", r -> r
				.path("/api/blogs/**")
				.filters(f -> f
					.filter(new RateLimiterFilter())
					.filter(new BlogGatewayFilter())
				)
				// The blog service is private, but available at this internal URL
				.uri("http://localhost:6200")
			)
			// ==========================
			// 3. Project Service Route
			// ==========================
			.route("project-service-route", r -> r
				.path("/api/projects/**")
				.filters(f -> f
					.filter(new RateLimiterFilter())
					.filter(new BlogGatewayFilter())
				)
				// The blog service is private, but available at this internal URL
				.uri("http://localhost:6200")
			)
			.build();
	}

}
