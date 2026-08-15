package com.restfulApis.CampusFoodApp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.restfulApis.CampusFoodApp.dto.FoodItemResponseDTO;
import com.restfulApis.CampusFoodApp.service.FoodItemService;


@Controller
@RequestMapping("/food-items")
public class FoodItemPageController {
	private FoodItemService foodItemService;
	FoodItemPageController(FoodItemService foodItemService){
		this.foodItemService=foodItemService;
	}
	@GetMapping("/{id}/page")
	public String getFoodItemPage(@PathVariable Long id, Model model) {
       FoodItemResponseDTO item=foodItemService.getFoodItemById(id);
       model.addAttribute("foodItem", item);
       return "food-item";
	}

}
