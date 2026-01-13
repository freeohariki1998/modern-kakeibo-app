package com.kakeibo.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.sql.Timestamp;
import java.time.LocalDate;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name="kakeibo")
@Data
public class Kakeibo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "transaction_date")
    private LocalDate transactionDate;

    @NotBlank(message = "品目を入力してください")
    @Size(max = 100, message = "品目は100文字いないで入力してください")
    private String title;

    @NotNull(message = "金額を入力してください")
    @Min(value = 1, message = "金額は1円以上の数値を入力してください")
    private Integer amount;

    private String memo;
    @Column(name = "created_at")
    private Timestamp createAt;
    @Column(name = "updated_at")
    private Timestamp updateAt;
    // カテゴリー
    @NotBlank(message = "カテゴリを選択してください")
    private String category;
    @Column(name = "category_id")
    private  Integer categoryId;
}
