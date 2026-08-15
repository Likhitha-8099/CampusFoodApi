package com.restfulApis.CampusFoodApp.controller;


import org.springframework.http.MediaType;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
	
	@GetMapping("/{id}/food-items")
	public ResponseEntity<List<FoodItemResponseDTO>> foodItemByFoodStallId(@PathVariable Long id){
		List<FoodItemResponseDTO> li=foodItemService.getFoodItemsByStallId(id);
		return ResponseEntity.ok(li);
	}
	
	@GetMapping("/search")
	public ResponseEntity<List<FoodItemResponseDTO>> findItemByFoodStallName(@RequestParam String name){
		List<FoodItemResponseDTO> li=foodItemService.getFoodItemByStallName(name);
		return ResponseEntity.ok(li);
	}
	
	@GetMapping("/filter")
	public ResponseEntity<List<FoodItemResponseDTO>> findItemsLessThanMaxPrice(@RequestParam double maxPrice){
		List<FoodItemResponseDTO> li=foodItemService.getbyMaxPrice(maxPrice);
		return ResponseEntity.ok(li);
	}
	
	@GetMapping("/filter/category")
	public ResponseEntity<List<FoodItemResponseDTO>> filterItem(@RequestParam String category, @RequestParam double maxPrice){
		List<FoodItemResponseDTO> li=foodItemService.filterFoodItems(category, maxPrice);
		return ResponseEntity.ok(li);
	}
	@GetMapping("/filter/categoryAndAvailavility")
	public ResponseEntity<List<FoodItemResponseDTO>> findByCategoryAndAvailable(@RequestParam String category,@RequestParam boolean available){
		List<FoodItemResponseDTO> li=foodItemService.categoryAndAvailble(category, available);
		return ResponseEntity.ok(li);
		
	}
	@GetMapping("/page")
	public ResponseEntity<Page<FoodItemResponseDTO>> getFoodItems(
	        @RequestParam(defaultValue = "0") int page,
	        @RequestParam(defaultValue = "10") int size,
	        @RequestParam(defaultValue = "price") String sortBy,
	        @RequestParam(defaultValue = "asc") String direction) {

	    Page<FoodItemResponseDTO> response =
	            foodItemService.getAllFoodItems(
	                    page,
	                    size,
	                    sortBy,
	                    direction
	            );

	    return ResponseEntity.ok(response);
	}
	@GetMapping(value="/{id}/html" , produces="text/html")
	public ResponseEntity<String> getFoodItemAsHTML(@PathVariable Long id){
		 String html = foodItemService.getFoodItemAsHtml(id);

		    return ResponseEntity.ok(html);
	}
	@GetMapping("/{id}/pdf")
	public ResponseEntity<byte[]> getFoodItemPdf(@PathVariable Long id) {

	    byte[] pdf = foodItemService.generateFoodItemPdf(id);

	    return ResponseEntity.ok()
	            .contentType(MediaType.APPLICATION_PDF)
	            .body(pdf);
	}
}
