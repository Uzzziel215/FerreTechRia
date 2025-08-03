package com.ferreteria.controller;

import com.ferreteria.service.SeedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/seed")
public class SeedController {

    @Autowired
    private SeedService seedService;

    @PostMapping("/poblar-base")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<String> poblarBase() {
        try {
            seedService.poblarBaseDeDatos();
            return ResponseEntity.ok("Base de datos poblada exitosamente.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al poblar la base de datos: " + e.getMessage());
        }
    }
}
