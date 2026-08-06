package com.restfulApis.CampusFoodApp.exception;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.restfulApis.CampusFoodApp.dto.ErrorResponse;
@ControllerAdvice
public class GlobalExceptionHandler {
	
	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<ErrorResponse> handleResourceNotFoundException(
	        ResourceNotFoundException ex) {
		 ErrorResponse error = new ErrorResponse(
	                LocalDateTime.now(),
	                HttpStatus.NOT_FOUND.value(),
	                ex.getMessage()
	        );
	    return ResponseEntity.status(HttpStatus.NOT_FOUND)
	            .body(error);
	}

}
