package com.example.weather.service;

import com.example.weather.model.Weather;
import com.example.weather.repository.WeatherRepo;
import com.example.weather.response.WeatherDto;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.util.Optional;

@Log4j2
@Service
public class WeatherService {

    private final WeatherRepo weatherRepo;

    @Autowired
    public WeatherService(WeatherRepo weatherRepo) {
        this.weatherRepo = weatherRepo;
    }

    @Scheduled(fixedDelay = 3600000)
    public void clearDB() {
        weatherRepo.deleteAll();
    }

    public WeatherDto getWeather(String city) {

        Optional<Weather> cityDB = weatherRepo.findByLocation(city);
        if (cityDB.isPresent()) {
            return new WeatherDto(cityDB.get().getLocation(), cityDB.get().getTemperature());
        }

        StringBuilder content = new StringBuilder();
        Weather weather = new Weather();
        WeatherDto response = new WeatherDto();

        try {
            URL url ;
            log.info("Отправляем запрос");
            String API_KEY = "appid=ee279c1db8197db198ee1e8d87f0ea5d";
            String URL = "https://api.openweathermap.org/data/2.5/weather";
            url = new URL(URL + "?q=" + city + "&" + API_KEY);

            URLConnection urlConn = url.openConnection();

            BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(urlConn.getInputStream()));
            String line;

            while ((line = bufferedReader.readLine()) != null) {
                content.append(line).append("\n");
            }

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(content.toString());

            Integer celsius = jsonNode.get("main").get("temp").asInt() - 273;

            response.setLocation(city);
            response.setTemp(String.valueOf(celsius));

            weather.setLocation(city);
            weather.setTemperature(String.valueOf(celsius));
            weatherRepo.save(weather);
            log.info("Добаляем погоду в базу");
        } catch (Exception e) {
            log.error(e.getMessage());
        }
        return response;
    }

    @Transactional
    public boolean addWeather(WeatherDto weatherDto) {
        Optional<Weather> optionalWeather = weatherRepo.findByLocation(weatherDto.getLocation());
        if (optionalWeather.isPresent()) {
            Weather weatherToChange = weatherRepo.getOne(optionalWeather.get().getId());
            weatherToChange.setTemperature(weatherDto.getTemp());
        } else {
            Weather weather = new Weather();
            weather.setLocation(weatherDto.getLocation());
            weather.setTemperature(weatherDto.getTemp());
            weatherRepo.save(weather);
        }
        return true;
    }
}
