import {Stack, Typography, Button, Box, ButtonGroup} from '@mui/material'
import { useNavigate, Link } from 'react-router-dom';

export default function ConfirmOrder({userData, basket, incDecQuantity, deleteItem, placeFinalOrder, openBasket}) {
let navigate = useNavigate()
console.log(basket)
const orderId = basket.orderId
const itemsArr = [...basket.items]
console.log(itemsArr)
let totalCostOfOrder = 0

function makeid() {
    const length = Math.floor(Math.random() * 15) + 12;
    let result           = '';
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

    return( 
        <Stack sx={{ display: { xs: openBasket ? 'none' : 'block', md: 'block' } }} key={()=>makeid()}>     
        <Typography variant='h4' mt='30px' align='center'>Please check and confirm your order</Typography>

        <Stack direction='column' spacing={3} mb='25px' mt='35px' alignItems='center' >
        {itemsArr.map(item => {
            const size = item.size
            const crust = item.crust
            const quantity = item.quantity
            //if size is small then size cost should be £0 otherwise the cost of the size selected 
            const sizeCost = size === 'Small' ? 0 : parseFloat(size.split('£')[1])
            const crustCost = parseFloat(crust.split('£')[1])
            const totalCostOfItem = ((sizeCost + crustCost)* quantity).toFixed(2)
            totalCostOfOrder += parseFloat(totalCostOfItem)
            totalCostOfOrder.toFixed(2)
            console.log(totalCostOfOrder)
            
            return (
                <Stack direction={{xs:'column', md:'row'}} alignItems='center' spacing={5} border='solid grey 3px'>
                    <img src={item.pizza.img} alt='pizza' height='170px' width='220px'/>


                    <Stack direction='column' spacing={1} width='250px' alignItems='center'>
                        <Typography mb='5px' variant='h6' style={{ fontWeight: 600 }}>{item.pizza.name}</Typography>
                        <Typography variant='h7'>Toppings:</Typography>
                        <Typography align='center'>{item.pizza.description}</Typography>
                    </Stack>


                    <Stack direction='column' spacing={1} width='250px' alignItems='center'>
                        <Typography style={{ fontWeight: 600 }}>{crust}</Typography>
                        <Typography style={{ fontWeight: 600 }}>{size}</Typography>
                        
                        {item.pizza.veg && <Button disabled sx={{ display: openBasket ? 'none' : 'block', color: '#fff', background: 'green', fontSize: '14px', borderRadius: '20px', textTransform: 'capitalize', height:'35px', width: '25px'}}><Typography color='white' align='center' >veg</Typography></Button>}
                    </Stack>


                    <Stack directon='column' align='center' spacing={1} sx={{display: openBasket ? 'none' : 'block'}}>
                        <Typography>Quantity:</Typography>

                        <Box display='flex' height='40px' ml={3} alignItems='center'>
                            <ButtonGroup size="small" aria-label="small outlined button group">
                                {quantity > 1 && <Button onClick={() => incDecQuantity(orderId, item.pizza._id, 'dec')}>-</Button>}
                                <Button disabled sx={{ color: 'black'}} >{quantity}</Button>
                                <Button onClick={() => incDecQuantity(orderId, item.pizza._id, 'inc')}>+</Button>
                            </ButtonGroup>
                        </Box>
                        <Button size='medium'color="error" variant="contained" sx={{display: openBasket ? 'none' : 'block'}} onClick={()=> deleteItem(item.pizza._id, orderId, crust, size, quantity)}>Delete Item</Button>
                    </Stack>


                    <Typography variant='h6' style={{ fontWeight: 600 }}>Total: £{totalCostOfItem}</Typography>
                </Stack>
            )
        })}
        </Stack>
        {basket.items.length !== 0 ? 
        <Stack alignItems='center' mb='20px'>
            <Typography align='center' variant='h4' style={{ fontWeight: 600 }}> Total for Order: £{totalCostOfOrder.toFixed(2)} </Typography>
        </Stack> :
        <Stack alignItems='center' mb='200px'>
            <Typography align='center' variant='h4' mb='40px'> well this is embarassing...looks like you have no items in your basket </Typography>
            <Link to='/'>Add items to basket</Link>
        </Stack>
        }

        {Object.keys(userData).length === 0 ? 
        <>
        <Stack alignItems='center' spacing={3} mb='80px'>
        <Typography variant='h3' align='center'>Oh no looks like you need to log in to be here</Typography>
        <Button onClick={() => navigate('/logIn')} variant='contained'>Log In</Button>
        </Stack>
        </> :
        ''
        }
        
        

        {basket.items.length !== 0 && Object.keys(userData).length !== 0 &&
        <Stack align='center' mt='20px' mb='30px' sx={{display: openBasket ? 'none' : 'block'}}>
            <Button color='success' variant="contained" onClick={placeFinalOrder}> Confirm Order </Button>
        </Stack>}
        
    </Stack>
    )
}
