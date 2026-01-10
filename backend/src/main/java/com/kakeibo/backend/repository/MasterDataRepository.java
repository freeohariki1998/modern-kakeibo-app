package com.kakeibo.backend.repository;

import com.kakeibo.backend.entity.Kakeibo;
import com.kakeibo.backend.entity.MasterData;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MasterDataRepository extends JpaRepository<MasterData,Long> {
    List<MasterData> findByType(String type);
}
