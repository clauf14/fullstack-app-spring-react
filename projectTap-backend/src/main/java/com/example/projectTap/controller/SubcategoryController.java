package com.example.projectTap.controller;

import com.example.projectTap.entities.Category;
import com.example.projectTap.entities.Subcategory;
import com.example.projectTap.repositories.CategoryRepository;
import com.example.projectTap.repositories.SubcategoryRepository;
import com.example.projectTap.services.PostService;
import com.example.projectTap.services.SubcategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/subcategory")
public class SubcategoryController {

    @Autowired
    private SubcategoryService subcategoryService;

    @GetMapping("/{subcategoryId}")
    public Subcategory getOneSubcategory(@PathVariable("subcategoryId") Integer subcategoryId){
        return subcategoryService.viewById(subcategoryId);
    }

    @GetMapping("/all")
    public List<Subcategory> getSubcategoriesList(){
        return subcategoryService.viewAll();
    }

    @GetMapping("/display/{categoryId}")
    public List<Subcategory> getSubcategoriesByCategoryList(@PathVariable("categoryId") Integer categoryId){
        return subcategoryService.findByCategoryId(categoryId);
    }
}
