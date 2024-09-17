package com.jlmm.to_do_backend.models;

import java.util.ArrayList;
import java.util.List;

public class ToDoList {
	private int count, possiblePages;
	private List<ToDo> toDos;
	
	public static ToDoList instance = new ToDoList();
	
	private ToDoList() {
		count = 0;
		possiblePages = 1;
		toDos = new ArrayList<>();
	}
	
	public static void increaseList(ToDo toDo) {
		instance.toDos.add(toDo);
		instance.count++;
		instance.possiblePages = (int)Math.ceil(instance.toDos.size() / 10.0);
		
	}

	public int getCount() {
		return count;
	}

	public List<ToDo> getToDos() {
		return toDos;
	}
	
	public void setToDos(List<ToDo> toDos) {
		this.toDos = toDos;
		this.possiblePages = toDos.size() == 0
				? 1
				: (int)Math.ceil(instance.toDos.size() / 10.0);
	}

	public static ToDoList getInstance() {
		return instance;
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

