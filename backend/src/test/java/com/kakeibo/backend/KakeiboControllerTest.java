package com.kakeibo.backend;

import com.kakeibo.backend.controller.KakeiboController;
import com.kakeibo.backend.entity.Kakeibo;
import com.kakeibo.backend.repository.KakeiboRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;

@WebMvcTest(KakeiboController.class)
class KakeiboControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private KakeiboRepository repository;

    @Autowired
    private ObjectMapper objectMapper;

    // 全権取得が正常に動作しリストを返すこと
    @Test
    void test001() throws Exception {
        // テスト用データを作成
        Kakeibo item1 = new Kakeibo();
        item1.setId(1L);
        item1.setTitle("ランチ");
        item1.setAmount(1000);

        Kakeibo item2 = new Kakeibo();
        item2.setId(2L);
        item2.setTitle("電車代");
        item2.setAmount(200);

        List<Kakeibo> mockList = Arrays.asList(item1, item2);

        when(repository.findAllByOrderByTransactionDateDesc()).thenReturn(mockList);

        mockMvc.perform(get("/api/kakeibo"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].title").value("ランチ"))
                .andExpect(jsonPath("$[1].title").value("電車代"));

    }
    // 新規登録が成功し200と保存データを返すこと
    @Test
    void test002() throws Exception {
        Kakeibo newItem = new Kakeibo();
        newItem.setTitle("ランチ");
        newItem.setAmount(1000);
        // ↓ ここを追加（バリデーションで弾かれないようにする）
        newItem.setCategory("食費");
        newItem.setCategoryId(1);
        newItem.setTransactionDate(LocalDate.now());

        when(repository.save(any(Kakeibo.class))).thenAnswer(i -> {
            Kakeibo k = i.getArgument(0);
            k.setId(99L);
            return k;
        });

        mockMvc.perform(post("/api/kakeibo")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newItem)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(99L))
                .andExpect(jsonPath("$.title").value("ランチ"));
    }

    // バリデーションエラー時に400を返すこと
    @Test
    void test003() throws Exception {
        Kakeibo invalidItem = new Kakeibo();
        invalidItem.setTitle("");

        mockMvc.perform(post("/api/kakeibo")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidItem)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").exists());
    }

    // 削除が正常に動作し200を返すこと
    @Test
    void test004() throws Exception {
        Long targetId = 1L;
        mockMvc.perform(delete("/api/kakeibo/" + targetId))
                .andExpect(status().isOk());
        verify(repository, times(1)).deleteById(targetId);
    }

}
