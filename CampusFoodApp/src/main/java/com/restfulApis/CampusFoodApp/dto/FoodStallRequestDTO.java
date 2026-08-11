package com.restfulApis.CampusFoodApp.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class FoodStallRequestDTO {
	
	@NotBlank
	private String name;
	
	@NotBlank
	@Size(min=3 ,max=20)
	private String ownerName;
	
	@NotBlank
	private String location;
	
	@NotBlank
	@Pattern(regexp="^[0-9]{10}$")
	private String phoneNumber;
	
	@DecimalMin("0.0")
	@DecimalMax("5.0")
	private double rating;

}
