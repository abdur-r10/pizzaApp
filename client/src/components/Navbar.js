import { Link, useNavigate } from 'react-router-dom';
import { Stack, Button, Typography, Box } from '@mui/material';
import hamburgerIcon from '../components/assets/icons8-menu-30.png';
import basketIcon from '../components/assets/icons8-basket-24.png';
import mainTitle from '../components/assets/Main title.png'
import HamburgerMenu from './HamburgerMenu';
import Basket from './Basket';

export default function Navbar({basket, deleteItem, incDecQuantity, userData, logOut, openMenu, setOpenMenu, openBasket, setOpenBasket}) {
    console.log('we are in Navbar')
    console.log(basket)
    let navigate = useNavigate()
    //opening and closing hamburger menu
    function toggleMenu() {
        setOpenMenu(prevOpenMenu => !prevOpenMenu)
        setOpenBasket(false)
    }
    //opening and closing basket
    function toggleBasket(){
        setOpenBasket(prevOpenBasket => !prevOpenBasket)
        setOpenMenu(false)
    }

    //if user is logged in then we want to assign them to that basket before directing them to the confirm order page
    async function assignUserToBasket() {
        console.log(basket.orderId)
        console.log(userData._id)
        console.log(`http://localhost:5000/api/orders/assignUserToOrder/${basket.orderId}/${userData._id}`)
        //
        const assignUserToBasket = await fetch(`http://localhost:5000/api/orders/assignUserToOrder/${basket.orderId}/${userData._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
        })

        const data = await assignUserToBasket.json()
        console.log(data)
        navigate(`/confirmOrder/${basket.orderId}`)
    }

    //?USE THIS TO REDIRECT USER WHEN CLICKING ON PROCEED TO CHECKOUT
    function redirect(){
        console.log(userData)
        //if user is not logged in then direct them to the log in page
        //if user is logged in then we want to assign them to that basket then directing them to the confirm order page
        Object.keys(userData).length === 0 ? navigate('/logIn') :  assignUserToBasket()
    }
    

    //to display the total cost (totalCost) and total nuber of pizzas(totalItems) in navbar next to basket 
    let totalItems
    let costArr
    let totalCost
    if(basket.orderId !== undefined){
        totalItems = basket.items.reduce((acc, item) => { return acc + item.quantity}, 0)

        costArr = basket.items.map(item => {
            const size = item.size
            const crust = item.crust
            const quantity = item.quantity
            const sizeCost = size === 'Small' ? 0 : parseFloat(size.split('£')[1])
            const crustCost = parseFloat(crust.split('£')[1])
            return (((sizeCost + crustCost)* ((((quantity))))).toFixed(2))
        })

        totalCost = costArr.reduce((acc, item) => { return acc + parseFloat(item)}, 0.00)
    }
    

    return(
        <>
    <Stack 
        direction='row'
        sx={{marginTop: '25px'}}
        width='1520px'
        position='sticky'
    >
        <Box  sx={{marginLeft: {lg: '610px', md: '300px'}}}>
            <Link to='/'>
                <img src={mainTitle} alt='logo' width='200px' height= '80px'/>
            </Link>
        </Box>
        




        <Stack
            direction='row'
            justify-content='space-between'
            sx={{gap: '30px', pt: '20px', marginLeft: {lg: '400px', sm:'60px', md:'180px'}}}
        >
            <Stack
                direction='row'
                justify-content='space-around'
                sx={{gap: '8px'}}
            >
                <Stack>
                {basket.orderId !== undefined ? <Box component="div" display="inline" width='80px' style={{ fontWeight: 700 }}>Pizzas: {totalItems}</Box> : <Box component="div" display="inline" width='80px'>Pizzas: 0</Box>}
                {basket.orderId !== undefined ? <Box component="div" display="inline" width='100px'style={{ fontWeight: 700 }}>Total: £{totalCost.toFixed(2)}</Box> : <Box component="div" display="inline" width='90px'>Total: £0.00</Box>}
                </Stack>
                <img src={basketIcon} alt='basket' height='30px' width='30px' onClick={() => toggleBasket()}/>  
            </Stack>

            <img src={hamburgerIcon} alt='hamburger menu' height='30px' width='30px' onClick={() => toggleMenu()}/>
        </Stack>

    </Stack>



    {
    openMenu && 
    <Stack direction='column' position='fixed' > 
    <HamburgerMenu userData={userData} logOut={logOut}/> 
    </Stack>
    }


    {
    openBasket && 
    <Stack 
        height={{sm: '83%', xs: '26%'}}
        direction='column'  
        position='fixed'
        sx={{ background: '#19334d', overflowY:'auto', scrollBehaviour: 'smooth', marginLeft: {lg: '1245px', sm: '350px', xs:'0px'}, width: {lg: '250px', xs: '400px'}}} 
        alignItems='center'
    > 
    
    <Basket basket={basket} deleteItem={deleteItem} incDecQuantity={incDecQuantity}/> 

    {basket.items !== undefined && basket.items.length > 0 && <Button variant="contained" color="success" size="medium" onClick={() => redirect()}> <Typography color='white'>Proceed to checkout</Typography> </Button>}
    </Stack> }
    </>
    )
}
