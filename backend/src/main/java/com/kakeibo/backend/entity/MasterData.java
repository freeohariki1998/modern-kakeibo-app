package com.kakeibo.backend.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name="masterdata")
@Data
public class MasterData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;

    private String name;

    private String keyCode;
    @JsonProperty("colorClass")
    private String color_class;
}
