package com.restfulApis.CampusFoodApp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import com.restfulApis.CampusFoodApp.Entity.FoodStall;
import com.restfulApis.CampusFoodApp.repository.FoodStallRepository;

@Service
public class FoodStallService {

    @Autowired
    private FoodStallRepository foodStallRepo;

    public FoodStall createFoodStall(FoodStall foodStall) {
        return foodStallRepo.save(foodStall);

    }

    public List<FoodStall> getAllFoodStalls() {
        return foodStallRepo.findAll();
    }

    public FoodStall getFoodById(Long id) {
        return foodStallRepo.findById(id).orElseThrow(()-> new RuntimeException("Food stall not found"));
    }

    public FoodStall updateFoodStall(Long id, FoodStall foodStall) {

        FoodStall existing = foodStallRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Food Stall not found"));

        existing.setName(foodStall.getName());
        existing.setOwnerName(foodStall.getOwnerName());
        existing.setLocation(foodStall.getLocation());
        existing.setPhoneNumber(foodStall.getPhoneNumber());
        existing.setOpeningTime(foodStall.getOpeningTime());
        existing.setClosingTime(foodStall.getClosingTime());
        existing.setRating(foodStall.getRating());
        existing.setOpen(foodStall.isOpen());

        return foodStallRepo.save(existing);
    }
    public void deleteFoodStall(Long id) {
        foodStallRepo.deleteById(id);
    }
}
