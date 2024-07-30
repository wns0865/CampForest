package com.campforest.backend.user.service;

import java.util.Optional;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.campforest.backend.user.dto.request.RequestRegisterDTO;
import com.campforest.backend.user.model.UserImage;
import com.campforest.backend.user.model.Users;
import com.campforest.backend.user.repository.UserImageRepository;
import com.campforest.backend.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{

	private final UserRepository userRepository;
	private final UserImageRepository userImageRepository;
	private final TokenService tokenService;
	private final AuthenticationManager authenticationManager;

	@Override
	@Transactional
	public void registUser(RequestRegisterDTO requestDTO) {
		Users users = requestDTO.toEntity();
		Users savedUser = userRepository.save(users);

		UserImage userImage = UserImage.builder()
			.user(savedUser)
			.imageUrl(requestDTO.getProfileImage())
			.build();
		userImageRepository.save(userImage);
	}

	@Override
	public Optional<Users> findByEmail(String email) {
		return userRepository.findByEmail(email);
	}

	@Override
	@Transactional
	public void deleteByEmail(String email) {
		Users users = userRepository.findByEmail(email)
			.orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다."));

		userRepository.delete(users);
		tokenService.invalidateAllUserTokens(email);
	}

	@Override
	public Authentication authenticateUser(String email, String password) {
		return authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
	}
}