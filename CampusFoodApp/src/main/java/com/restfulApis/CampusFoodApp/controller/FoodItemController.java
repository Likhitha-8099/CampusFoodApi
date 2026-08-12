package com.restfulApis.CampusFoodApp.controller;


import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.restfulApis.CampusFoodApp.Entity.FoodItem;
import com.restfulApis.CampusFoodApp.dto.FoodItemRequestDTO;
import com.restfulApis.CampusFoodApp.dto.FoodItemResponseDTO;
import com.restfulApis.CampusFoodApp.service.FoodItemService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/food-items")
public class FoodItemController {
	
	private FoodItemService foodItemService;
	FoodItemController(FoodItemService service){
		this.foodItemService=service;
	}
	@PostMapping
	public ResponseEntity<FoodItemResponseDTO> createFoodItem(@Valid @RequestBody FoodItemRequestDTO dto){
		FoodItemResponseDTO saved=foodItemService.createFoodItem(dto);
		return ResponseEntity.status(HttpStatus.CREATED).body(saved);
	}
	@GetMapping
	public ResponseEntity<List<FoodItemResponseDTO>> getAllFoodItems(FoodItem foodItems){
		List<FoodItemResponseDTO> responses=foodItemService.getAllFoodItems(foodItems);
		return ResponseEntity.ok(responses);
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<FoodItemResponseDTO> getFoodItemById(@PathVariable Long id) {
		FoodItemResponseDTO item=foodItemService.getFoodItemById(id);
		return ResponseEntity.ok(item);
		
		
	}
	@PutMapping("/{id}")
	public ResponseEntity<FoodItemResponseDTO> updateFoodItem(@PathVariable Long id,@Valid @RequestBody FoodItemRequestDTO dto){
		FoodItemResponseDTO response=foodItemService.updateFoodItem(id,dto);
		return ResponseEntity.ok(response);
		
	}
	
	@DeleteMapping("/{id}")
	public void deleteFoodItemById(@PathVariable Long id){
		foodItemService.deleteFoodItemById(id);
	}

}
