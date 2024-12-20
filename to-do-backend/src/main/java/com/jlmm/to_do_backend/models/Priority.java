package com.jlmm.to_do_backend.models;

/**
 * Enum representing the priority levels for a ToDo item.
 */
public enum Priority{
	LOW(0), 
	MEDIUM(1), 
	HIGH(2);
	
	private final int value;

    /**
     * Constructor for Priority enum.
     *
     * @param value the integer value representing the priority level.
     */
	Priority(int value) {
        this.value = value;
    }

    /**
     * Gets the integer value of the priority level.
     *
     * @return the integer value of the priority.
     */
    public int getValue() {
        return value;
    }
}
