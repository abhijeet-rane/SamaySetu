package com.College.timetable;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class Review1Application {

	public static void main(String[] args) {
		SpringApplication.run(Review1Application.class, args);
	}

}
