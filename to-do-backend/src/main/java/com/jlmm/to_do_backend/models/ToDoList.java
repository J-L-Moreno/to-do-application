package com.jlmm.to_do_backend.models;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

@Component
public class ToDoList {
	private int count = 0;
	private int possiblePages = 1;
	private List<ToDo> toDos = new ArrayList<>();
	
//	public static ToDoList instance = new ToDoList();
//
//	private ToDoList() {
//		count = 0;
//		possiblePages = 1;
//		toDos = new ArrayList<>();
//	}

	/**
	 * Adds a ToDo item to the list and updates the count and possible pages.
	 *
	 * @param toDo the ToDo item to add.
	 */
	public void increaseList(ToDo toDo) {
		toDos.add(toDo);
		count++;
		possiblePages = (int)Math.ceil(toDos.size() / 10.0);
		
	}

	public int getCount() {
		return count;
	}

	public List<ToDo> getToDos() {
		return toDos;
	}
	
	public void setToDos(List<ToDo> toDos) {
		this.toDos = toDos;
		this.possiblePages = toDos.isEmpty()
				? 1
				: (int)Math.ceil(toDos.size() / 10.0);
	}
	
	public int getPossiblepages() {
		return this.possiblePages;
	}
	
	public ToDo findToDoById(int id) {
		for(ToDo toDo : toDos) {
			if(toDo.getId() == id) {
				return toDo;
			}
		}
		throw new IllegalAccessError("Unexistent todo!");
	}
	
}

