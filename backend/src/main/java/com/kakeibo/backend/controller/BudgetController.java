package com.kakeibo.backend.controller;

import com.kakeibo.backend.entity.Budget;
import com.kakeibo.backend.repository.BudgetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController // 結果はJOSNで返す宣言
@RequestMapping("/api/budget")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor // コンストラクタを自動生成(finalだけ)
public class BudgetController {
    private final BudgetRepository repository;

    @GetMapping("/{month}")
    public Integer getBudget(@PathVariable String month){
        return repository.findById(month)
                .map(Budget::getAmount)
                .orElse(0);
    }

    @PostMapping("/{month}")
    public ResponseEntity<?> setBudget(@PathVariable String month, @RequestBody Map<String, Integer> body){
        Budget budget = new Budget();
        budget.setMonth(month);
        budget.setAmount(body.get("amount"));
        repository.save(budget);
        return ResponseEntity.ok().build();
    }

}
