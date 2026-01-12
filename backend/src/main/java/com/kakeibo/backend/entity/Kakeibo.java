package com.kakeibo.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;
import java.time.LocalDate;

@Entity
@Table(name="kakeibo")
@Data
public class Kakeibo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "transaction_date")
    private LocalDate transactionDate;
    private String title;
    private Integer amount;
    private String memo;
    @Column(name = "created_at")
    private Timestamp createAt;
    @Column(name = "updated_at")
    private Timestamp updateAt;
    // カテゴリー
    private String category;
    @Column(name = "category_id")
    private  Integer categoryId;
}
