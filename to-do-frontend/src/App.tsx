import { SearchControlls } from "./Components/SearchControlls";
import NewToDo from "./Components/NewToDo";
import AverageCompletionTime from "./Components/AverageCompletionTime";
import {Box, Stack} from '@mui/material';
import { useEffect, useState } from 'react';
import { ToDo, ToDosInfo } from "./Models/Models";
import { ToDosTable } from "./Components/ToDosTable";
import { getToDos, toDoDone, toDoUndone } from "./Providers/ToDosInfo";
import {Pagination} from "@mui/material";
import { Header } from "./Components/Header";

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
      <Header/>
      <SearchControlls 
        text={nameFilter}
        onNewText={onTextChange}
        priority={priorityFilter}
        onNewPriority={onPriorityChange}
        state={doneFilter}
        onNewState={onStateChange}
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

  function setSortByPriorityAsc() {
    setSortBy('priority', true);
  }
  
  function setSortByPriorityDes() {
    setSortBy('priority', false);
  }
  
  function setSortByDueDateAsc() {
    setSortBy('dueDate', true);
  }
  
  function setSortByDueDateDes() {
    setSortBy('dueDate', false);
  }

  function onTextChange(event: React.ChangeEvent<HTMLInputElement>) {
    setNameFilter(event.target.value);
  }

  function onPriorityChange(event: React.ChangeEvent<{ value: unknown }>) {
    setPriorityFilter(event.target.value as number);
  }

  function onStateChange(event: React.ChangeEvent<{ value: unknown }>) {
    if(event.target.value == 1)setDoneFilter(true);
    if(event.target.value == 0)setDoneFilter(false);
    if(event.target.value == -1)setDoneFilter(undefined);
  }

  function onToDoCreated(){
    getToDos(page, sortByDueDate, sortByPriority, priorityFilter, doneFilter, nameFilter).then(data => setToDosInfo(data));
    setGeneralCheck(false);
  }

  function onPageChange(_event: React.ChangeEvent<unknown>, value: number){
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

  function setSortBy(field: 'priority' | 'dueDate', asc: boolean) {
    if (field === 'priority') {
      setSortByPriority(asc);
    } else {
      setSortByDueDate(asc);
    }
    getToDos(page, field === 'dueDate' ? asc : sortByDueDate, field === 'priority' ? asc : sortByPriority, priorityFilter, doneFilter, nameFilter)
      .then(data => setToDosInfo(data));
  }
}