package com.restfulApis.CampusFoodApp.mapper;

import com.restfulApis.CampusFoodApp.Entity.FoodStall;
import com.restfulApis.CampusFoodApp.dto.FoodStallRequestDTO;
import com.restfulApis.CampusFoodApp.dto.FoodStallResponseDTO;

public class FoodstallMapper {
	
	public static FoodStall toEntity(FoodStallRequestDTO dto) {
		FoodStall foodStall=new FoodStall();
		 foodStall.setName(dto.getName());
	        foodStall.setOwnerName(dto.getOwnerName());
	        foodStall.setLocation(dto.getLocation());
	        foodStall.setPhoneNumber(dto.getPhoneNumber());
	        foodStall.setRating(dto.getRating());

	        return foodStall;
		
	}
	public static FoodStallResponseDTO toResponseDTO(FoodStall foodStall) {
		FoodStallResponseDTO foodStallResponse=new FoodStallResponseDTO();
		foodStallResponse.setId(foodStall.getId());
		foodStallResponse.setLocation(foodStall.getLocation());
		foodStallResponse.setName(foodStall.getName());
		foodStallResponse.setOwnerName(foodStall.getOwnerName());
		foodStallResponse.setRating(foodStall.getRating());
		return foodStallResponse;
	}
	public static void updateEntity(
	        FoodStall foodStall,
	        FoodStallRequestDTO dto) {

	    foodStall.setName(dto.getName());
	    foodStall.setOwnerName(dto.getOwnerName());
	    foodStall.setPhoneNumber(dto.getPhoneNumber());
	    foodStall.setRating(dto.getRating());
	    foodStall.setLocation(dto.getLocation());
	}  
}
