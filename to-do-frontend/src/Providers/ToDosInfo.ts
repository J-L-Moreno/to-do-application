import { ApiUrl, todos } from "../Env/ApiConsts";
import axios from "axios";
import { ToDosInfo } from "../Models/Models";

export async function createToDo(name: string, priority: number, dueDate?: any): Promise<boolean>{
  type RequestBody = {
    text: string | undefined,
    priority: number | undefined,
    creationDate: string,
    dueDate?: string | undefined
  }

  let currentDateTime: string = new Date().toISOString();
    try{
        const url = `${ApiUrl}${todos}`
        const body: RequestBody = {
            text : name,
            priority : priority,
            creationDate : currentDateTime,
            dueDate : dueDate?.toDate().toISOString()
        };
        const response = await axios.post(url, body);
        console.log(response);

        return true;
    } catch(error) {
        console.error();
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
  let url = `${ApiUrl}${todos}?page=${page}`;

  try{
    if(sortByDueDate != undefined) url = url.concat(`&sortByDueDate=${sortByDueDate}`);
    if(sortByPriority != undefined) url = url.concat(`&sortByPriority=${sortByPriority}`);
    if(priorityFilter != undefined && priorityFilter != -1) url = url.concat(`&priorityFilter=${priorityFilter}`);
    if(doneFilter != undefined) url = url.concat(`&doneFilter=${doneFilter}`);
    if(nameFilter != undefined) url = url.concat(`&nameFilter=${nameFilter}`);

    console.log(url)

    const resp = await axios.get(url);

    console.log(resp.data)
    
    const toDosInfo: ToDosInfo = {
        possiblePages : resp.data.possiblePages,
        searchPages : resp.data.searchPages,
        toDos : resp.data.toDos,
        timeMetrics : resp.data.timeMetrics
    }

    return toDosInfo;
  } catch(error){
    console.error();
  }
}

export async function toDoDone(id: number){
  try{
    const url = `${ApiUrl}${todos}/${id}/done`;
    await axios.post(url);
    return true;
  } catch(error) {
    console.error();
    return false;
  }
}

export async function toDoUndone(id: number){
  try{
    const url = `${ApiUrl}${todos}/${id}/undone`;
    await axios.put(url);
    return true;
  } catch(error) {
    console.error();
    return false;
  }
}

export async function editToDo(id: number, name: string, priority: number, dueDate?: string | undefined): Promise<boolean> {
  const url = `${ApiUrl}${todos}/${id}`;
  const body = {
    text : name,
    dueDate : dueDate,
    priority : priority
  }

  try{
    await axios.put(url, body);
    return true;
  } catch(error){
    console.error()
    return false;
  }
}

export async function deleteToDo(id: number):Promise<boolean>{
  const url = `${ApiUrl}${todos}/${id}`;
  
  try{
    await axios.delete(url);
    return true;
  } catch(error){
    console.error();
    return false;
  }
}