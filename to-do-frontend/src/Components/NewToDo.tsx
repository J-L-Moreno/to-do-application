import {Button, Modal, Box, InputLabel, TextField, Select, MenuItem} from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import Grid from "@mui/material/Grid2"
import { useState } from 'react';
import { createToDo } from '../Providers/ToDosInfo';

const timeSteps = { hours: 1, minutes: 1, seconds: 1 };

export default function NewToDo(props: any){
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setName(undefined);
        setPriority(undefined);
        setDueDate(undefined);
    }

    const [name, setName] = useState<string>();
    const [priority, setPriority] = useState<number>();
    const [dueDate, setDueDate] = useState<Dayjs | null>();

    return (
        <>
            <Box maxWidth={600}><Button onClick={handleOpen} fullWidth={false} variant='contained'>+ New To Do</Button></Box>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
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
                                    onChange={(newValue) => onDueDateChange(newValue)}
                                    timeSteps={timeSteps}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid size={4}/>
                        <Grid size={2}>
                            <Button onClick={onCreateToDo} variant='contained' fullWidth>Create to do</Button>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </>
    );

    async function onCreateToDo(){
        if(name == undefined || priority == undefined){
            console.log('cancell');
            handleClose();
            return;
        }

        let res;
        await createToDo(name, priority, dueDate).then(value => res = value);

        if(res){
            props.onToDoCreated();
        }

        handleClose();
    }

    function onNameChange(event: any){
        setName(event.target.value)
    }
    
    function onDueDateChange(newDueDate: dayjs.Dayjs | null){
        console.log(newDueDate?.toDate().toISOString());
        setDueDate(newDueDate);
    }

    function onPriorityChange(event: any){
        setPriority(event.target.value);
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