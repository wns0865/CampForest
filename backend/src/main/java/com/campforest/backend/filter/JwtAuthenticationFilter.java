package com.campforest.backend.filter;

import java.io.IOException;
import java.util.Arrays;

import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.campforest.backend.common.ErrorCode;
import com.campforest.backend.common.JwtTokenProvider;
import com.campforest.backend.exception.TokenExpiredException;
import com.campforest.backend.utils.ErrorResponseUtil;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final JwtTokenProvider jwtTokenProvider;
	private final String[] WHITE_LIST = {
		"/user/login",
	};

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
		FilterChain filterChain) throws ServletException, IOException {
		String jwt = getJwtFromRequest(request);

		try {
			if (jwtTokenProvider.validateToken(jwt)) {
				Authentication auth = jwtTokenProvider.getAuthentication(jwt);
				SecurityContextHolder.getContext().setAuthentication(auth);
			}
		} catch (TokenExpiredException e) {
			SecurityContextHolder.clearContext();
			ErrorResponseUtil.sendErrorResponse(response, ErrorCode.ACCESS_TOKEN_EXPIRED);
			return;
		} catch (JwtException e) {
			SecurityContextHolder.clearContext();
			ErrorResponseUtil.sendErrorResponse(response, ErrorCode.INVALID_JWT_TOKEN);
			return;
		}
		filterChain.doFilter(request, response);
	}

	private String getJwtFromRequest(HttpServletRequest request) {
		String bearerToken = request.getHeader(HttpHeaders.AUTHORIZATION);
		if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
			return bearerToken.split(" ")[1].trim();
		}
		return null;
	}

	@Override
	protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
		String path = request.getServletPath();
		return Arrays.asList(WHITE_LIST).contains(path);
	}
}
