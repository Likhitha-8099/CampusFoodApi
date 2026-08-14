package com.restfulApis.CampusFoodApp.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.restfulApis.CampusFoodApp.Entity.FoodItem;



public interface FoodItemRepository extends JpaRepository<FoodItem,Long>{
	
   List<FoodItem> findByFoodStallId(Long id);
   List<FoodItem> findByNameContainingIgnoreCase(String name);
   
   List<FoodItem> findByPriceLessThan(double price);   
   List<FoodItem> findByCategoryAndPrice(String category,double price);
   
   List<FoodItem> findByCategoryAndAvailable(String category,boolean available);
   
   List<FoodItem> findByPriceGreaterThan(double price);
   
   Page<FoodItem> findAll(Pageable pageable);
}
