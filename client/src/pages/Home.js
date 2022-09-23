import PizzaCard from '../components/PizzaCard.js'
import {Stack, Typography, Box} from '@mui/material'

export default function Home({pizzaData, setBasket, basket, userData, incDecQuantity, openBasket}) {
  
  return (
    <Box ml='15px'>
      <Typography variant='h3' mt='50px'>Choose from our selection of delicious pizzas:</Typography>
      <Stack sx={{ gap: {lg: '60px', xs: '20px'}}} mt='50px' mb='120px' mx='auto' direction={{ xs: 'column', lg: 'row' }} spacing={1} flexWrap='wrap' justifyContent='start'>
        {pizzaData.map( item => <PizzaCard openBasket={openBasket} data={item} key={item._id} pizzaId={item._id} basket={basket} setBasket={setBasket} userData={userData} incDecQuantity={incDecQuantity}/>)}
      </Stack>
    </Box>
  );
}