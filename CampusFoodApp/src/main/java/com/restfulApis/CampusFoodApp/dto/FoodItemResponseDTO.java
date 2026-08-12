package com.restfulApis.CampusFoodApp.dto;

import lombok.Data;

@Data
public class FoodItemResponseDTO {
	
	private Long id;
	

	private String name;
	
	private double price;
	
	private String category;
	
	private boolean available;
	
	private Long foodStallId;

}
