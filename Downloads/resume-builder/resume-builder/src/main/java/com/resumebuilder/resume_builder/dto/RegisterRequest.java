package com.resumebuilder.resume_builder.dto;

import lombok.Data;

@Data
public class RegisterRequest {
	
	private String name;
	
	private String email;
	
	private String password;

}
