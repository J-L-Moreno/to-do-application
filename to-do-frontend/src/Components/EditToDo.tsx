import {Button, Modal, Box, InputLabel, TextField, Select, MenuItem} from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import Grid from "@mui/material/Grid2"
import { useEffect, useState } from 'react';
import { editToDo } from '../Providers/ToDosInfo';
import { ToDo } from '../Models/Models';

const timeSteps = { hours: 1, minutes: 1, seconds: 1 };

type Props = {
    onToDoEdited: any,
    toDo: ToDo
}

export default function EditToDo(props: Props){

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);

    const [name, setName] = useState<string | undefined>(props.toDo.text);
    const [priority, setPriority] = useState<number>();
    const [dueDate, setDueDate] = useState<Dayjs | null>();

    useEffect(
        ()=>{
            if(props.toDo.priority == 'HIGH') setPriority(2);
            if(props.toDo.priority == 'MEDIUM') setPriority(1);
            if(props.toDo.priority == 'LOW') setPriority(0);

            setDueDate(dayjs(props.toDo.dueDate));
        },
        []
    );

    

    return (
        <>
            <Button onClick={handleOpen} variant='outlined'>Edit</Button>
            <Modal
                open={open}
                onClose={()=>setOpen(false)}
            >
                <Box component="section" sx={modalStyle}>
                    <Grid container spacing={2}>
                        <Grid size={1}><InputLabel>Name</InputLabel></Grid>
                        <Grid size={11}><TextField
                            value={name} 
                            onChange={onNameChange} 
                            size='small'fullWidth/>
                        </Grid>

                        <Grid size={1}><InputLabel>Priority</InputLabel></Grid>
                        <Grid size={5}>
                            <Select 
                                value={priority}
                                onChange={onPriorityChange}
                                size='small' 
                                fullWidth>
                                <MenuItem value={2}>High</MenuItem>
                                <MenuItem value={1}>Medium</MenuItem>
                                <MenuItem value={0}>Low</MenuItem>
                            </Select>
                        </Grid>
                        <Grid size={6}/>
                        
                        <Grid size={1}><InputLabel>Due date</InputLabel></Grid>
                        <Grid size={5}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    value={dueDate}
                                    onChange={(newValue) => onDueDateChange(newValue!)}
                                    timeSteps={timeSteps}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid size={4}/>
                        <Grid size={2}>
                            <Button onClick={onEditToDo} variant='contained' fullWidth>Edit to do</Button>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </>
    );

    async function onEditToDo(){
        if(name == undefined || name == "" || priority == undefined){
            console.log('cancell');
            setOpen(false);
            return;
        }

        let res;
        await editToDo(props.toDo.id, name, priority, dueDate?.toISOString()).then((value) => res = value);

        if(res){
            props.onToDoEdited();
        }

        setOpen(false);
    }

    function onNameChange(event: any){
        if(event.target.value != "") setName(event.target.value);
    }

    function onPriorityChange(event: any){
        setPriority(event.target.value);
    }

    function onDueDateChange(newDueDate: Dayjs | null){
        setDueDate(newDueDate);
    }
}

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
    bgcolor: 'white',
    border: '1px solid black',
    borderRadius:2,
    p: 2,
};