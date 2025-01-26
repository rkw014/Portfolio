package com.rk.portfolio.gateway;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.reactive.CorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {
    @Bean
    public SecurityWebFilterChain filterChain(ServerHttpSecurity http) throws Exception {

        http.cors(x -> x.configurationSource(corsConfigurationSource()));

        /*  following code is based on,
         *  https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/jwt.html#oauth2resourceserver-jwt-sansboot
         */

        http.authorizeExchange((exchanges) ->
            exchanges
                    .pathMatchers(HttpMethod.OPTIONS).permitAll()
                    .pathMatchers(HttpMethod.GET, "/api/blogs/presign").authenticated()
                    .pathMatchers(HttpMethod.GET, "/api/blogs/**").permitAll()
                    .pathMatchers("/api/users/**").authenticated()
                    .pathMatchers(HttpMethod.POST, "/api/blogs/**").authenticated()
                    .pathMatchers(HttpMethod.PUT, "/api/blogs/**").authenticated()
                    .pathMatchers(HttpMethod.DELETE, "/api/blogs/**").authenticated()
                    .anyExchange()
                    .denyAll()
        );

        http.oauth2ResourceServer( (oauth2) -> oauth2.jwt(Customizer.withDefaults()));


        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedMethods(List.of(
            HttpMethod.GET.name(),
            HttpMethod.PUT.name(),
            HttpMethod.POST.name(),
            HttpMethod.DELETE.name(),
            HttpMethod.OPTIONS.name()
        ));

        // Fxxx yxx chrome-extension://**
        configuration.setAllowedOrigins(List.of("*"));

        configuration.addAllowedHeader("authorization");
        configuration.addAllowedHeader("content-type");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
