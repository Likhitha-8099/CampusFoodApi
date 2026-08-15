package com.restfulApis.CampusFoodApp.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.restfulApis.CampusFoodApp.Entity.FoodItem;
import com.restfulApis.CampusFoodApp.Entity.FoodStall;
import com.restfulApis.CampusFoodApp.dto.FoodItemResponseDTO;
import com.restfulApis.CampusFoodApp.dto.FoodStallRequestDTO;
import com.restfulApis.CampusFoodApp.dto.FoodStallResponseDTO;
import com.restfulApis.CampusFoodApp.exception.ResourceNotFoundException;
import com.restfulApis.CampusFoodApp.mapper.FoodItemMapper;
import com.restfulApis.CampusFoodApp.mapper.FoodstallMapper;
import com.restfulApis.CampusFoodApp.repository.FoodStallRepository;

@Service
public class FoodStallService {

    @Autowired
    private FoodStallRepository foodStallRepo;

    @Autowired
    private FoodItemMapper foodItemMapper;

    // =========================
    // CREATE
    // =========================

    public FoodStallResponseDTO createFoodStall(
            FoodStallRequestDTO foodStallDTO) {

        FoodStall foodStall =
                FoodstallMapper.toEntity(foodStallDTO);

        FoodStall saved =
                foodStallRepo.save(foodStall);

        return FoodstallMapper.toResponseDTO(saved);
    }

    // =========================
    // GET ALL
    // =========================

    public List<FoodStallResponseDTO> getAllFoodStalls() {

        List<FoodStall> foodStalls =
                foodStallRepo.findAll();

        List<FoodStallResponseDTO> responses =
                new ArrayList<>();

        for (FoodStall foodStall : foodStalls) {

            FoodStallResponseDTO response =
                    FoodstallMapper.toResponseDTO(foodStall);

            responses.add(response);
        }

        return responses;
    }

    // =========================
    // GET BY ID
    // =========================

    public FoodStallResponseDTO getFoodById(Long id) {

        FoodStall foodStall =
                foodStallRepo.findById(id)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Food stall not found"
                    )
                );

        return FoodstallMapper.toResponseDTO(foodStall);
    }

    // =========================
    // GET FOOD ITEMS BY STALL
    // =========================

    public List<FoodItemResponseDTO> getFoodItemsByStall(
            Long stallId) {

        FoodStall stall =
                foodStallRepo.findById(stallId)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Food stall not found"
                    )
                );

        List<FoodItem> foodItems =
                stall.getFoodItems();

        return foodItemMapper.list(foodItems);
    }

    // =========================
    // UPDATE
    // =========================

    public FoodStallResponseDTO updateFoodStall(
            Long id,
            FoodStallRequestDTO dto) {

        FoodStall existing =
                foodStallRepo.findById(id)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Food stall not found"
                    )
                );

        FoodstallMapper.updateEntity(
                existing,
                dto
        );

        FoodStall saved =
                foodStallRepo.save(existing);

        return FoodstallMapper.toResponseDTO(saved);
    }

    // =========================
    // DELETE
    // =========================

    public void deleteFoodStall(Long id) {

        FoodStall foodStall =
                foodStallRepo.findById(id)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Food stall not found"
                    )
                );

        foodStallRepo.delete(foodStall);
    }

    // =========================
    // PAGINATION
    // =========================

    public Page<FoodStallResponseDTO> getAllFoodStalls(
            Pageable pageable) {

        Page<FoodStall> foodStalls =
                foodStallRepo.findAll(pageable);

        return foodStalls.map(
                FoodstallMapper::toResponseDTO
        );
    }
}