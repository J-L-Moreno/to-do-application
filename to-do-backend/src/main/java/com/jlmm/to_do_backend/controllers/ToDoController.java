package com.jlmm.to_do_backend.controllers;

import com.jlmm.to_do_backend.models.ToDo;
import com.jlmm.to_do_backend.services.ToDoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
public class ToDoController {
	private final ToDoService service;

	@Autowired
	public ToDoController(ToDoService service) {
		this.service = service;
	}
	
	@PostMapping("/todos")
	public ResponseEntity<Object> createToDo(@RequestBody ToDo toDo) {
		return service.createToDo(toDo);
	}
	
	@GetMapping("/todos")
	public ResponseEntity<Object> getToDos(
	@RequestParam int page,
	@RequestParam(required = false) Boolean sortByDueDate,
	@RequestParam(required = false) Boolean sortByPriority,
	@RequestParam(required = false) Integer priorityFilter,
	@RequestParam(required = false) Boolean doneFilter,
	@RequestParam(required = false) String nameFilter
	){
		return service.getToDos(page, sortByDueDate, sortByPriority, priorityFilter, doneFilter, nameFilter);
	}
	
	@PutMapping("/todos/{id}")
	public ResponseEntity<Object> updateToDo(@PathVariable int id, @RequestBody ToDo toDoData){
		return service.updateToDo(id, toDoData);
	}
	
	@DeleteMapping("/todos/{id}")
	public ResponseEntity<Object> deleteToDo(@PathVariable int id){
		return service.deleteToDo(id);
	}
	
	@PostMapping("/todos/{id}/done")
	public ResponseEntity<Object> toDoDone(@PathVariable int id){
		return service.toDoDone(id);
	}
	
	@PutMapping("/todos/{id}/undone")
	public ResponseEntity<Object> toDoUndone(@PathVariable int id){
		return service.toDoUndone(id);
	}
}