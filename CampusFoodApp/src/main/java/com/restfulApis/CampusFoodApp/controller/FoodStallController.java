package com.restfulApis.CampusFoodApp.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.restfulApis.CampusFoodApp.Entity.FoodStall;
import com.restfulApis.CampusFoodApp.service.FoodStallService;

@RestController
@RequestMapping("/api/stalls")
public class FoodStallController {

    private final FoodStallService foodStallService;

    public FoodStallController(FoodStallService foodStallService) {
        this.foodStallService = foodStallService;
    }

    @PostMapping
    public void createFoodStall(@RequestBody FoodStall foodStall) {
        foodStallService.createFoodStall(foodStall);
    }

    @GetMapping
    public List<FoodStall> getAllFoodStalls() {
        return foodStallService.getAllFoodStalls();
    }

    @GetMapping("/{id}")
    public Optional<FoodStall> getFoodById(@PathVariable Long id) {
        return foodStallService.getFoodById(id);
    }

    @PutMapping("/{id}")
    public void updateFoodStall(@PathVariable Long id,
                                @RequestBody FoodStall foodStall) {
        foodStallService.updateFoodStall(id, foodStall);
    }

    @DeleteMapping("/{id}")
    public void deleteFoodStall(@PathVariable Long id) {
        foodStallService.deleteFoodStall(id);
    }
}
