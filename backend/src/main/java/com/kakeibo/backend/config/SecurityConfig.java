package com.kakeibo.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, CorsConfigurationSource corsConfigurationSource) throws Exception {
        http
                // CORSの設定を適用
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // CSRF対策を一時的に無効化（API開発の初期段階ではPOSTが失敗するため）
                .csrf(AbstractHttpConfigurer::disable)
                // すべてのリクエストを許可（認証機能作る前まで）
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // 環境変数の値を取得
        String allowedOrigin = System.getenv("ALLOWED_ORIGIN");
        configuration.setAllowedOrigins(List.of(allowedOrigin != null ? allowedOrigin : "http://localhost:5173"));
        // 許可するメソッド
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        // 許可するヘッダー
        configuration.setAllowedHeaders(List.of("*"));
        //　クッキーなどの認証情報を許可
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**",configuration);
        return source;

    }
}
