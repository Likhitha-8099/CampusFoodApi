package com.restfulApis.CampusFoodApp.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.restfulApis.CampusFoodApp.Entity.FoodItem;
import com.restfulApis.CampusFoodApp.Entity.FoodStall;
import com.restfulApis.CampusFoodApp.dto.FoodItemRequestDTO;
import com.restfulApis.CampusFoodApp.dto.FoodItemResponseDTO;
import com.restfulApis.CampusFoodApp.exception.ResourceNotFoundException;
import com.restfulApis.CampusFoodApp.mapper.FoodItemMapper;
import com.restfulApis.CampusFoodApp.repository.FoodItemRepository;
import com.restfulApis.CampusFoodApp.repository.FoodStallRepository;

import lombok.Data;

@Service
@Data
public class FoodItemService {
	
	private FoodItemRepository foodItemRepo;
	private FoodStallRepository foodStallRepo;
	private FoodItemMapper foodItemMapper;
	FoodItemService(FoodItemRepository foodItemRepo,FoodStallRepository foodStallRepo,FoodItemMapper foodItemMapper) {
		this.foodItemRepo=foodItemRepo;
		this.foodStallRepo=foodStallRepo;
		this.foodItemMapper = foodItemMapper;
	}
	
	public FoodItemResponseDTO createFoodItem(FoodItemRequestDTO dto) {
		FoodItem foodItem=foodItemMapper.toEntity(dto);
		FoodStall foodStall=foodStallRepo.findById(dto.getFoodStallId()).orElseThrow(()->
		                     new ResourceNotFoundException("Food stall not found"));
		foodItem.setFoodStall(foodStall);

	    // 4. Save FoodItem
	    FoodItem saved = foodItemRepo.save(foodItem);

	    // 5. Convert Entity → ResponseDTO
	    return foodItemMapper.toResponseDTO(saved);
	}
	public List<FoodItemResponseDTO> getAllFoodItems(FoodItem foodItem){
	   List<FoodItem> foodItems=foodItemRepo.findAll();
	   List<FoodItemResponseDTO> responses = new ArrayList<>();
	   for (FoodItem foodItem1 : foodItems) {
		   FoodItemResponseDTO response=foodItemMapper.toResponseDTO(foodItem1);
		   responses.add(response);
	   }
	   return responses;
	}
	public FoodItemResponseDTO getFoodItemById(Long id) {

	    FoodItem foodItem = foodItemRepo.findById(id)
	            .orElseThrow(() ->
	                    new ResourceNotFoundException("Food item not found"));

	    return foodItemMapper.toResponseDTO(foodItem);
	}

	public FoodItemResponseDTO updateFoodItem(Long id, FoodItemRequestDTO dto) {
		FoodItem item=foodItemRepo.findById(id).orElseThrow(()->new ResourceNotFoundException("Food item not found"));

        foodItemMapper.updateEntity(item, dto);
		
        FoodItem saved=foodItemRepo.save(item);
        return foodItemMapper.toResponseDTO(saved);
		
	}

	public void deleteFoodItemById(Long id) {
		 FoodItem item = foodItemRepo.findById(id)
		            .orElseThrow(() ->
		                    new ResourceNotFoundException("Food item not found"));

		foodItemRepo.delete(item);
		
	}
	

}
