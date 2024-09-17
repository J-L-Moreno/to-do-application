package com.jlmm.to_do_backend.models;

import java.util.Date;

public class ToDo {
		
	private int id;
	private String text;
	private Date dueDate;
	private boolean isDone;
	private Date doneDate;
	private Priority priority;
	private Date creationDate;
	
	public ToDo() {}
	
	public ToDo(int id, String text, Date dueDate, Date creationDate, Priority priority) {
		if(text == null ) {
			throw new IllegalArgumentException("The text field is required!");
		}
		
		if(text.length() > 120) {
			throw new IllegalArgumentException("The text field must have 120 chars or less!");
		}
		
		if(priority == null) {
			throw new IllegalArgumentException("The priority field is required!");
		}
		
		if(creationDate == null) {
			throw new IllegalArgumentException("The creationDate field is required!");
		}
		
		this.id = id;
		this.text = text;
		this.dueDate = dueDate;
		isDone = false;
		doneDate = null;
		this.priority = priority;
		this.creationDate = creationDate;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		
		if(text == null) {
			throw new IllegalArgumentException("The text field is required!");
		}
		
		if( text.length() > 120 ) {
			throw new IllegalArgumentException("The text field must have 120 chars or less!");
		}
		
		this.text = text;
	}

	public Date getDueDate() {
		return dueDate;
	}

	public void setDueDate(Date dueDate) {
		this.dueDate = dueDate;
	}

	public boolean isDone() {
		return isDone;
	}

	public void setDone(boolean isDone) {
		this.isDone = isDone;
	}

	public Date getDoneDate() {
		return doneDate;
	}

	public void setDoneDate(Date doneDate) {
		this.doneDate = doneDate;
	}

	public Priority getPriority() {
		return priority;
	}

	public void setPriority(Priority priority) {
		this.priority = priority;
	}

	public Date getCreationDate() {
		return creationDate;
	}

	public void setCreationDate(Date creationDate) {
		this.creationDate = creationDate;
	}
	
}

