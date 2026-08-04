package com.restfulApis.CampusFoodApp.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.restfulApis.CampusFoodApp.Entity.FoodStall;
import com.restfulApis.CampusFoodApp.repository.FoodStallRepository;

@Service
public class FoodStallService {

    @Autowired
    private FoodStallRepository foodStallRepo;

    public void createFoodStall(FoodStall foodStall) {
        foodStallRepo.save(foodStall);
    }

    public List<FoodStall> getAllFoodStalls() {
        return foodStallRepo.findAll();
    }

    public Optional<FoodStall> getFoodById(Long id) {
        return foodStallRepo.findById(id);
    }

    public void updateFoodStall(Long id, FoodStall foodStall) {

        Optional<FoodStall> optional = foodStallRepo.findById(id);

        if (optional.isPresent()) {

            FoodStall existing = optional.get();

            existing.setName(foodStall.getName());
            existing.setOwnerName(foodStall.getOwnerName());
            existing.setLocation(foodStall.getLocation());
            existing.setPhoneNumber(foodStall.getPhoneNumber());
            existing.setOpeningTime(foodStall.getOpeningTime());
            existing.setClosingTime(foodStall.getClosingTime());
            existing.setRating(foodStall.getRating());
            existing.setOpen(foodStall.isOpen());

            foodStallRepo.save(existing);
        }
    }

    public void deleteFoodStall(Long id) {
        foodStallRepo.deleteById(id);
    }
}
