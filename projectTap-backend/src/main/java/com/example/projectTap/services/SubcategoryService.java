package com.example.projectTap.services;

import com.example.projectTap.entities.Post;
import com.example.projectTap.entities.Subcategory;
import com.example.projectTap.repositories.SubcategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubcategoryService {
    @Autowired
    private SubcategoryRepository subcategoryRepository;

    public List<Subcategory> findByCategoryId(Integer categoryId){
        return subcategoryRepository.findAllByCategoryId(categoryId);
    }

    public Subcategory create(Subcategory subcategory){
        return subcategoryRepository.save(subcategory);
    }

    public List<Subcategory> viewAll(){
        return subcategoryRepository.findAll();
    }

    public Subcategory viewById(Integer id){
        return subcategoryRepository.findById(id).get();
    }
}
