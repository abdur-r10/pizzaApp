import greenTick from '../components/assets/payment-success.png';
import { Stack, Typography, List, ListItem, Box, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import greenDot from '../components/assets/green-dot.png'
import greyDot from '../components/assets/grey-dot.png'
import blackDot from '../components/assets/black-dot.png'
import orderPlaced from '../components/assets/list.png'
import preparing from '../components/assets/cooking.png'
import delivery from '../components/assets/delivery.png'
import delivered from '../components/assets/pizza (1).png'
import greyLine from '../components/assets/vertical-grey-line-png-18.png'
import blackLine from '../components/assets/vertical-black-line.png'

export default function SuccessfulPayment({userData, setUserData, openBasket}) {
    const { orderId, userId } = useParams()
    //as soon as page loads we want to chnage the orderstatus to 1 (meaning order has been placed)
    const [orderStatus, setOrderStatus] = useState(1);
    //check list of items orderd, once food is delivered  
    const [checkList, setCheckList] = useState([])
    useEffect(() => {
    //!Make Api call to change order status to 1
    async function getOrderStatus(){
        const response = await fetch(`http://localhost:5000/api/orders/trackOrder/${orderId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
        })
    
        const data = await response.json()
        setOrderStatus(data)
        }

    getOrderStatus()
    //! can add in backend to send order to kitchen once changing the status    
},[])



async function getOrderCheckList(){
    const orderCheckList = await fetch(`http://localhost:5000/api/orders/createOrderCheckList/${orderId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const data = await orderCheckList.json()
    setCheckList(data)
}






async function updateOrderStatus(newStatus) {
    
    const response = await fetch(`http://localhost:5000/api/orders/updateOrderStatus/${orderId}/${newStatus}/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }
    })
      
    const data = await response.json()
    console.log(data)
    if(newStatus === 4) {
        setUserData(data)
        console.log(userData)
        getOrderCheckList()
    }
}

//need an id for they key when mapping
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


// dynamically change the dot collor img tag to whatever the orderStatus is.
// grey = done, green = current status, black = upcoming
/* Status = 
    {
        cancelled = -1, //!could just delete order rather than change the status to -1
        not placed = 0, 
        order placed = 1, 
        preparing order = 2, 
        out for delivery = 3, 
        delivered = 4
    } 

*/
// once status is 4 , in the backend we unshift the orderId push order into previous orders array
    return (
    <Stack sx={{ display: { xs: openBasket ? 'none' : 'block', md: 'block' } }}>
        <Stack alignItems='center' spacing={1} mb='25px'>
            <img src={greenTick} alt='successful-payment-green-tick' style={{width:'100px', height: '100px'}}/>
            <Typography variant='h4' color='#00CC70' ml='30px'> Successful Payment</Typography>
            <Typography style={{ fontWeight: 600 }}>Your order Id is: {orderId}</Typography>
            <Typography style={{ fontWeight: 600 }}>(Please show this to the delivery driver)</Typography>
        </Stack>


        <Stack direction='column' alignItems='center' mb='40px'>
            <List>
            <Stack direction='column' alignItems='center' spacing={1} mb='20px'>
                
                    <ListItem disablePadding>
                    <Stack direction='row' name='order-placed-1' alignItems='center' spacing={9}>
                        <img src={orderPlaced} alt='list-icon' height='35px' width='35px'/>
                        <img src={orderStatus < 1 ? blackDot : orderStatus > 1 ? greyDot : greenDot} alt='dot' height='15px' width='15px'/>
                        <Typography variant= 'h5' style={{ fontWeight: 600 }} color={orderStatus < 1 ? 'black' : orderStatus > 1 ? '#D9D9D6' : '#00CC00'}>Order Placed</Typography>
                    </Stack>
                    </ListItem>


                    <Stack direction='column' alignItems='center'>
                        <img src={orderStatus > 1 ? greyLine : blackLine} alt='line' height='40px'/>
                    </Stack>

                
                    <ListItem disablePadding>
                    <Stack direction='row' name='preparing-order-2' alignItems='center' spacing={9}>
                        <img src={preparing} alt='cooking-icon' height='35px' width='35px'/>
                        <img src={orderStatus < 2 ? blackDot : orderStatus > 2 ? greyDot : greenDot} alt='dot' height='15px' width='15px'/>
                        <Typography variant= 'h5' style={{ fontWeight: 600 }} color={orderStatus < 2 ? 'black' : orderStatus > 2 ? '#D9D9D6' : '#00CC00'}>Preparing Order</Typography>
                    </Stack>
                    </ListItem>
                

                    <Stack direction='column' alignItems='center'>
                        <img src={orderStatus > 2 ? greyLine : blackLine} alt='line' height='40px'/>
                    </Stack>

                
                    <ListItem disablePadding>
                    <Stack direction='row' name='out-for-delivery-3' alignItems='center' spacing={9}>
                        <img src={delivery} alt='delivery-icon' height='35px' width='35px'/>
                        <img src={orderStatus < 3 ? blackDot : orderStatus > 3 ? greyDot : greenDot} alt='dot' height='15px' width='15px'/>
                        <Typography variant= 'h5' style={{ fontWeight: 600 }} color={orderStatus < 3 ? 'black' : orderStatus > 3 ? '#D9D9D6' : '#00CC00'}>Out For Delivery</Typography>
                    </Stack>
                    </ListItem>
                

                    <Stack direction='column' alignItems='center'>
                        <img src={orderStatus > 3 ? greyLine : blackLine} alt='line' height='40px'/>
                    </Stack>

                
                    <ListItem disablePadding>
                    <Stack direction='row' name='enjoy-your-food-4' alignItems='center' spacing={9}>
                        <img src={delivered} alt='pizza-icon' height='35px' width='35px'/>
                        <img src={orderStatus < 4 ? blackDot : orderStatus > 4 ? greyDot : greenDot} alt='dot' height='15px' width='15px'/>
                        <Typography variant= 'h5' style={{ fontWeight: 600 }} color={orderStatus < 4 ? 'black' : orderStatus > 4 ? '#D9D9D6' : '#00CC00'}>Enjoy Your Food!!!</Typography>
                    </Stack>
                    </ListItem>
                
            </Stack>
            </List>


            {
                orderStatus === 4 &&
                <>
                <Typography variant='h7' style={{fontWeight: 600}}>Please check you have the following items</Typography>
                <Typography variant='subtitle2' mb='15px'>SLIDE HORIZONTALLY TO SEE CHECK LIST</Typography>
                    <Stack direction='row' spacing={2} width='auto' alignItems='center' backgroundColor= "#19334d" sx={{
                    overflowY: "auto",
                    scrollBehaviour: "smooth",
                    width: {lg: '26%', xs: '90%'},
                    height: '156px'
                  }}>
                    {checkList.map(item => {
                        const key = makeid()
                        return(
                            <Stack height='135px' key={key}>
                            <Stack direction='column' border='solid grey 3px' padding='7px' width='240px' height='116px' backgroundColor='white'>
                                <Typography style={{ fontWeight: 600 }}>{item.name}</Typography>
                                <Typography>Size: {item.size}</Typography>
                                <Typography>{item.crust}</Typography>
                                <Typography>Quantity: {item.quantity}</Typography>
                            </Stack>
                            </Stack>
                        )
                    })}
                    </Stack>
                </>
                
                
                
            }



            <Box heigh='300px' width='300px' sx={{ mt: '50px', border: '5px solid red' }}>
                <Stack>
                    <Button onClick={()=>updateOrderStatus(2)}>Preparing Order (2)</Button>
                    <Button onClick={()=>updateOrderStatus(3)}>Out For Delivery (3)</Button>
                    <Button onClick={()=> updateOrderStatus(4)}>Delivered (4)</Button>
                </Stack>
            </Box>
            </Stack>
    </Stack>
    )
}