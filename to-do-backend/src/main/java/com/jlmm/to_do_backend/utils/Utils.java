package com.jlmm.to_do_backend.utils;

import com.jlmm.to_do_backend.models.Priority;
import com.jlmm.to_do_backend.models.ToDo;
import com.jlmm.to_do_backend.models.ToDoList;

import java.util.HashMap;
import java.util.List;
import java.util.LongSummaryStatistics;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

public class Utils {

	/**
	 * Calculates various time intervals and metrics for completed ToDo items.
	 *
	 * @param toDoList the list of ToDo items.
	 * @return a map containing various time metrics.
	 */
	public static Map<String, Object> getTimeIntervals(ToDoList toDoList) {
		String defaultOutput = "--d --h --m";
		Map<String, Object> metrics = new HashMap<>();
		List<ToDo> doneToDos = toDoList.getToDos().stream()
				.filter(ToDo::isDone)
				.toList();

		int toDosCount = doneToDos.size();
		long totalTimeAmount = doneToDos.stream()
				.mapToLong(toDo -> toDo.getDoneDate().getTime() - toDo.getCreationDate().getTime())
				.sum();
		String toDosAverageTime = toDosCount > 0 ? millisecondsToDDHHMMFormat(totalTimeAmount / toDosCount) : defaultOutput;

		Map<Priority, LongSummaryStatistics> priorityStats = doneToDos.stream()
				.collect(Collectors.groupingBy(ToDo::getPriority,
						Collectors.summarizingLong(toDo -> toDo.getDoneDate().getTime() - toDo.getCreationDate().getTime())));

		metrics.put("toDosCount", toDosCount);
		metrics.put("toDosAverageTime", toDosAverageTime);
		metrics.put("highToDosAverageTime", priorityStats.containsKey(Priority.HIGH) && priorityStats.get(Priority.HIGH).getCount() > 0 ?
				millisecondsToDDHHMMFormat((long)priorityStats.get(Priority.HIGH).getAverage()) : defaultOutput);
		metrics.put("mediumToDosAverageTime", priorityStats.containsKey(Priority.MEDIUM) && priorityStats.get(Priority.MEDIUM).getCount() > 0 ?
				millisecondsToDDHHMMFormat((long)priorityStats.get(Priority.MEDIUM).getAverage()) : defaultOutput);
		metrics.put("lowToDosAverageTime", priorityStats.containsKey(Priority.LOW) && priorityStats.get(Priority.LOW).getCount() > 0 ?
				millisecondsToDDHHMMFormat((long)priorityStats.get(Priority.LOW).getAverage()) : defaultOutput);

		return metrics;
	}

	/**
	 * Converts milliseconds to a formatted string in the format of "dd days hh hours mm minutes".
	 *
	 * @param milliseconds the time in milliseconds.
	 * @return the formatted time string.
	 */
	public static String millisecondsToDDHHMMFormat(long milliseconds) {
		long days = TimeUnit.MILLISECONDS.toDays(milliseconds);
		long hours = TimeUnit.MILLISECONDS.toHours(milliseconds) % 24;
		long minutes = TimeUnit.MILLISECONDS.toMinutes(milliseconds) % 60;

		return String.format("%02dd %02dh %02dm", days, hours, minutes);
	}

	/**
	 * Filters a list of ToDo items by priority.
	 *
	 * @param priority the priority to filter by.
	 * @param toDos the list of ToDo items.
	 * @return a list of ToDo items with the specified priority.
	 */
	public static List<ToDo> filterToDosByPriority(Priority priority, List<ToDo> toDos) {
		return toDos.stream()
				.filter(toDo -> toDo.getPriority() == priority)
				.collect(Collectors.toList());
	}

	/**
	 * Filters a list of ToDo items to include only those with a due date.
	 *
	 * @param toDos the list of ToDo items.
	 * @return a list of ToDo items with a due date.
	 */
	public static List<ToDo> filterToDosByDueDate(List<ToDo> toDos) {
		return toDos.stream()
				.filter(toDo -> toDo.getDueDate() != null)
				.collect(Collectors.toList());
	}

	/**
	 * Filters a list of ToDo items by their done status.
	 *
	 * @param doneFilter the done status to filter by.
	 * @param toDos the list of ToDo items.
	 * @return a list of ToDo items with the specified done status.
	 */
	public static List<ToDo> filterToDosByDone(boolean doneFilter, List<ToDo> toDos) {
		return toDos.stream()
				.filter(toDo -> toDo.isDone() == doneFilter)
				.collect(Collectors.toList());
	}

	/**
	 * Filters a list of ToDo items by text.
	 *
	 * @param text the text to filter by.
	 * @param toDos the list of ToDo items.
	 * @return a list of ToDo items containing the specified text.
	 */
	public static List<ToDo> filterToDosByText(String text, List<ToDo> toDos) {
		if (text != null) {
			return toDos.stream()
					.filter(toDo -> toDo.getText().contains(text))
					.collect(Collectors.toList());
		}
		return toDos;
	}
}
