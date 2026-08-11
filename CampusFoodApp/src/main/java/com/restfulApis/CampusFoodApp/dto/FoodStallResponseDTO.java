package com.restfulApis.CampusFoodApp.dto;

import lombok.Data;

@Data
public class FoodStallResponseDTO {
	private Long id;
	private String name;
	private String ownerName;
	private String location;
	private Double rating;
}
