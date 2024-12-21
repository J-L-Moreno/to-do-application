import { Box, Typography } from '@mui/material';
import encoraLogo from '../Assets/encora-logo.png';

export function Header() {
    return (
        <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h1" component="h1">Task manager</Typography>
            <img src={encoraLogo} width="30%" alt="Encora logo" />
        </Box>
    );
}