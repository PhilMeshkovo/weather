package com.example.weather.repository;

import com.example.weather.model.Weather;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WeatherRepo extends JpaRepository<Weather, Long> {
    Optional<Weather> findByLocation(String location);
}
