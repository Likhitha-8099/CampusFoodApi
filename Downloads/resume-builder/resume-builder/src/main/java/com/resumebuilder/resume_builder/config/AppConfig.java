package com.resumebuilder.resume_builder.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.client.RestTemplate;

@Configuration
public class AppConfig {

    @Value("${groq.api.connect-timeout:10000}")
    private int connectTimeout;

    @Value("${groq.api.read-timeout:30000}")
    private int readTimeout;

    /**
     * RestTemplate configured with timeouts from groq.api.* properties.
     * Default: 10s connect, 30s read.
     * Groq (llama-3.3-70b-versatile) is a non-thinking model and typically
     * responds in 2-8 seconds for typical resume+JD prompts.
     */
    @Bean
    RestTemplate restTemplate() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(connectTimeout);
        factory.setReadTimeout(readTimeout);
        return new RestTemplate(factory);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}