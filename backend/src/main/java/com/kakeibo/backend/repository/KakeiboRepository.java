package com.kakeibo.backend.repository;

import com.kakeibo.backend.entity.Kakeibo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface KakeiboRepository extends JpaRepository<Kakeibo,Long> {
    List<Kakeibo> findAllByOrderByTransactionDateDesc();
}
