import redCross from '../components/assets/payment-unsuccessful.png';
import { Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

//!!!!cancel payment should delete the order rather than change the status to -1
//!!!!or I could add to userData.data to make a pop up when you log in it will show your cancelled order and ask if you want to order it?
//!!!!so for now leave it like this
export default function CancelledPayment() {
    const { orderId } = useParams()
    
    useEffect(()=>{
        async function updateOrderStatus(){
            const response = await fetch(`http://localhost:5000/api/orders/cancelOrder/${orderId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    }
            })
        
            const data = await response.json()
            console.log(data)
        }
    
        updateOrderStatus()
    },[])


    return (
        <Stack alignItems='center' spacing={3} mb='150px' mt='50px'>
            <img src={redCross} alt='red-cross' style={{width:'120px', height: '120px'}}/>
            <Typography variant='h4' color='red'>Payment Cancelled</Typography>
            <Typography>You may close this tab</Typography>
        </Stack>
    )
}