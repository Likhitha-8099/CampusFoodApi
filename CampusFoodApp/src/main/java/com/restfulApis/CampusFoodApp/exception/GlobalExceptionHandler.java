package com.restfulApis.CampusFoodApp.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.restfulApis.CampusFoodApp.dto.ErrorResponseDTO;

@ControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<ErrorResponseDTO> handleResourceNotFound(
	        ResourceNotFoundException ex) {

	    ErrorResponseDTO error = new ErrorResponseDTO();

	    error.setStatus(HttpStatus.NOT_FOUND.value());
	    error.setMessage(ex.getMessage());
	    error.setTimestamp(java.time.LocalDateTime.now().toString());

	    return ResponseEntity
	            .status(HttpStatus.NOT_FOUND)
	            .body(error);
	}
}