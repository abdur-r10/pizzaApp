import { Stack, Typography, Button, Box, ButtonGroup } from '@mui/material'


export default function ItemIcon({size, crust, quantity, totalCostOfItem, img, name, toppings, orderId, deleteItem, incDecQuantity, pizzaId}) {
    console.log(quantity)
    console.log({pizzaId, orderId, crust, size, quantity})
    return(
        <Stack direction='column' width='210px' mb='30px' sx={{ backgroundColor: '#C0C0C0', borderRadius: 2 }}>
            <img src={img} alt='pizza img' height='150px' width='210px'/>
            <Typography variant='h6' mb='5px'>{name}</Typography>
            <Typography variant='subtitle1' mb='10px'>Toppings: {toppings}</Typography>
            <Typography variant='subtitle2' mb='5px'>{crust}</Typography>
            <Typography variant='subtitle2' mb='15px'>{size}</Typography>

            <Box display='flex'>
                <ButtonGroup size="small" aria-label="small outlined button group">
                    {quantity > 1 && <Button onClick={() => incDecQuantity(orderId, pizzaId, 'dec')}>-</Button>}
                    <Button disabled>{quantity}</Button>
                    <Button onClick={() => incDecQuantity(orderId, pizzaId, 'inc')}>+</Button>
                </ButtonGroup>
            </Box>

            <Typography variant='h6' mb='5px'>Total: £{totalCostOfItem}</Typography>
            <Button color="error" variant="contained" style={{borderRadius: 35}} onClick={()=> deleteItem(pizzaId, orderId, crust, size, quantity)}>Remove</Button>
            

        </Stack>
    )
}
//add onClick functionality for + and - Button for quantity
//SAME FUNCTIONALITY FOR ITEMICON AND CHECKOUT BUT DIFFERENT FOR PIZZACARD
