package com.restfulApis.CampusFoodApp.controller;

import java.io.ByteArrayOutputStream;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.restfulApis.CampusFoodApp.Entity.FoodStall;
import com.restfulApis.CampusFoodApp.dto.FoodItemResponseDTO;
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
    @GetMapping("/{stallId}/food-items")
    public ResponseEntity<List<FoodItemResponseDTO>> getFoodItemsByStall(
            @PathVariable Long stallId) {

        System.out.println("🔥🔥 CONTROLLER REACHED 🔥🔥");

        List<FoodItemResponseDTO> items =
                foodStallService.getFoodItemsByStall(stallId);

        System.out.println("🔥 ITEMS COUNT = " + items.size());

        return ResponseEntity.ok(items);
    }
    @GetMapping("/paged")
    public ResponseEntity<Page<FoodStallResponseDTO>> getAllFoodStalls(
            Pageable pageable) {

        Page<FoodStallResponseDTO> response =
                foodStallService.getAllFoodStalls(pageable);

        return ResponseEntity.ok(response);
    }
    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> getStallAsPdf(@PathVariable Long id){
    	FoodStall stall=foodStallService.getFoodStall(id);
    	ByteArrayOutputStream out = new ByteArrayOutputStream();
    	PdfWriter writer = new PdfWriter(out);
    	PdfDocument pdfdocument = new PdfDocument(writer);
    	Document document = new Document(pdfdocument);
    	document.add(new Paragraph("Food Stall Details"));
    	document.add(new Paragraph("Food Stall Details"));

    	document.add(new Paragraph("Name: " + stall.getName()));
    	document.add(new Paragraph("Owner: " + stall.getOwnerName()));
    	document.add(new Paragraph("Location: " + stall.getLocation()));
    	document.add(new Paragraph("Rating: " + stall.getRating()));
    	document.close();
    	byte[] pdfBytes = out.toByteArray();
    	return ResponseEntity
    	        .ok()
    	        .contentType(MediaType.APPLICATION_PDF)
    	        .body(pdfBytes);
    }
    
}
