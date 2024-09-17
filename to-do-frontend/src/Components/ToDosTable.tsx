import { Box, Table, TableBody, TableCell, TableHead, TableRow, Checkbox, Button} from "@mui/material";
import {ToDo, TimeMetrics} from '../Models/Models';
import { ToDoTableCell } from "./ToDoTableCell";

type Props = {
    posiblePages: number
    toDos: ToDo[],
    timeMetrics?: TimeMetrics,
    generalCheck: boolean,
    onGeneralCheckChange: (event:any)=>void,
    refreshToDos: () => void,
    setSortByPriorityAsc: () => void,
    setSortByPriorityDes: () => void,
    setSortByDueDateAsc: () => void,
    setSortByDueDateDes: () => void
}

export function ToDosTable(props: Props){
    console.log(props.toDos)
    return(
        <Box component="section" sx={{ p: 2, border: '1px solid black', borderRadius:2}}>
            <Table size='small' aria-label="To do table">
                <TableHead>
                    <TableRow>
                        <TableCell width={1}><Checkbox checked={props.generalCheck} onChange={props.onGeneralCheckChange}/></TableCell>
                        <TableCell width={400} align="left">Name</TableCell>
                        <TableCell width={2} align="center">Priority 
                            <br />
                            <Button size="small" variant="text" onClick={props.setSortByPriorityAsc}>↑</Button>
                            <Button size="small" variant="text" onClick={props.setSortByPriorityDes}>↓</Button>
                        </TableCell>
                        <TableCell width={2} align="center">Due date
                            <br />
                            <Button size="small" variant="text" onClick={props.setSortByDueDateAsc}>↑</Button>
                            <Button size="small" variant="text" onClick={props.setSortByDueDateDes}>↓</Button>
                        </TableCell>
                        <TableCell width={2} align="center">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                    props.toDos.map((toDo: ToDo) =>(
                        <ToDoTableCell 
                            key={toDo.id} toDo={toDo}
                            refreshToDos={props.refreshToDos}
                            generalCheck={props.generalCheck}/>
                    ))}
                </TableBody>
            </Table>
        </Box>
    );

    
};