package com.jlmm.to_do_backend.services;

import com.jlmm.to_do_backend.models.Priority;
import com.jlmm.to_do_backend.models.ToDo;
import com.jlmm.to_do_backend.models.ToDoList;
import com.jlmm.to_do_backend.utils.Utils;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ToDoService {

	private final ToDoList toDoList;

	@Autowired
	public ToDoService(ToDoList toDoList) {
		this.toDoList = toDoList;
	}

	/**
	 * Creates a new ToDo item and adds it to the list.
	 *
	 * @param toDo the ToDo item to create.
	 * @return a ResponseEntity containing the created ToDo item.
	 * @throws IllegalArgumentException if the text is null or exceeds 120 characters.
	 */
	public ResponseEntity<Object> createToDo(ToDo toDo) {
		String trimText = Optional.ofNullable(toDo.getText())
				.map(String::trim)
				.orElseThrow(() -> new IllegalArgumentException("Text is required!"));

		if( toDo.getText().length() > 120 ) {
			throw new IllegalArgumentException("The text field must have 120 chars or less!");
		}


		ToDo newToDo = new ToDo(
				toDoList.getCount(),
				trimText,
				toDo.getDueDate(),
				toDo.getCreationDate(),
				toDo.getPriority()
		);

		toDoList.increaseList(newToDo);

		return ResponseEntity.ok().body(newToDo);
	}

	/**
	 * Retrieves a paginated list of ToDo items with optional sorting and filtering.
	 *
	 * @param page the page number to retrieve.
	 * @param sortByDueDate whether to sort by due date.
	 * @param sortByPriority whether to sort by priority.
	 * @param priorityFilter the priority level to filter by.
	 * @param doneFilter whether to filter by done status.
	 * @param nameFilter the text to filter by.
	 * @return a ResponseEntity containing the filtered and sorted list of ToDo items.
	 * @throws IllegalArgumentException if the page number is invalid.
	 */
	public ResponseEntity<Object> getToDos(
	int page,
	Boolean sortByDueDate,
	Boolean sortByPriority,
	Integer priorityFilter,
	Boolean doneFilter,
	String nameFilter
	){
		try {
			if(page > toDoList.getPossiblepages() || page < 1) {
				throw new IllegalArgumentException("Unexistent page!");
			}

			int initialToDo = (page - 1) * 10;
			int finalToDo = (page * 10) - 1;
            List<ToDo> outputToDos;

            List<ToDo> originalToDos = new ArrayList<>(toDoList.getToDos());

			if (sortByDueDate != null) {
				Comparator<ToDo> comparator = Comparator.comparing(
						ToDo::getDueDate,
						Comparator.nullsLast(Comparator.naturalOrder())
				);

				if (!sortByDueDate) {
					comparator = Comparator.comparing(
							ToDo::getDueDate,
							Comparator.nullsLast(Comparator.reverseOrder())
					);
				}

				originalToDos = originalToDos.stream()
						.sorted(comparator)
						.collect(Collectors.toList());
			}

			try {
				if (sortByPriority != null) {
					Comparator<ToDo> comparator = Comparator.comparing(ToDo::getPriority);
					if (sortByPriority) {
						comparator = comparator.reversed();
					}
					originalToDos.sort(comparator);
				}
			} catch(Exception e) {
				throw new IllegalArgumentException("Invalid priority filter!");
			}

			if(priorityFilter != null) {
				if(priorityFilter < 0 || priorityFilter >= Priority.values().length) {
					throw new IllegalArgumentException("Invalid priority filter!");
				}

				originalToDos = Utils.filterToDosByPriority(Priority.values()[priorityFilter], originalToDos);
			}

			if(doneFilter != null) {
				originalToDos = Utils.filterToDosByDone(doneFilter, originalToDos);
			}

			if(nameFilter != null) {
				originalToDos = Utils.filterToDosByText(nameFilter.trim(), originalToDos);
			}

			outputToDos = originalToDos.stream()
					.skip(initialToDo)
					.limit(finalToDo - initialToDo + 1)
					.collect(Collectors.toList());

			Map<String, Object> output = new HashMap<>();

			int searchPages = (int) Math.ceil(originalToDos.size() / 10.0);
			if (searchPages != toDoList.getPossiblepages()) {
				output.put("searchPages", searchPages);
			}

			output.put("toDos", outputToDos);
			output.put("possiblePages", toDoList.getPossiblepages());
			output.put("timeMetrics", Utils.getTimeIntervals(toDoList));

			return ResponseEntity.ok().body(output);
		} catch(Exception e) {
			throw e;
		}
	}


	/**
	 * Updates an existing ToDo item with new data.
	 *
	 * @param id the id of the ToDo item to update.
	 * @param toDoData the new data for the ToDo item.
	 * @return a ResponseEntity containing the updated ToDo item.
	 * @throws IllegalArgumentException if the text exceeds 120 characters.
	 */
	public ResponseEntity<Object> updateToDo(int id, ToDo toDoData){
		try {
			ToDo toDo = toDoList.findToDoById(id);

			if (toDoData.getText() != null && !toDoData.getText().equals(toDo.getText())) {
				if( toDoData.getText().length() > 120 ) {
					throw new IllegalArgumentException("The text field must have 120 chars or less!");
				}
				toDo.setText(toDoData.getText().trim());
			}
			if (toDoData.getDueDate() != null && !toDoData.getDueDate().equals(toDo.getDueDate())) {
				toDo.setDueDate(toDoData.getDueDate());
			}
			if (toDoData.getPriority() != null && toDoData.getPriority() != toDo.getPriority()) {
				toDo.setPriority(toDoData.getPriority());
			}

			return ResponseEntity.ok().body(toDo);
		} catch(Exception e) {
			throw e;
		}
	}

	/**
	 * Deletes a ToDo item by its id.
	 *
	 * @param id the id of the ToDo item to delete.
	 * @return a ResponseEntity containing the updated list of ToDo items.
	 * @throws IllegalArgumentException if the ToDo item id is invalid.
	 */
	public ResponseEntity<Object> deleteToDo(int id) {
		List<ToDo> toDos = toDoList.getToDos();

		boolean removed = toDos.removeIf(toDo -> toDo.getId() == id);

		if (!removed) {
			throw new IllegalArgumentException("Invalid to-do id!");
		}

		toDoList.setToDos(toDos);

		return ResponseEntity.ok().body(toDoList);
	}

	/**
	 * Marks a ToDo item as done.
	 *
	 * @param id the id of the ToDo item to mark as done.
	 * @return a ResponseEntity with no content.
	 */
	public ResponseEntity<Object> toDoDone(int id){

		ToDo toDo = toDoList.findToDoById(id);
		
		if(!toDo.isDone()) {
			toDo.setDone(true);
			toDo.setDoneDate(new Date());
		}

		return ResponseEntity.ok().body(null);
	}

	/**
	 * Marks a ToDo item as not done.
	 *
	 * @param id the id of the ToDo item to mark as not done.
	 * @return a ResponseEntity with no content.
	 */
	public ResponseEntity<Object> toDoUndone(int id){
		ToDo toDo = toDoList.findToDoById(id);
		
		if(toDo.isDone()) {
			toDo.setDone(false);
			toDo.setDoneDate(null);
		}

		return ResponseEntity.ok().body(null);
	}
}