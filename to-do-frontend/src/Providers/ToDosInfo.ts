import { ApiUrl, todos } from "../Env/ApiConsts";
import axios from "axios";
import { ToDosInfo } from "../Models/Models";

export async function createToDo(name: string, priority: number, dueDate?: any): Promise<boolean> {
  type RequestBody = {
    text: string | undefined,
    priority: number | undefined,
    creationDate: string,
    dueDate?: string | undefined
  }

  const currentDateTime: string = new Date().toISOString();
  const url = `${ApiUrl}${todos}`;
  const body: RequestBody = {
    text: name,
    priority: priority,
    creationDate: currentDateTime,
    dueDate: dueDate ? new Date(dueDate).toISOString() : undefined
  };

  try {
    await axios.post(url, body);
    return true;
  } catch (error) {
    console.error('Error creating ToDo:', error);
    return false;
  }
}

export async function getToDos(
  page: number, 
  sortByDueDate?: boolean,
  sortByPriority?: boolean,
  priorityFilter?: number,
  doneFilter?: boolean,
  nameFilter?: string
){
  const url = new URL(`${ApiUrl}${todos}`);
  url.searchParams.append('page', page.toString());

  const params: Record<string, any> = {
    sortByDueDate,
    sortByPriority,
    priorityFilter: priorityFilter !== undefined && priorityFilter !== -1 ? priorityFilter : undefined,
    doneFilter,
    nameFilter
  };

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, value.toString());
    }
  });

  try {
    const response = await axios.get(url.toString());
    const { possiblePages, searchPages, toDos, timeMetrics } = response.data;

    const toDosInfo: ToDosInfo = {
      possiblePages,
      searchPages,
      toDos,
      timeMetrics
    };

    return toDosInfo;
  } catch (error) {
    console.error('Error fetching ToDos:', error);
  }
}

export async function toDoDone(id: number): Promise<boolean> {
  const url = `${ApiUrl}${todos}/${id}/done`;
  try {
    await axios.post(url);
    return true;
  } catch (error) {
    console.error('Error marking ToDo as done:', error);
    return false;
  }
}

export async function toDoUndone(id: number): Promise<boolean> {
  const url = `${ApiUrl}${todos}/${id}/undone`;

  try {
    await axios.put(url);
    return true;
  } catch (error) {
    console.error('Error marking ToDo as undone:', error);
    return false;
  }
}

export async function editToDo(id: number, name: string, priority: number, dueDate?: string): Promise<boolean> {
  const url = `${ApiUrl}${todos}/${id}`;
  const body = {
    text: name,
    dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
    priority: priority
  };

  try {
    await axios.put(url, body);
    return true;
  } catch (error) {
    console.error('Error editing ToDo:', error);
    return false;
  }
}

export async function deleteToDo(id: number): Promise<boolean> {
  const url = `${ApiUrl}${todos}/${id}`;
  try {
    await axios.delete(url);
    return true;
  } catch (error) {
    console.error('Error deleting ToDo:', error);
    return false;
  }
}