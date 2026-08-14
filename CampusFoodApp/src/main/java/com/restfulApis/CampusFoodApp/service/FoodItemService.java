package com.restfulApis.CampusFoodApp.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
	
	public List<FoodItemResponseDTO> getFoodItemsByStallId(Long stallId){
		List<FoodItem> foodItem=foodItemRepo.findByFoodStallId(stallId);
		List<FoodItemResponseDTO> response=foodItemMapper.list(foodItem);
		return response;
		
	}
	
	public List<FoodItemResponseDTO> getFoodItemByStallName(String name){
		List<FoodItem> foodItem=foodItemRepo.findByNameContainingIgnoreCase(name);
		List<FoodItemResponseDTO> response=foodItemMapper.list(foodItem);
		return response;
	}
	
	public List<FoodItemResponseDTO> getbyMaxPrice(double maxPrice){
		List<FoodItem> foodItem=foodItemRepo.findByPriceLessThan(maxPrice);
		List<FoodItemResponseDTO> response=foodItemMapper.list(foodItem);
		return response;
		
	}
	public List<FoodItemResponseDTO> filterFoodItems(String category,double maxPrice){
		List<FoodItem> foodItem=foodItemRepo.findByCategoryAndPrice(category, maxPrice);
		List<FoodItemResponseDTO> dto= foodItemMapper.list(foodItem);
		return dto;
	}
	
	public List<FoodItemResponseDTO> categoryAndAvailble(String category,boolean availble){
		List<FoodItem> foodItem=foodItemRepo.findByCategoryAndAvailable(category, availble);
		List<FoodItemResponseDTO> dto=foodItemMapper.list(foodItem);
		return dto;
	}
	public Page<FoodItemResponseDTO> getAllFoodItems(int page,int size){
		Pageable pageable =PageRequest.of(page, size);
	Page<FoodItem> foodItems=foodItemRepo.findAll(pageable);
	    return foodItems.map(item -> foodItemMapper.toResponseDTO(item));

	}

	public String getFoodItemAsHtml(Long id) {
		FoodItem item = foodItemRepo.findById(id)
		        .orElseThrow(() ->
		            new ResourceNotFoundException("Food item not found"));
		String html = """
		        <html>
		        <body>
		            <h1>%s</h1>
		            <p>Price: ₹%.2f</p>
		            <p>Category: %s</p>
		            <p>Available: %s</p>
		        </body>
		        </html>
		        """.formatted(
		            item.getName(),
		            item.getPrice(),
		            item.getCategory(),
		            item.isAvailable()
		        );

		return html;
	
	}

}
