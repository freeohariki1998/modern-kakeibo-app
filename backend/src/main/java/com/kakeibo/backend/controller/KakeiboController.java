package com.kakeibo.backend.controller;


import com.kakeibo.backend.entity.Kakeibo;
import com.kakeibo.backend.repository.CategorySummary;
import com.kakeibo.backend.repository.KakeiboRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@RestController // 結果はJOSNで返す宣言
@RequestMapping("/api/kakeibo")
@CrossOrigin(origins = "http://localhost:5173")
public class KakeiboController {
    private final KakeiboRepository repository;

    public KakeiboController(KakeiboRepository repository){
        this.repository = repository;
    }

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
    public Kakeibo create(@RequestBody Kakeibo kakeibo) {
        return repository.save(kakeibo);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
