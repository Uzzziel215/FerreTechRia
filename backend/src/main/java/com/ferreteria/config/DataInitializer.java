package com.ferreteria.config;

import com.ferreteria.service.SeedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("dev")
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private SeedService seedService;

    @Override
    public void run(String... args) throws Exception {
        seedService.poblarBaseDeDatos();
    }
}
