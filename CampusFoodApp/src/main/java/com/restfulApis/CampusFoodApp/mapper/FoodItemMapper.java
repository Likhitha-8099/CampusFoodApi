package com.restfulApis.CampusFoodApp.mapper;

import org.springframework.stereotype.Component;

import com.restfulApis.CampusFoodApp.Entity.FoodItem;
import com.restfulApis.CampusFoodApp.dto.FoodItemRequestDTO;
import com.restfulApis.CampusFoodApp.dto.FoodItemResponseDTO;

@Component
public class FoodItemMapper {
   
	public FoodItem toEntity(FoodItemRequestDTO dto) {
		FoodItem foodItem=new FoodItem();
		
		foodItem.setName(dto.getName());
		foodItem.setPrice(dto.getPrice());
		foodItem.setCategory(dto.getCategory());
		foodItem.setAvailable(dto.isAvailable());
		return foodItem;
		
	}
	public FoodItemResponseDTO toResponseDTO(FoodItem foodItem) {

	    FoodItemResponseDTO dto = new FoodItemResponseDTO();

	    dto.setId(foodItem.getId());
	    dto.setName(foodItem.getName());
	    dto.setPrice(foodItem.getPrice());
	    dto.setCategory(foodItem.getCategory());
	    dto.setAvailable(foodItem.isAvailable());
	    dto.setFoodStallId(foodItem.getFoodStall().getId());

	    return dto;
	}
	public void updateEntity(FoodItem foodItem,FoodItemRequestDTO dto) {
		foodItem.setName(dto.getName());
	    foodItem.setPrice(dto.getPrice());
	    foodItem.setCategory(dto.getCategory());
	    foodItem.setAvailable(dto.isAvailable());
	}
}
