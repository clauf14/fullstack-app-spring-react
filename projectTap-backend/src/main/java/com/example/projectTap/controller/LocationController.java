package com.example.projectTap.controller;

import com.example.projectTap.entities.Location;
import com.example.projectTap.services.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/location")
public class LocationController {

    @Autowired
    private LocationService locationService;

    @GetMapping("/{locationId}")
    public ResponseEntity<Location> getLocation(@PathVariable("locationId") Integer locationId) {
        Location location = locationService.viewById(locationId);

        if (location.getLocationId() == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok().body(location);
    }

    @PostMapping("/add")
    public ResponseEntity<Location> addLocation(@RequestBody Location locationBody) {
        Location location = new Location();
        location.setLocationId(locationBody.getLocationId());
        location.setName(locationBody.getName());
        location.setLatitude(locationBody.getLatitude());
        location.setLongitude(locationBody.getLongitude());
        Location createdLocation = locationService.create(locationBody);

        return ResponseEntity.ok().body(createdLocation);
    }

    @PutMapping("/update")
    public ResponseEntity<Location> updateLocation(@RequestBody Location locationBody) {
        Location location = new Location();
        location.setLocationId(locationBody.getLocationId());
        location.setName(locationBody.getName());
        location.setLatitude(locationBody.getLatitude());
        location.setLongitude(locationBody.getLongitude());
        Location updatedLocation = locationService.update(locationBody);

        return ResponseEntity.ok().body(updatedLocation);
    }
}
