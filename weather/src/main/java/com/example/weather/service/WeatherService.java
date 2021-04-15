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

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.util.Optional;

@Log4j2
@Service
public class WeatherService {

    private final String API_KEY = "appid=ee279c1db8197db198ee1e8d87f0ea5d";

    private final WeatherRepo weatherRepo;

    @Autowired
    public WeatherService(WeatherRepo weatherRepo) {
        this.weatherRepo = weatherRepo;
    }

    @Scheduled(fixedDelay = 3600000)
    public void clearDB() {
        weatherRepo.deleteAll();
    }

    public WeatherDto getWeather(String city) throws Exception {

        if (!validateCity(city)) {
            log.error("Некорректное название города");
            throw new Exception("Некорректное название города");
        }

        Optional<Weather> cityDB = weatherRepo.findByLocation(city);
        if (cityDB.isPresent()) {
            return new WeatherDto(cityDB.get().getLocation(), cityDB.get().getTemperature());
        }

        StringBuffer content = new StringBuffer();
        Weather weather = new Weather();
        WeatherDto response = new WeatherDto();

        try {
            URL url = null;
            url = new URL("http://api.openweathermap.org/data/2.5/weather?q=" + city + "&" + API_KEY);

            URLConnection urlConn = url.openConnection();

            BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(urlConn.getInputStream()));
            String line;

            while ((line = bufferedReader.readLine()) != null) {
                content.append(line + "\n");
            }

        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(content.toString());

        Integer celsius  = jsonNode.get("main").get("temp").asInt() - 273;

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

    private static boolean validateCity( String city )
    {
        return city.matches( "([a-zA-Z]+|[a-zA-Z]+\\s[a-zA-Z]+)" );
    }
}
