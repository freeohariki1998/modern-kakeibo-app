package com.kakeibo.backend.controller;


import com.kakeibo.backend.entity.Kakeibo;
import com.kakeibo.backend.repository.CategorySummary;
import com.kakeibo.backend.repository.KakeiboRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController // 結果はJOSNで返す宣言
@RequestMapping("/api/kakeibo")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor // コンストラクタを自動生成(finalだけ)
public class KakeiboController {
    private final KakeiboRepository repository;

    @GetMapping
    public List<Kakeibo> getAllKakeibo(){
//        return repository.findAll();
        return repository.findAllByOrderByTransactionDateDesc();
    }

    @GetMapping("/summary")
    public List<CategorySummary> getSummary(@RequestParam("month") String month){
        YearMonth ym = YearMonth.parse(month);
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();
        return repository.summarizByCategory(start, end);
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody Kakeibo kakeibo, BindingResult result) {
        if (result.hasErrors()) {
            // 最初のエラーメッセージを取得してエラーコード 400 で返す
            String message = result.getAllErrors().getFirst().getDefaultMessage();
            return ResponseEntity.badRequest().body(Map.of("message", Objects.requireNonNull(message)));
        }
        return ResponseEntity.ok(repository.save(kakeibo));
    }

    @PutMapping("/{id}")
    public  ResponseEntity<Kakeibo> updateKakeibo(@PathVariable Long id, @RequestBody Kakeibo updateItem){
        return repository.findById(id)
                .map(item -> {
                    item.setTitle(updateItem.getTitle());
                    item.setAmount(updateItem.getAmount());
                    item.setCategory(updateItem.getCategory());
                    item.setCategoryId(updateItem.getCategoryId());
                    item.setTransactionDate(updateItem.getTransactionDate());
                    Kakeibo saveItem = repository.save(item);
                    return ResponseEntity.ok(saveItem);
                })
                .orElse(ResponseEntity.notFound().build());

    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
