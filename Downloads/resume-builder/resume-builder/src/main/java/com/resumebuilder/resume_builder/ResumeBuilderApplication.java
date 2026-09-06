package com.resumebuilder.resume_builder;

import java.io.File;
import java.nio.file.Files;
import java.util.stream.Stream;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ResumeBuilderApplication {

	public static void main(String[] args) {
		loadDotEnv();
		SpringApplication.run(ResumeBuilderApplication.class, args);
	}

	private static void loadDotEnv() {
		File envFile = new File(".env");
		if (envFile.exists()) {
			try (Stream<String> lines = Files.lines(envFile.toPath())) {
				lines.forEach(line -> {
					String trimmed = line.trim();
					if (!trimmed.isEmpty() && !trimmed.startsWith("#") && trimmed.contains("=")) {
						String[] parts = trimmed.split("=", 2);
						String key = parts[0].trim();
						String val = parts[1].trim();
						if (System.getProperty(key) == null && System.getenv(key) == null) {
							System.setProperty(key, val);
						}
					}
				});
				System.out.println("[ENV] Loaded environment variables from .env file");
			} catch (Exception ex) {
				System.err.println("[ENV] Warning: Failed to load .env file: " + ex.getMessage());
			}
		}
	}
}
