package com.College.timetable.Controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.College.timetable.IO.AuthRequest;
import com.College.timetable.IO.AuthResponse;
import com.College.timetable.IO.ChangeFirstPasswordRequest;
import com.College.timetable.IO.ForgotPasswordRequest;
import com.College.timetable.IO.RegisterRequest;
import com.College.timetable.IO.ResetPasswordRequest;
import com.College.timetable.Service.TeacherService;
import com.College.timetable.Util.JWTUtil;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/auth")
public class AuthController {
	
	@Autowired
	private PasswordEncoder passwordEncode;

	@Autowired
	private AuthenticationManager authManager;
	
	@Autowired
	private JWTUtil jwtutil;
	
	
	
	
	@Autowired
	private TeacherService teacherservice;
	
	//handler method
	@PostMapping("/")
	public String encodePassword(@RequestBody Map<String,String> request) {
		return passwordEncode.encode(request.get("password"));
	}
	
	@PostMapping("/register")
	public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {
		try {
			teacherservice.register(request);
			return ResponseEntity.ok("Registration successful! Please check your college email to verify your account.");
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
	
	@GetMapping("/verify-email")
	public ResponseEntity<String> verifyEmail(@RequestParam("token") String token) {
		try {
			teacherservice.verifyEmail(token);
			return ResponseEntity.ok("Email verified successfully! You can now login.");
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
	
	@PostMapping("/forgot-password")
	public ResponseEntity<String> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
		try {
			teacherservice.forgotPassword(request.getEmail());
			return ResponseEntity.ok("Password reset link has been sent to your email.");
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
	
	@PostMapping("/reset-password")
	public ResponseEntity<String> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
		try {
			teacherservice.resetPassword(request.getToken(), request.getNewPassword());
			return ResponseEntity.ok("Password reset successfully! You can now login with your new password.");
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
	
	@GetMapping("/reset-password")
	public ResponseEntity<String> resetPasswordRedirect(@RequestParam("token") String token) {
		try {
			// Validate token exists and is not expired
			teacherservice.validateResetToken(token);
			// Redirect to frontend with token
			return ResponseEntity.status(HttpStatus.FOUND)
					.header("Location", "http://localhost:5173/reset-password?token=" + token)
					.body("Redirecting to password reset page...");
		} catch (Exception e) {
			// Redirect to frontend with error
			return ResponseEntity.status(HttpStatus.FOUND)
					.header("Location", "http://localhost:5173/reset-password?error=" + e.getMessage())
					.body("Redirecting to password reset page...");
		}
	}
	
	@PostMapping("/login")
	public AuthResponse login(@RequestBody AuthRequest request) {
		try {
			// First check user status (email verification, approval, etc.)
			final UserDetails user = teacherservice.loadUserByUsername(request.getEmail());
			
			// Then authenticate credentials
			authenticate(request.getEmail(), request.getPassword());
			
			// Check if first login (only for non-admin users)
			String role = teacherservice.getByRole(request.getEmail());
			boolean isFirstLogin = false;
			
			// Only check first login for TEACHER role, not ADMIN
			if ("TEACHER".equals(role)) {
				isFirstLogin = teacherservice.isFirstLogin(request.getEmail());
			}
			
			// Generate token and return response
			final String token = jwtutil.generateToken(user);
			
			AuthResponse response = new AuthResponse(request.getEmail(), token, role);
			response.setFirstLogin(isFirstLogin);
			
			return response;
		} catch (RuntimeException e) {
			// Preserve specific error messages from TeacherService
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
		}
	}
	
	@PostMapping("/change-first-password")
	public ResponseEntity<String> changeFirstPassword(@Valid @RequestBody ChangeFirstPasswordRequest request) {
		try {
			teacherservice.updateFirstLoginPassword(request.getEmail(), request.getNewPassword());
			return ResponseEntity.ok("Password updated successfully! Please login with your new password.");
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
	
	private void authenticate(String email, String password) {
		try {
			authManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
		} catch (Exception e) {
			throw new RuntimeException("Email or password is incorrect");
		}
	}

}
