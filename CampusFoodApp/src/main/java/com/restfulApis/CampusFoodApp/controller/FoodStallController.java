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

import com.restfulApis.CampusFoodApp.Entity.FoodStall;
import com.restfulApis.CampusFoodApp.dto.FoodStallRequestDTO;
import com.restfulApis.CampusFoodApp.dto.FoodStallResponseDTO;
import com.restfulApis.CampusFoodApp.service.FoodStallService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/stalls")
public class FoodStallController {

    private final FoodStallService foodStallService;

    public FoodStallController(FoodStallService foodStallService) {
        this.foodStallService = foodStallService;
    }
    @PostMapping
    public ResponseEntity<FoodStallResponseDTO> createFoodStall(
            @Valid @RequestBody FoodStallRequestDTO dto) {

        FoodStallResponseDTO saved =
                foodStallService.createFoodStall(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(saved);
    }

    @GetMapping
    public ResponseEntity<List<FoodStallResponseDTO>> getAllFoodStalls() {

        List<FoodStallResponseDTO> responses =
                foodStallService.getAllFoodStalls();

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FoodStallResponseDTO> getFoodById(
            @PathVariable Long id) {

        FoodStallResponseDTO response =
                foodStallService.getFoodById(id);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FoodStallResponseDTO> updateFoodStall(
            @PathVariable Long id,
            @Valid @RequestBody FoodStallRequestDTO dto) {

        FoodStallResponseDTO updated =
                foodStallService.updateFoodStall(id, dto);

        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFoodStall(
            @PathVariable Long id) {

        foodStallService.deleteFoodStall(id);

        return ResponseEntity.noContent().build();
    }
    
}
