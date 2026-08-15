package com.restfulApis.CampusFoodApp.Entity;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "foodStall")
public class FoodStall {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank	
    @Size(min=3, max=50)
    private String name;
    @NotBlank
    @Size(min=5, max=20)
    private String ownerName;
    private String location;
    @NotBlank
    @Size(min = 10, max = 10)
    @Pattern(regexp="^[0-9]{10}$")
    private String phoneNumber;
    private String openingTime;
    private String closingTime;
    @DecimalMin("0.0")
    @DecimalMax("5.0")
    
    private double rating;
    private boolean isOpen;
    
    @OneToMany(mappedBy="foodStall",cascade = CascadeType.ALL,
    	    orphanRemoval = true)
    @ToString.Exclude

    private List<FoodItem> foodItems;

}