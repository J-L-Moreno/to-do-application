import { TableRow, TableCell, Checkbox, Button } from "@mui/material";
import { ToDo } from "../Models/Models";
import { useEffect, useState } from "react";
import { deleteToDo, toDoDone, toDoUndone } from "../Providers/ToDosInfo";
import EditToDo from "./EditToDo";

type Props = {
    generalCheck: boolean,
    toDo: ToDo,
    refreshToDos: () => void
}

export function ToDoTableCell(props: Props){
    const [isDone, setIsDone] = useState(props.toDo.done);

    useEffect(
        ()=>{
            if(props.generalCheck == true) setIsDone(true);
        },
        []
    );

    let dueDateString;
    if (props.toDo.dueDate != null) {
        const dueDate = new Date(props.toDo.dueDate);
        const [month, day, year] = dueDate.toLocaleDateString().split('/');
        dueDateString = `${year}/${month}/${day}`;
    }
    return(
        <TableRow key={props.toDo.id}>
            <TableCell width={1}><Checkbox checked={isDone} onChange={onIsDoneChange} /></TableCell>
            <TableCell width={400}>{props.toDo.text}</TableCell>
            <TableCell width={2} align="center">{props.toDo.priority}</TableCell>
            <TableCell width={2} align="center">{dueDateString}</TableCell>
            <TableCell width={2} align="center">
                <EditToDo toDo={props.toDo} onToDoEdited={props.refreshToDos}/>
                <span>    </span>
                <Button onClick={() => onDeleteToDo(props.toDo.id)} variant="outlined">Delete</Button>
            </TableCell>
        </TableRow>
    );

    async function onIsDoneChange(event: any){
        setIsDone(event.target.checked);

        if(event.target.checked){
            await toDoDone(props.toDo.id);
        } else {
            await toDoUndone(props.toDo.id);
        }

        props.refreshToDos();
    }

    async function onDeleteToDo(id: number){
        let res;
        await deleteToDo(id).then(value => res = value);

        if(res) props.refreshToDos();
    }
}