package com.kakeibo.backend.repository;

import com.kakeibo.backend.entity.Kakeibo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface KakeiboRepository extends JpaRepository<Kakeibo,Long> {
    List<Kakeibo> findAllByOrderByTransactionDateDesc();

    @Query("SELECT k.category as category, SUM(k.amount) as amount " +
            "FROM Kakeibo k " +
            "WHERE k.transactionDate BETWEEN :start AND :end " +
            "GROUP BY k.category")
    List<CategorySummary> summarizByCategory(@Param("start") java.time.LocalDate start,
                                             @Param("end") java.time.LocalDate end);
}
