package com.resumebuilder.resume_builder.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.resumebuilder.resume_builder.dto.RegisterRequest;
import com.resumebuilder.resume_builder.model.User;
import com.resumebuilder.resume_builder.repository.UserRepository;

@Service
public class AuthService {
	
	private  UserRepository userRepository;
	
	private  PasswordEncoder passwordEncoder;
     
	public AuthService(UserRepository userRepository,PasswordEncoder passwordEncoder) {
		
		this.userRepository=userRepository;
		this.passwordEncoder=passwordEncoder;
	}
	public String register(RegisterRequest request) {

	    if(userRepository.existsByEmail(request.getEmail())) {
	        throw new RuntimeException("Email already exists");
	    }

	    User user = new User();

	    user.setName(request.getName());
	    user.setEmail(request.getEmail());

	    user.setPassword(
	            passwordEncoder.encode(request.getPassword())
	    );

	    user.setRole("USER");

	    userRepository.save(user);

	    return "User registered successfully";
	}
}
