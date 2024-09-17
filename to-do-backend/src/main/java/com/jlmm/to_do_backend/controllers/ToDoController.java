package com.jlmm.to_do_backend.controllers;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jlmm.to_do_backend.models.Priority;
import com.jlmm.to_do_backend.models.ToDo;
import com.jlmm.to_do_backend.models.ToDoList;
import com.jlmm.to_do_backend.utils.Functions;

@CrossOrigin(origins = "*")
@RestController
public class ToDoController {
	
	@PostMapping("/todos")
	public ResponseEntity<Object> createToDo(@RequestBody ToDo toDo) {
		String trimText = toDo.getText() == null
				? null
				: toDo.getText().trim();
		
		if(trimText == null || trimText.equals("")) {
			throw new IllegalArgumentException("Text is required!");
		}
		
		try {
			ToDo newToDo = new ToDo(
					ToDoList.instance.getCount(), 
					trimText, 
					toDo.getDueDate(),
					toDo.getCreationDate(),
					toDo.getPriority());
			
			ToDoList.increaseList(newToDo);
			
			return ResponseEntity.ok().body(newToDo);
		} catch(Exception e) {
			throw e;
		}
	}
	
	
	@GetMapping("/todosAll")
	public ResponseEntity<Object> getToDos(){
		Map<String, Object> output = new HashMap<>();
		output.put("toDos", ToDoList.instance.getToDos());
		output.put("possiblePages", ToDoList.instance.getPossiblepages());
		return ResponseEntity.ok().body(output);
	}
	
	@GetMapping("/todos")
	public ResponseEntity<Object> todosPag(
	@RequestParam int page,
	@RequestParam(required = false) Boolean sortByDueDate,
	@RequestParam(required = false) Boolean sortByPriority,
	@RequestParam(required = false) Integer priorityFilter,
	@RequestParam(required = false) Boolean doneFilter,
	@RequestParam(required = false) String nameFilter
	){
		try {
			if(page > ToDoList.instance.getPossiblepages() || page < 1) {
				throw new IllegalArgumentException("Unexistent page!");
			}
			
			int initialToDo = (page - 1) * 10;
			int finalToDo = (page * 10) - 1;
			List<ToDo> originalToDos = new ArrayList<>();
			List<ToDo> outputToDos = new ArrayList<>();
			List<ToDo> originalToDosWithNullDueDate = new ArrayList<>();
			
			originalToDos.addAll(ToDoList.instance.getToDos());
			
			if(sortByDueDate != null) {
				originalToDosWithNullDueDate.addAll(ToDoList.instance.getToDos());
				originalToDos = filterToDosByDueDate(originalToDos);
				if(sortByDueDate) {
					originalToDos.sort((toDo1, toDo2) -> toDo1.getDueDate().compareTo(toDo2.getDueDate()));
				} else {
					originalToDos.sort((toDo1, toDo2) -> -toDo1.getDueDate().compareTo(toDo2.getDueDate()));
				}
				
				for(ToDo toDo : originalToDosWithNullDueDate) {
					if(toDo.getDueDate() == null) {
						originalToDos.add(toDo);
					}
				}
			}
			
			try {
				if(sortByPriority != null) {
					if(sortByPriority) {
						originalToDos.sort((toDo1, toDo2) -> -toDo1.getPriority().compareTo(toDo2.getPriority()));
					} else {
						originalToDos.sort((toDo1, toDo2) -> toDo1.getPriority().compareTo(toDo2.getPriority()));
					}
				}
			} catch(Exception e) {
				throw new IllegalArgumentException("Invalid priority filter!");
			}
					
			if(priorityFilter != null) {
				if(priorityFilter < 0 || priorityFilter >= Priority.values().length) {
					throw new IllegalArgumentException("Invalid priority filter!");
				}
				
				originalToDos = filterToDosByPriority(Priority.values()[priorityFilter], originalToDos);
			}
			
			if(doneFilter != null) {
				originalToDos = filterToDosByDone(doneFilter, originalToDos);
			}
			
			if(nameFilter != null) {
				originalToDos = filterToDosByText(nameFilter.trim(), originalToDos);
			}
					
			for(int i = initialToDo; i < originalToDos.size(); i++) {
				if( i <= finalToDo) {
					outputToDos.add(originalToDos.get(i));
				}
			}
			
			Map<String, Object> output = new HashMap<>();
			
			if((int)Math.ceil(originalToDos.size() / 10.0) != ToDoList.instance.getPossiblepages()) {
				output.put("searchPages", (int)Math.ceil(originalToDos.size() / 10.0));
			}
			
			output.put("toDos", outputToDos);
			output.put("possiblePages", ToDoList.instance.getPossiblepages());
			output.put("timeMetrics", getTimeIntervals());
			
			return ResponseEntity.ok().body(output);
		} catch(Exception e) {
			throw e;
		}
	}
	
	@PutMapping("/todos/{id}")
	public ResponseEntity<Object> updateToDo(@PathVariable int id, @RequestBody ToDo toDoData){
		try {
			List<ToDo> toDos = ToDoList.instance.getToDos();
			
			
			toDos.forEach(toDo -> {
		        if(toDo.getId() == id) {
		        	if(toDoData.getText() != null && !toDoData.getText().equals(toDo.getText())) {
		        		toDo.setText(toDoData.getText().trim());
		        	}
		        	if(toDoData.getDueDate() != null && !toDoData.getDueDate().equals(toDo.getDueDate())) {
		        		toDo.setDueDate(toDoData.getDueDate());
		        	} else if(toDoData.getDueDate() == null) {
		        		toDo.setDueDate(null);
		        	}
		        	if(toDoData.getPriority() != null && toDoData.getPriority() != toDo.getPriority()) {
		        		toDo.setPriority(toDoData.getPriority());
		        	}
		        }
			});
			
			ToDoList.instance.setToDos(toDos);
			
			return ResponseEntity.ok().body(ToDoList.instance.findToDoById(id));
		} catch(Exception e) {
			throw e;
		}
	}
	
	@DeleteMapping("/todos/{id}")
	public ResponseEntity<Object> deleteToDo(@PathVariable int id){
		try {
			int indexToDelete = -1;
			
			List<ToDo> toDos = ToDoList.instance.getToDos();
			
			for(ToDo toDo : toDos) {
				if(toDo.getId() == id) {
					indexToDelete = toDos.indexOf(toDo);
				}
			}
						
			if(indexToDelete == -1) {
				throw new IllegalArgumentException("Invalid to-do id!");
			}
			
			toDos.remove(indexToDelete);
			
			ToDoList.instance.setToDos(toDos);
			
			return ResponseEntity.ok().body(ToDoList.instance);
		} catch(Exception e) {
			throw new IllegalAccessError("Invalid id!");
		}
	}
	
	@PostMapping("/todos/{id}/done")
	public ResponseEntity<Object> toDoDone(@PathVariable int id){
		List<ToDo> toDos = ToDoList.instance.getToDos();
		
		toDos.forEach(toDo -> {
			if(toDo.getId() == id && !toDo.isDone()) {
				toDo.setDone(true);
				toDo.setDoneDate(new Date());
			}
		});
		
		ToDoList.instance.setToDos(toDos);
		
		return ResponseEntity.ok().body(null);
	}
	
	@PutMapping("/todos/{id}/undone")
	public ResponseEntity<Object> toDoUndone(@PathVariable int id){
		List<ToDo> toDos = ToDoList.instance.getToDos();
		
		toDos.forEach(toDo -> {
			if(toDo.getId() == id && toDo.isDone()) {
				toDo.setDone(false);
				toDo.setDoneDate(null);
			}
		});
		
		ToDoList.instance.setToDos(toDos);
		
		return ResponseEntity.ok().body(null);
	}
	
	private List<ToDo> filterToDosByPriority(Priority priority, List<ToDo> toDos){
		List<ToDo> outputToDos = new ArrayList<>();
		
		toDos.forEach(toDo -> {
			if(toDo.getPriority() == priority) {
				outputToDos.add(toDo);
			}
		});
		
		return outputToDos;
	}
	
	private List<ToDo> filterToDosByDueDate(List<ToDo> toDos){
		List<ToDo> outputToDos = new ArrayList<>();
		
		toDos.forEach(toDo -> {
			if(toDo.getDueDate() != null) {
				outputToDos.add(toDo);
			}
		});
		
		return outputToDos;
	}
	
	private List<ToDo> filterToDosByDone(boolean doneFilter, List<ToDo> toDos){
		List<ToDo> outputToDos = new ArrayList<>();
		
		toDos.forEach(toDo -> {
			if(toDo.isDone() == doneFilter) {
				outputToDos.add(toDo);
			}
		});
		
		return outputToDos;
	}
	
	private List<ToDo> filterToDosByText(String text, List<ToDo> toDos){
		if(text != null) {
			List<ToDo> outputToDos = new ArrayList<>();
			
			toDos.forEach(toDo -> {
				if(toDo.getText().contains(text)) {
					outputToDos.add(toDo);
				}
			});
			
			return outputToDos;
		}
		
		return ToDoList.instance.getToDos();
	}
	
	private Map<String, Object> getTimeIntervals(){
		Map<String, Object> metrics = new HashMap<>();
		int toDosCount = 0,
			hightoDosCount = 0, 
			mediumToDosCount = 0, 
			lowToDosCount = 0;
		
		long totalTimeAmount = 0,
			 hightToDosTimeAmount = 0,
			 mediumToDosTimeAmount = 0, 
			 lowToDosTimeAmount = 0;
		
		long toDosAverageTime = 0,
			 hightoDosAverageTime = 0,
			 mediumToDosAverageTime = 0,
			 lowToDosAverageTime = 0;
		
		metrics.put("toDosCount", 0);
		metrics.put("toDosAverageTime", null);
		metrics.put("highToDosAverageTime", null);
		metrics.put("mediumToDosAverageTime", null);
		metrics.put("lowToDosAverageTime", null);
		
		
		for(ToDo toDo : ToDoList.instance.getToDos()) {
			long timeDiffInMillies = 0;
			
			if(toDo.isDone()) {
				toDosCount++;
				metrics.put("toDosCount", toDosCount);
				timeDiffInMillies = toDo.getDoneDate().getTime() - toDo.getCreationDate().getTime();
				totalTimeAmount = totalTimeAmount + timeDiffInMillies;
				toDosAverageTime = totalTimeAmount / toDosCount;
				metrics.put("toDosAverageTime", Functions.milliecondsToMMSSFormat(toDosAverageTime));
								
				if(toDo.getPriority() == Priority.HIGH) {
					hightoDosCount++;
					hightToDosTimeAmount = hightToDosTimeAmount + timeDiffInMillies;
					hightoDosAverageTime = hightToDosTimeAmount / hightoDosCount;
					metrics.put("highToDosAverageTime", Functions.milliecondsToMMSSFormat(hightoDosAverageTime));
				} else if(toDo.getPriority() == Priority.MEDIUM) {
					mediumToDosCount++;
					mediumToDosTimeAmount = mediumToDosTimeAmount + timeDiffInMillies;
					mediumToDosAverageTime = mediumToDosTimeAmount / mediumToDosCount;
					metrics.put("mediumToDosAverageTime", Functions.milliecondsToMMSSFormat(mediumToDosAverageTime));
				} else if(toDo.getPriority() == Priority.LOW) {
					lowToDosCount++;
					lowToDosTimeAmount = lowToDosTimeAmount + timeDiffInMillies;
					lowToDosAverageTime = lowToDosTimeAmount / lowToDosCount;
					metrics.put("lowToDosAverageTime", Functions.milliecondsToMMSSFormat(lowToDosAverageTime));
				} else {
					throw new IllegalArgumentException("Unexpected priority: " + toDo.getPriority());
				}
			}
		}
		return metrics;
	}
	
}

