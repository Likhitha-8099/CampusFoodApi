package com.restfulApis.CampusFoodApp.mapper;

import java.util.ArrayList;
import java.util.List;

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

	    if (foodItem.getFoodStall() != null) {
	        dto.setFoodStallId(foodItem.getFoodStall().getId());
	    }

	    return dto;
	}
	public void updateEntity(FoodItem foodItem,FoodItemRequestDTO dto) {
		foodItem.setName(dto.getName());
	    foodItem.setPrice(dto.getPrice());
	    foodItem.setCategory(dto.getCategory());
	    foodItem.setAvailable(dto.isAvailable());
	}
	public List<FoodItemResponseDTO> list(List<FoodItem> foodItem){
		List<FoodItemResponseDTO> dtoli=new ArrayList<>();
		for(FoodItem item:foodItem) {
			dtoli.add(toResponseDTO(item));
		}
		return dtoli;
		
	}

	
}
