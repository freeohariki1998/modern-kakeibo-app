package com.kakeibo.backend.repository;

import com.kakeibo.backend.entity.Kakeibo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KakeiboRepository extends JpaRepository<Kakeibo,Long> {
}
