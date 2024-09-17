import {Button, Box, TextField, Select, MenuItem, InputLabel} from '@mui/material';
import Grid from "@mui/material/Grid2"
import '@fontsource/roboto/300.css';


export function SearchControlls(props: any){
    return(
        <>
            <Box component="section" sx={{ p: 2, border: '1px solid black', borderRadius:2}}>
            <Grid container spacing={2}>
                <Grid size={1}><InputLabel htmlFor="">Name</InputLabel></Grid>
                <Grid size={11}><TextField value={props.text} onChange={props.onNewText} fullWidth size='small' variant='outlined'/></Grid>

                <Grid size={1}><InputLabel>Priority</InputLabel></Grid>
                <Grid size={5}>
                    <Select value={props.priority} onChange={props.onNewPriority} size='small' fullWidth>
                        <MenuItem value={-1}>All</MenuItem>
                        <MenuItem value={2}>High</MenuItem>
                        <MenuItem value={1}>Medium</MenuItem>
                        <MenuItem value={0}>Low</MenuItem>
                    </Select>
                </Grid>
                <Grid size={6}></Grid>

                <Grid size={1}><InputLabel>State</InputLabel></Grid>
                <Grid size={5}>
                    <Select defaultValue={-1} onChange={props.onNewState} size='small' fullWidth>
                        <MenuItem value={-1}>All</MenuItem>
                        <MenuItem value={1}>Done</MenuItem>
                        <MenuItem value={0}>Undone</MenuItem>
                    </Select>
                </Grid>
                <Grid size={5}></Grid>
                <Grid size={1}><Button onClick={props.onSearch} fullWidth variant='contained'>Search</Button></Grid>
            </Grid>
            </Box>
        </>
    );
}