package com.restfulApis.CampusFoodApp.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FoodItemRequestDTO {
	
	@NotBlank
	private String name;
	
	@NotNull
	@DecimalMax("1000")
	@DecimalMin("0")
	private double price;
	
	private String category;
	
	private boolean available;
	
	private Long foodStallId;

}
