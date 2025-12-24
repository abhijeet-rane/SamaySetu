package com.College.timetable.Filter;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.College.timetable.Service.TeacherService;
import com.College.timetable.Util.JWTUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JWTRequestFilter extends OncePerRequestFilter{

	private final TeacherService teacher;
	

	private final JWTUtil jwtUtil;


	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		
	    String path = request.getServletPath();

		// Skip JWT processing for auth endpoints
		if (path.startsWith("/auth")) {
	        filterChain.doFilter(request, response);
	        return;
	    }
		
		final String authHeader=request.getHeader("Authorization");
		String email=null;
		String jwt=null;
		
		if(authHeader!=null && authHeader.startsWith("Bearer ")) {
			jwt=authHeader.substring(7);
			try {
				email=jwtUtil.extractUsername(jwt);
			} catch (Exception e) {
				// Handle expired or invalid JWT tokens gracefully
				// Let the request continue without authentication
				filterChain.doFilter(request, response);
				return;
			}
		}
		
		if(email!=null && SecurityContextHolder.getContext().getAuthentication()==null) {
			try {
				UserDetails userdet=teacher.loadUserByUsername(email); 
				if(jwtUtil.validateToken(jwt, userdet)) {
					UsernamePasswordAuthenticationToken authenticationToken=new UsernamePasswordAuthenticationToken(userdet, null, userdet.getAuthorities());
					authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
					SecurityContextHolder.getContext().setAuthentication(authenticationToken);
				}
			} catch (Exception e) {
				// Handle any authentication errors gracefully
				// Let the request continue without authentication
			}
		}
		filterChain.doFilter(request, response);
	} 	
	
	
	
	
}
