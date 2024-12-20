package com.jlmm.to_do_backend.controllers;

import com.jlmm.to_do_backend.models.Priority;
import com.jlmm.to_do_backend.models.ToDo;
import com.jlmm.to_do_backend.models.ToDoList;
import com.jlmm.to_do_backend.services.ToDoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class ToDoControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ToDoService toDoService;

    @InjectMocks
    private ToDoController toDoController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(toDoController).build();
    }

    @Test
    void createToDo() throws Exception {
        ToDo toDo = new ToDo(1, "Test ToDo", null, new Date(), Priority.MEDIUM);
        when(toDoService.createToDo(any(ToDo.class))).thenReturn(ResponseEntity.ok(toDo));

        mockMvc.perform(post("/todos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"text\":\"Test ToDo\",\"priority\":\"MEDIUM\",\"creationDate\":\"2024-12-20T00:00:00.000+00:00\"}"))
                .andExpect(status().isOk());
    }

    @Test
    void getToDos() throws Exception {
        ToDo toDo1 = new ToDo(1, "Test ToDo 1", null, new Date(), Priority.MEDIUM);
        ToDo toDo2 = new ToDo(2, "Test ToDo 2", null, new Date(), Priority.HIGH);
        Map<String, Object> response = new HashMap<>();
        response.put("toDos", Arrays.asList(toDo1, toDo2));
        response.put("possiblePages", 1);

        when(toDoService.getToDos(anyInt(), any(), any(), any(), any(), any())).thenReturn(ResponseEntity.ok(response));

        mockMvc.perform(get("/todos")
                        .param("page", "1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void updateToDo() throws Exception {
        ToDo toDo = new ToDo(1, "Updated ToDo", null, new Date(), Priority.MEDIUM);
        when(toDoService.updateToDo(anyInt(), any(ToDo.class))).thenReturn(ResponseEntity.ok(toDo));

        mockMvc.perform(put("/todos/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"text\":\"Updated ToDo\",\"priority\":\"MEDIUM\"}"))
                .andExpect(status().isOk());
    }

    @Test
    void deleteToDo() throws Exception {
        ToDoList toDoList = new ToDoList();
        when(toDoService.deleteToDo(anyInt())).thenReturn(ResponseEntity.ok(toDoList));

        mockMvc.perform(delete("/todos/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }
}