package com.campforest.backend.product.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campforest.backend.product.model.SaveProduct;

public interface
SaveProductRepository extends JpaRepository<SaveProduct, Long> {

	Optional<SaveProduct> findByUserUserIdAndProductId(Long userId, Long productId);
	List<SaveProduct> findAllByUserUserId(Long userId);
}