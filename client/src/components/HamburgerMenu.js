import {  useNavigate } from 'react-router-dom'
import { Stack, Button} from '@mui/material'

export default function HamburgerMenu({userData, logOut}) {
    let navigate = useNavigate()
    return( 
        <Stack height='200px' width='160px' bgcolor='silver' alignItems='center' spacing={2} sx={{marginLeft: {lg: '1330px', sm: '700px', xs: '200px'}}}>
            <Button onClick={() => navigate('/')} variant="contained" style={{backgroundColor: "green"}}>Home</Button> 

            {Object.keys(userData).length === 0 ? 
            <>       
                <Button onClick={() => navigate('/register')} variant="contained" style={{backgroundColor: "green"}}>Create An Account</Button>
                <Button onClick={() => navigate('/logIn')} variant="contained" style={{backgroundColor: "green"}}>Log In</Button>
            </>: 
            <>
                <Button onClick={() => navigate('/previousOrders')} variant="contained" style={{backgroundColor: "green"}}>View previous orders</Button>
                <Button onClick={() => logOut()} variant="contained" style={{backgroundColor: "red"}}>Log Out</Button>
            </>}

        </Stack>
        
    )
}

/*
if user is not logged in hamburger menu displays Home, Create An Account, Log In
once user is logged in the hamburger menu displays Home, View Previous Orders, Log Out
*/