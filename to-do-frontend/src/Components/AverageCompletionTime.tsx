import { Box, Typography } from '@mui/material'
import Grid from "@mui/material/Grid2"
import { TimeMetrics } from '../Models/Models';

type Prop = {
    timeMetrics?: TimeMetrics
}

export default function AverageCompletionTime(props: Prop){


    return(
        <Box component="section" sx={{ p: 2, border: '1px solid black', borderRadius:2}}>
            <Grid container spacing={2}>
                <Grid size={5}><Typography>Average time to finish tasks:</Typography></Grid>
                <Grid size={2}/>
                <Grid size={5}><Typography>Average time to finish tasks by priority:</Typography></Grid>

                <Grid size={5}/>
                <Grid size={2}/>
                <Grid size={5}><Typography>{timeMetric(props.timeMetrics?.lowToDosAverageTime ?? null, 'Low')}</Typography></Grid>

                <Grid size={5}><Typography>{timeMetric(props.timeMetrics?.toDosAverageTime ?? null)}</Typography></Grid>
                <Grid size={2}/>
                <Grid size={5}><Typography>{timeMetric(props.timeMetrics?.mediumToDosAverageTime ?? null, 'Medium')}</Typography></Grid>

                <Grid size={5}/>
                <Grid size={2}/>
                <Grid size={5}><Typography>{timeMetric(props.timeMetrics?.highToDosAverageTime ?? null, 'High')}</Typography></Grid>
            </Grid>
        </Box>
    );
}

function timeMetric(averageTime: string | null, priority?: string){
    let text = '';

    if(averageTime != null){
        if(priority != null) text = `${priority}: `;
        text += `${averageTime} minutes`
    }

    return text;
}