import {Stack, Typography, Button} from '@mui/material'

export default function PrevOrdersScroll({size, crust, name, img, toppings, veg, quantity }){
    return (
        <Stack direction='row' height='250px' width='450px' sx={{background: 'silver', marginLeft: '10px'}} style={{borderRadius: 35}}
        >
            <img src={img} alt='pizza' width='120px' height='110px'/>

            <Stack direction='column' width='400px' spacing={1} ml='15px'>
                <Typography variant='h5' style={{ fontWeight: 600 }}>{name}</Typography>
                <Typography variant='h7' style={{ fontWeight: 500 }}>Toppings: {toppings}</Typography>
                {veg && <Button sx={{ color: '#fff', background: 'green', fontSize: '14px', borderRadius: '20px', textTransform: 'capitalize', height:'35px', width: '25px'}}>veg</Button>}
                <Typography style={{ fontWeight: 700 }}>Size: {size}</Typography>
                <Typography style={{ fontWeight: 700 }}>Crust: {crust}</Typography>
                <Typography style={{ fontWeight: 700 }}>Quantity: {quantity}</Typography> 
            </Stack>
            
        </Stack>
    )
}
