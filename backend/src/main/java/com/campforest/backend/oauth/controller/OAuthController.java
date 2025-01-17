package com.campforest.backend.oauth.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.amazonaws.services.kms.model.NotFoundException;
import com.campforest.backend.common.ApiResponse;
import com.campforest.backend.common.ErrorCode;
import com.campforest.backend.common.JwtTokenProvider;
import com.campforest.backend.oauth.model.OAuthCodeToken;
import com.campforest.backend.oauth.repository.OAuthCodeTokenRepository;
import com.campforest.backend.oauth.repository.TempUserRepository;
import com.campforest.backend.oauth.dto.response.ResponseOAuthInfoDTO;
import com.campforest.backend.oauth.model.TempUser;
import com.campforest.backend.user.dto.response.ResponseLoginDTO;
import com.campforest.backend.user.model.Users;
import com.campforest.backend.user.service.UserService;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/oauth")
@RequiredArgsConstructor
public class OAuthController {

	private final UserService userService;
	private final JwtTokenProvider jwtTokenProvider;
	private final TempUserRepository tempUserRepository;
	private final OAuthCodeTokenRepository oAuthCodeTokenRepository;

	@Value("${oauth2.baseUrl}")
	private String baseUrl;

	@GetMapping("/login/{provider}")
	public ResponseEntity<Map<String, String>> getOAuthLoginUrl(@PathVariable String provider) {
		String redirectUrl = baseUrl + "/oauth2/authorization/" + provider;
		Map<String, String> response = new HashMap<>();
		response.put("url", redirectUrl);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/get-oauth-info")
	public ApiResponse<?> getOAuthInfo(@RequestParam("token") String token) {
		try {
			TempUser tempUser = tempUserRepository.findById(token)
				.orElseThrow(() -> new NotFoundException("토큰이 유효하지 않습니다."));

			String email = tempUser.getEmail();
			String name = tempUser.getName();
			String provider = tempUser.getProvider();
			String providerId = tempUser.getProviderId();

			ResponseOAuthInfoDTO responseDTO = ResponseOAuthInfoDTO.builder()
				.email(email)
				.name(name)
				.provider(provider)
				.providerId(providerId)
				.build();

			return ApiResponse.createSuccess(responseDTO, "OAuth 정보 조회 성공");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.TEMP_USER_NOT_FOUND);
		}
	}

	@GetMapping("/get-user-token")
	public ApiResponse<?> getUserToken(@RequestParam("code") String code, HttpServletResponse response) {
		try {
			OAuthCodeToken oAuthCodeToken = oAuthCodeTokenRepository.findById(code)
				.orElseThrow(() -> new NotFoundException("코드가 유효하지 않습니다."));

			String accessToken = oAuthCodeToken.getAccessToken();
			String refreshToken = oAuthCodeToken.getRefreshToken();

			ResponseCookie responseCookie = ResponseCookie.from("refreshToken", refreshToken)
				.httpOnly(true)
				.secure(true)
				.maxAge(60 * 60 * 24 * 14)
				.path("/")
				.sameSite("None")
				.domain("i11d208.p.ssafy.io")
				.build();

			response.setHeader(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken);
			response.setHeader(HttpHeaders.SET_COOKIE, responseCookie.toString());

			String email = jwtTokenProvider.getUserEmail(accessToken);
			Users user = userService.findByEmail(email)
				.orElseThrow(() -> new UsernameNotFoundException(ErrorCode.USER_NOT_FOUND.getMessage()));

			ResponseLoginDTO responseDTO = ResponseLoginDTO.fromEntity(user);

			return ApiResponse.createSuccess(responseDTO, "토큰 발급에 성공했습니다.");
		} catch (Exception e) {
			return ApiResponse.createError(ErrorCode.OAUTH_CODE_NOT_FOUND);
		}
	}
}
