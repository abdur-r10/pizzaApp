import { Button, Typography, Stack, FormControl, TextField } from '@mui/material'
import { Link } from 'react-router-dom'
import {useState} from 'react'

export default function CreateAccount({openBasket}) {

    //all information required to make an account
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    //Password requirements:
    //is it 8 characters or longer
    const eightCharacters = password.length >= 8 ? true : false
    //does it contain a space or not
    const noSpace = password.length === 0 ? false : password.replace(/[^\s+]/g, '').length >= 1 ? false : true
    //does it contain at least one uppercase letter 
    const oneUppercaseLetter = password.replace(/[^A-Z]/g, '').length >= 1 ? true : false
    //does it contain at least one lowercase letter
    const oneLowercaseLetter =  password.replace(/[^a-z]/g, '').length >= 1 ? true : false
    //does it contain at least one number or special character
    const oneNumOrSpecialChar = password.replace(/[^0-9`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g, '').length >= 1 ? true : false
    //if it meets all 5 requirements then it is considered an acceptable password
    const acceptablePassword = (eightCharacters && noSpace && oneUppercaseLetter && oneLowercaseLetter && oneNumOrSpecialChar) ? true : false
    //this array is used to measure the strength of the password 
    /*
    if all 5 true then green strength
    if 3 or 4 true then amber strength
    if 1 or 2 true then red strength
    */
    const passwordStrengthConditions = [eightCharacters, noSpace, oneUppercaseLetter, oneLowercaseLetter, oneNumOrSpecialChar]
    const passwordStrengthRating = (passwordStrengthConditions.filter(item => item === true)).length

    async function registerUser(event) {
        event.preventDefault()
        console.log(email, firstName, lastName, password, confirmPassword)
         
        if(confirmPassword === password && acceptablePassword){
        const response = await fetch('http://localhost:5000/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                firstName, 
                lastName, 
                password,
            })
        })
        const data = await response.json()
        alert(data.message)
        console.log(data)
        }
        else if(confirmPassword !== password){
            alert('Please double check confirmed password')
        }
        else if(!eightCharacters){
            alert('Please ensure password is at least 8 characters')
        }
        else if(!noSpace){
            alert('Your password contains a space(s)')
        }
        else if(!oneUppercaseLetter){
            alert('Please ensure password has at least 1 uppercase letter')
        }
        else if(!oneLowercaseLetter){
            alert('Please ensure password has at least 1 lowercase letter')
        }
        else if(!oneNumOrSpecialChar){
            alert('Please ensure password has at least 1 number or special character')
        }
    }

    return(
        <Stack align="center" mt='40px' sx={{ display: { xs: openBasket ? 'none' : 'block', md: 'block' } }}>
            <Typography variant='h4' mb='35px'>Create An Account</Typography>

        <form onSubmit={registerUser}>
            <FormControl>
        <Stack width='300px' justifyContent="center" mb='45px'>
            <TextField
            id="email-input"
            label="input email"
            type="email"
            autoComplete="current-email"
            variant="filled"
            sx={{mb: '25px'}}
            onChange={(e) => setEmail(e.target.value)}
            required
            />

            <TextField
            value={firstName}
            id="first-name-input"
            label="Enter first name"
            type="name"
            variant="filled"
            sx={{mb: '25px'}}
            onChange={(e) => setFirstName(e.target.value)}
            required
            />

            <TextField
            value={lastName}
            id="last-name-input"
            label="Enter last name"
            type="name"
            variant="filled"
            sx={{mb: '25px'}}
            onChange={(e) => setLastName(e.target.value)}
            required
            />

            <TextField
            value={password}
            id="password-input"
            label="Create a password"
            type="password"
            variant="filled"
            sx={{mb: '10px'}}
            onChange={(e) => setPassword(e.target.value)}
            required
            />

            {passwordStrengthRating > 0 && <Typography variant='h7' style={{ fontWeight: 600}} mb='5px'>Password Strength</Typography>}
            <Stack sx={{ backgroundColor: '#C0C0C0', borderRadius: 35}} width='300px' height='10px'direction='row' display={passwordStrengthRating === 0 ? 'none' : ''}>
                {(passwordStrengthRating === 1 || passwordStrengthRating === 2) && <Stack sx={{ backgroundColor: 'red' , borderRadius: 35}} width='80px' direction='row'></Stack>}
                {(passwordStrengthRating === 3 || passwordStrengthRating === 4) && <Stack sx={{ backgroundColor: 'orange' , borderRadius: 35}} width='170px' direction='row'></Stack>}
                {acceptablePassword && <Stack sx={{ backgroundColor: 'green', borderRadius: 35}} width='270px' direction='row'></Stack>}
                .
            </Stack>

            {(!acceptablePassword) && <Typography variant='subtitle1' style={{ fontWeight: 700}}>Please ensure your password has:</Typography>}
            <Stack mb='20px'>
                {(!eightCharacters || !noSpace) && <Typography variant='subtitle2'>at least 8 characters (no spaces)</Typography>}
                {!oneUppercaseLetter && <Typography variant='subtitle2'>at least 1 uppercase letter</Typography>}
                {!oneLowercaseLetter && <Typography variant='subtitle2'>at least 1 lowercase letter</Typography>}
                {!oneNumOrSpecialChar  && <Typography variant='subtitle2'>at least 1 number or special character</Typography>}
            </Stack>


            <TextField
            value={confirmPassword}
            id="confirm-password-input"
            label="Confirm password"
            type="password"
            variant="filled"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            />
        </Stack>

        <Stack  alignItems="center" justifyContent="center" mb='20px'>
            <Button variant="contained" width='85px' type='submit'>Create Account</Button>
        </Stack>
        </FormControl>
        </form>

        <Stack justifyContent="center" mb='50px'>
            <Typography>Already have an account?</Typography>

            <Link to='/logIn'>
                <Typography>Log in now</Typography>
            </Link>
        </Stack>
        </Stack>
    )
}

/* 
at least 8 characters (no spaces) - .length and .split('') then find if in that array there is a space
at least 1 lowercase letter - .split('') then find if we have at least 1 lowercase letter by .filter()
at least 1 uppercase letter - .split('') then find if we have at least 1 uppercase letter .filter()
at least 1 number or special character - .split('') then find if we have at least 1 number or special character .filter()
*/