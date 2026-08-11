package com.restfulApis.CampusFoodApp.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.restfulApis.CampusFoodApp.Entity.FoodStall;
import com.restfulApis.CampusFoodApp.dto.FoodStallRequestDTO;
import com.restfulApis.CampusFoodApp.dto.FoodStallResponseDTO;
import com.restfulApis.CampusFoodApp.exception.ResourceNotFoundException;
import com.restfulApis.CampusFoodApp.mapper.FoodstallMapper;
import com.restfulApis.CampusFoodApp.repository.FoodStallRepository;

@Service
public class FoodStallService {

    @Autowired
    private FoodStallRepository foodStallRepo;

    public FoodStallResponseDTO createFoodStall(FoodStallRequestDTO foodStallDTO) {

        FoodStall foodStall = FoodstallMapper.toEntity(foodStallDTO);
        FoodStall saved = foodStallRepo.save(foodStall);
        return FoodstallMapper.toResponseDTO(saved);

//        foodStall.setName(foodStallDTO.getName());
//        foodStall.setOwnerName(foodStallDTO.getOwnerName());
//        foodStall.setLocation(foodStallDTO.getLocation());
//        foodStall.setPhoneNumber(foodStallDTO.getPhoneNumber());
//        foodStall.setRating(foodStallDTO.getRating());
//        
//        FoodStall saved = foodStallRepo.save(foodStall);
//
//        FoodStallResponseDTO response = new FoodStallResponseDTO();
//
//        response.setId(saved.getId());
//        response.setName(saved.getName());
//        response.setOwnerName(saved.getOwnerName());
//        response.setLocation(saved.getLocation());
//        response.setRating(saved.getRating());

//        return response;
    }

    public List<FoodStallResponseDTO> getAllFoodStalls() {
    	List<FoodStall> foodStalls=foodStallRepo.findAll();
    	
    	List<FoodStallResponseDTO> responses=new ArrayList<>();
		for (FoodStall foodStall : foodStalls) {

			FoodStallResponseDTO response = FoodstallMapper.toResponseDTO(foodStall);

			responses.add(response);
		}
        return responses;
    }

    public FoodStallResponseDTO getFoodById(Long id) {
    	FoodStall foodStall=foodStallRepo.findById(id).orElseThrow(()->new ResourceNotFoundException("Food stall not found"));
    	FoodStallResponseDTO response=FoodstallMapper.toResponseDTO(foodStall);
        
        return response;
        
    }
    public FoodStallResponseDTO updateFoodStall(
            Long id,
            FoodStallRequestDTO dto) {

        FoodStall existing = foodStallRepo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Food stall not found"));

        FoodstallMapper.updateEntity(existing, dto);

        FoodStall saved = foodStallRepo.save(existing);

        return FoodstallMapper.toResponseDTO(saved);
    }
    public void deleteFoodStall(Long id) {

        FoodStall foodStall = foodStallRepo.findById(id)
                .orElseThrow(() ->
                new ResourceNotFoundException("Food stall not found"));

        foodStallRepo.delete(foodStall);
    }
}
