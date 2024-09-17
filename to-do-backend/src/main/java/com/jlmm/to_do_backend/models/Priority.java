package com.jlmm.to_do_backend.models;

public enum Priority{
	LOW(0), 
	MEDIUM(1), 
	HIGH(2);
	
	private int value;
	
	Priority(int valor) {
        this.value = valor;
    }

    public int getValor() {
        return value;
    }
}
