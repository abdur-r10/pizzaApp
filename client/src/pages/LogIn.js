import { TextField, Stack, Typography, FormControl, Button } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'

export default function LogIn({basket, setBasket, setEmail, setPassword, setUserData, email, password, openBasket}) {
    const navigate = useNavigate()

    //?GET TOKEN FOR USER
    async function authenticateUser(event) {
        event.preventDefault()
        console.log('now we are here')
        const response = await fetch('http://localhost:5000/api/users/login', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
            })
        })
        const data = await response.json()
  
        if(!data._id){
            alert(data.message)
        } else{
            //once logged in we want to set user data = {_id, verified, accountType, data = {previousOrders: []}}
            setUserData(data)
            console.log(data)
            navigate('/')
        }
    }
    




    return(
    <Stack align="center" mt='40px' sx={{ display: openBasket ? 'none' : 'block' }}
    >

        <Typography variant='h2' mb='35px'>Log In</Typography>
        <form onSubmit={authenticateUser}>
        <FormControl>
        <Stack width='300px' align="center" justifyContent="center" mb='45px'>
            <TextField
            id="email-input"
            label="Email"
            type="email"
            autoComplete="current-email"
            variant="filled"
            sx={{mb: '25px'}}
            onChange={(e) => setEmail(e.target.value)}
            required
            />


            <TextField
            id="password-input"
            label="Password"
            type="password"
            autoComplete="current-password"
            variant="filled"
            onChange={(e) => setPassword(e.target.value)}
            required
            />
        </Stack>

        <Stack  align="center" justifyContent="center" mb='20px' sx={{ display: openBasket ? 'none' : 'block' }}>
            <Button variant="contained" width='85px' type='submit'>Log In</Button>
        </Stack>
        </FormControl>
        </form>

        <Stack alignItems="center" justifyContent="center" mb='130px'>
            <Typography>Don't have an account?</Typography>

            <Link to='/createUserAccount'>
                <Typography>Sign up Now</Typography>
            </Link>
        </Stack>
    </Stack>
    )
}