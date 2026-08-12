package com.restfulApis.CampusFoodApp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.restfulApis.CampusFoodApp.Entity.FoodItem;


public interface FoodItemRepository extends JpaRepository<FoodItem,Long>{

}
