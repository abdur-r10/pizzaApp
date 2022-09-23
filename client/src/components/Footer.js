import { Stack, Typography } from '@mui/material'
import instagramIcon from '../components/assets/icons8-instagram-50.png';
import twitterIcon from '../components/assets/icons8-twitter-50.png';
import facebookIcon from '../components/assets/icons8-facebook-50.png';

export default function Footer() {
    return (
        <Stack
            direction='row'
            justify-content='space-around'
            backgroundColor='#D3D3D3'
            flexWrap='wrap' 
            justifyContent='center'
            align='center'
        >
            <Stack alignItems='center'>
                <Typography variant='h6' style={{fontWeight : 600}}>FOLLOW US ON:</Typography>
                <Stack direction='row' spacing={5}>
                    <a href="https://www.linkedin.com/in/abdur-rahman-anwar-83a159105/">
                        <img src={instagramIcon} alt='instagramIcon' width='50px' height= '50px'/>
                    </a>
                    <a href="https://www.linkedin.com/in/abdur-rahman-anwar-83a159105/">
                        <img src={twitterIcon} alt='instagramIcon' width='50px' height= '50px'/>
                    </a>
                    <a href="https://www.linkedin.com/in/abdur-rahman-anwar-83a159105/">
                        <img src={facebookIcon} alt='instagramIcon' width='50px' height= '50px'/>
                    </a>
                </Stack>
                <Typography variant='h7' style={{fontWeight : 600}}>Made by Abz...so hot, the sole reason for global warming &copy;</Typography>
            </Stack>
        </Stack>
    )
}