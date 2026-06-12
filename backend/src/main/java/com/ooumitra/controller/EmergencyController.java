package com.ooumitra.controller;

import com.ooumitra.util.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/emergency")
@Tag(name = "Emergency Services")
public class EmergencyController {

    private static final List<Map<String, Object>> EMERGENCY_SERVICES = List.of(
            Map.of("id", 1, "type", "AMBULANCE", "name", "Ambulance (108)",
                    "number", "108", "icon", "ambulance", "description", "24/7 Emergency Ambulance"),
            Map.of("id", 2, "type", "DOCTOR", "name", "Doctor / Clinic",
                    "number", "104", "icon", "doctor", "description", "Health Helpline"),
            Map.of("id", 3, "type", "VET", "name", "Veterinary Doctor",
                    "number", "1962", "icon", "vet", "description", "Animal Husbandry Helpline"),
            Map.of("id", 4, "type", "ELECTRICIAN", "name", "Electrician",
                    "number", "1912", "icon", "electrician", "description", "Electricity Board"),
            Map.of("id", 5, "type", "PLUMBER", "name", "Plumber",
                    "number", "1916", "icon", "plumber", "description", "Water Supply Helpline")
    );

    @GetMapping("/services")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getServices() {
        return ResponseEntity.ok(ApiResponse.ok(EMERGENCY_SERVICES));
    }
}
