package com.ferreteria.controller;

import com.ferreteria.service.SeedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/seed")
public class SeedController {

    @Autowired
    private SeedService seedService;

    @PostMapping("/poblar-base")
    public ResponseEntity<String> poblarBase() {
        seedService.poblarBaseDeDatos();
        return ResponseEntity.ok("Base de datos poblada exitosamente.");
    }
}
