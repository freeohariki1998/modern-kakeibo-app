package com.kakeibo.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name="budget")
@Data
public class Budget {
    @Id
    private String month;
    private Integer amount;
}
