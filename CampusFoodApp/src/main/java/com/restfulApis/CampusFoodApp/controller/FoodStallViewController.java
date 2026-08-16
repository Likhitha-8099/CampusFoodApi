package com.restfulApis.CampusFoodApp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.restfulApis.CampusFoodApp.Entity.FoodStall;
import com.restfulApis.CampusFoodApp.service.FoodStallService;

@Controller
@RequestMapping("/api/stalls")
public class FoodStallViewController {
	private final FoodStallService foodStallService;
	public FoodStallViewController(FoodStallService foodStallService) {
		this.foodStallService=foodStallService;
	}
	@GetMapping("/{id}/html")
    public String getStallAsHtml(
            @PathVariable Long id,
            Model model) {

        FoodStall stall = foodStallService.getFoodStall(id);

        model.addAttribute("stall", stall);

        return "food-stall";
    }

}
