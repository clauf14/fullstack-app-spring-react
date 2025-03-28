package com.example.projectTap.services;

import com.example.projectTap.entities.Location;
import com.example.projectTap.exceptions.ResourceNotFoundException;
import com.example.projectTap.repositories.LocationRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LocationService {

    @Autowired
    private LocationRepository locationRepository;

    public Location create(Location location) {
        return locationRepository.save(location);
    }

    public Location viewById(Integer locationId){
        return locationRepository.findById(locationId)
                .orElseThrow(() -> new EntityNotFoundException("Photo not found with ID: " + locationId));
    }

    public Location update(Location locationBody) {
        return locationRepository.save(locationBody);
    }

    public void deleteById(Integer locationId){
        locationRepository.deleteById(locationId);
    }
}
