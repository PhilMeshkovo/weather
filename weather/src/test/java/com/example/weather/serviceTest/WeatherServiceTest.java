package com.example.weather.serviceTest;

import com.example.weather.model.Weather;
import com.example.weather.repository.WeatherRepo;
import com.example.weather.response.WeatherDto;
import com.example.weather.service.WeatherService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import java.util.Optional;

@SpringBootTest
public class WeatherServiceTest {

    @Autowired
    WeatherService weatherService;

    @MockBean
    WeatherRepo weatherRepo;

    @Test
    void getWeatherTest() throws Exception {
        Weather weather = new Weather();
        weather.setLocation("Moscow");
        weather.setTemperature("25");
        Mockito.doReturn(Optional.of(weather)).when(weatherRepo).findByLocation("Moscow");

        WeatherDto moscow = weatherService.getWeather("Moscow");
        Assertions.assertEquals("25", moscow.getTemp());

    }
}
