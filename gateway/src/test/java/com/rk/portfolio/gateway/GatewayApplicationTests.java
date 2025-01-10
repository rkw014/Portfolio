package com.rk.portfolio.gateway;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.Route;
import reactor.core.publisher.Flux;
import reactor.test.StepVerifier;

@SpringBootTest
public class GatewayApplicationTests {

	@Autowired
	private RouteLocator routeLocator;

	@Test
	public void testRoutes() {
		Flux<Route> routes = routeLocator.getRoutes();

		StepVerifier.create(routes)
				.expectNextMatches(route ->
						route.getId().equals("user-service-route") &&
								route.getUri().toString().equals("http://localhost:6100") &&
								route.getPredicate().toString().contains("/api/users/**")
				)
				.verifyComplete();
	}
}
