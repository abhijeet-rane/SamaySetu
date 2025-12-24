package com.College.timetable.IO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
	
	private String email;
	private String token;
	private String role;
	private boolean firstLogin = false;
	
	public AuthResponse(String email, String token, String role) {
		this.email = email;
		this.token = token;
		this.role = role;
		this.firstLogin = false;
	}
}
