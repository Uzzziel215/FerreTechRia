package com.ferreteria.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Aplicar la configuración de CORS definida en CorsConfig
            .cors(withDefaults())
            // Desactivar CSRF, común para APIs REST que no usan cookies para sesión
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(authz -> authz
                // Permitir peticiones OPTIONS (preflight) sin autenticación
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                // Permitir acceso público al endpoint de login
                .requestMatchers("/api/usuarios/login").permitAll()
                // Requerir autenticación para cualquier otra petición
                .anyRequest().authenticated()
            );
        return http.build();
    }
}
