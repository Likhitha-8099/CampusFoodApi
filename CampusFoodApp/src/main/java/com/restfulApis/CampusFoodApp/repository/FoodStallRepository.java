package com.restfulApis.CampusFoodApp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.restfulApis.CampusFoodApp.Entity.FoodStall;

@Repository
public interface FoodStallRepository extends JpaRepository<FoodStall, Long> {
	
}