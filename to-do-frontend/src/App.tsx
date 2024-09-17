import { SearchControlls } from "./Components/SearchControlls";
import NewToDo from "./Components/NewToDo";
import AverageCompletionTime from "./Components/AverageCompletionTime";
import {Box, Stack} from '@mui/material';
import { useEffect, useState } from 'react';
import { ToDo, ToDosInfo } from "./Models/Models";
import { ToDosTable } from "./Components/ToDosTable";
import { getToDos, toDoDone, toDoUndone } from "./Providers/ToDosInfo";
import {Pagination} from "@mui/material";

export function App(){
  const [page, setPage] = useState<number>(1);
  const [nameFilter, setNameFilter] = useState<string | undefined>(undefined);
  const [priorityFilter, setPriorityFilter] = useState<number>(-1);
  const [doneFilter, setDoneFilter] = useState<boolean | undefined>(undefined);
  const [sortByDueDate, setSortByDueDate] = useState<boolean | undefined>(undefined);
  const [sortByPriority, setSortByPriority] = useState<boolean | undefined>(undefined);
  const [toDosInfo, setToDosInfo] = useState<ToDosInfo>();
  const [generalCheck, setGeneralCheck] = useState<boolean>(false);

  useEffect(
    () => {
      getToDos(page, sortByDueDate, sortByPriority, priorityFilter, doneFilter, nameFilter)
        .then(data => setToDosInfo(data));
    },
    []
  );

  return(
    <Stack spacing={2}>
      <SearchControlls 
        text={nameFilter}
        onNewText={(event: any) => onTextChange(event)}
        priority={priorityFilter}
        onNewPriority={(event: any) => onPriorityChange(event)}
        state={doneFilter}
        onNewState={(event: any) => onStateChange(event)}
        onSearch={onSearch}
      />
      <NewToDo onToDoCreated={onToDoCreated}/>
      <ToDosTable 
        refreshToDos={refreshToDos} 
        setSortByPriorityAsc={setSortByPriorityAsc}
        setSortByPriorityDes={setSortByPriorityDes}
        setSortByDueDateAsc={setSortByDueDateAsc}
        setSortByDueDateDes={setSortByDueDateDes}
        generalCheck={generalCheck} 
        onGeneralCheckChange={onGeneralCheckChange} 
        posiblePages={toDosInfo?.possiblePages ?? 1} 
        toDos={toDosInfo?.toDos ?? []} 
        timeMetrics={toDosInfo?.timeMetrics}/>
      <Box display="flex" justifyContent="center"><Pagination color="primary" shape="rounded" count={toDosInfo?.searchPages ?? toDosInfo?.possiblePages} page={page} onChange={onPageChange} /></Box>
      <AverageCompletionTime 
        timeMetrics={toDosInfo?.timeMetrics}
      />
    </Stack>
  );

  function onSearch(){
    if(priorityFilter != undefined || doneFilter != undefined || nameFilter != undefined) {
      setPage(1);
      getToDos(1, undefined, undefined, priorityFilter, doneFilter, nameFilter).then(data => setToDosInfo(data));
    } else {
      getToDos(page, undefined, undefined, priorityFilter, doneFilter, nameFilter).then(data => setToDosInfo(data));
    }

    setSortByDueDate(undefined);
    setSortByPriority(undefined);
    setGeneralCheck(false)
  }

  function setSortByPriorityAsc(){
    setSortByPriority(true);
    getToDos(page, sortByDueDate, true, priorityFilter, doneFilter, nameFilter).then(data => setToDosInfo(data));
  }

  function setSortByPriorityDes(){
    setSortByPriority(false);
    getToDos(page, sortByDueDate, false, priorityFilter, doneFilter, nameFilter).then(data => setToDosInfo(data));
  }

  function setSortByDueDateAsc(){
    setSortByDueDate(true);
    getToDos(page, true, sortByPriority, priorityFilter, doneFilter, nameFilter).then(data => setToDosInfo(data));
  }

  function setSortByDueDateDes(){
    setSortByDueDate(false);
    getToDos(page, false, sortByPriority, priorityFilter, doneFilter, nameFilter).then(data => setToDosInfo(data));
  }

  function onTextChange(event: any){
    setNameFilter(event.target.value);
  }

  function onPriorityChange(event: any){
    setPriorityFilter(event.target.value);
  }

  function onStateChange(event: any){
    if(event.target.value == 1)setDoneFilter(true);
    if(event.target.value == 0)setDoneFilter(false);
    if(event.target.value == -1)setDoneFilter(undefined);
  }

  function onToDoCreated(){
    getToDos(page, sortByDueDate, sortByPriority, priorityFilter, doneFilter, nameFilter).then(data => setToDosInfo(data));
    setGeneralCheck(false);
  }

  function onPageChange(event: React.ChangeEvent<unknown>, value: number){
    console.log(event);
    setPage(value);
    getToDos(value, sortByDueDate, sortByPriority, priorityFilter, doneFilter, nameFilter).then(data => setToDosInfo(data));
    setGeneralCheck(false);
  }

  function onGeneralCheckChange(event: any){
    setGeneralCheck(event.target.checked);

    if(event.target.checked){
        toDosInfo?.toDos.map( async (toDo: ToDo) => await toDoDone(toDo.id));
    } else {
        toDosInfo?.toDos.map( async (toDo: ToDo) => await toDoUndone(toDo.id));
    }
    refreshToDos();
  }

  function refreshToDos(){
    getToDos(page, sortByDueDate, sortByPriority, priorityFilter, doneFilter, nameFilter).then(data => setToDosInfo(data));
  }
}