package com.kakeibo.backend.controller;

import com.kakeibo.backend.entity.Kakeibo;
import com.kakeibo.backend.entity.MasterData;
import com.kakeibo.backend.repository.MasterDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // 結果はJOSNで返す宣言
@RequestMapping("/api/master")
@CrossOrigin(origins = "http://localhost:5173")
public class MasterDataController {

    @Autowired
    private MasterDataRepository repository;

    @GetMapping("/{type}")
    public List<MasterData> getByMasterType(@PathVariable String type){
        return repository.findByType(type);
    }
}
