import { Typography } from '@mui/material';
import encoraLogo from '../Assets/encora-logo.png'
export function Header(){
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant='h1' component='h1' display='inline'>Task manager</Typography>
                <img src={encoraLogo} width="30%" alt="logo" />
        </div>
    );
}