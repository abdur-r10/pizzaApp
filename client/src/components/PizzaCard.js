import { Stack, Box, Typography, Button, FormLabel, Select, MenuItem, FormControl } from '@mui/material'
import { useState } from 'react'

export default function PizzaCard({data, pizzaId, basket, setBasket, userData, incDecQuantity, openBasket}) {
    console.log(pizzaId)
    const [crustType, setCrustType] = useState('');

    const [pizzaSize, setPizzaSize] = useState('');
    
    console.log(basket)

    const handleCrustChange = (event) => {
        //event.preventDefault()
        console.log(event)
        setCrustType(event.target.value);
        console.log(crustType)
    };

    const handleSizeChange = (event) => {
        //event.preventDefault()
        console.log(event)
        setPizzaSize(event.target.value)
        console.log(pizzaSize)
    };

    const crust = Object.keys(data.sizeandcrust[0])

    //creating an order in the order db
    async function createOrderInDb() {
        const response = await fetch('http://localhost:5000/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                assignedToUser: userData._id,
                product: pizzaId,
                size: pizzaSize,
                crust: crustType,
                quantity: 1,
            })
        })

        const data = await response.json()
        console.log(data)
        setBasket(data)
        alert('added to basket')
    }

    

    //pushing an order into our order in the order db
    async function addItem(orderId){
        const response = await fetch(`http://localhost:5000/api/orders/addItem/${orderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                product: pizzaId,
                size: pizzaSize,
                crust: crustType,
                quantity: 1,
            })
        })

        const data = await response.json()
        console.log(data)
        setBasket(data)
        alert('Item has been added')
    }






    async function handleSubmit(event){
        event.preventDefault()
         const copyOfBasket = {...basket}
         console.log(copyOfBasket)

         let samePizza
         if(copyOfBasket.orderId){
            samePizza = copyOfBasket.items.filter(item => item.pizza._id === pizzaId)
            console.log(samePizza)
         }
        
        console.log(pizzaId)
        console.log(pizzaSize)
        console.log(crustType)
        console.log(basket)
        console.log(basket.orderId)

        
        // when user clicks on add to basket we want to establish if it is either of these:
        //have they selected a size and crust
        //does basket exist have tried adding something before or is this the first item
        //does the item we are trying to add exist in our basket already
        if (!pizzaSize || !crustType ){
            //if no size or crust is selected 
            alert('please ensure you have selected both size and crust')
        }
        else if(basket.orderId === undefined && (pizzaSize !== '' || crustType !== '')){
            //if its the first item to be added to the basket (creating basket as it does not exist)
            createOrderInDb()
        }
        else if(samePizza.length > 0 && samePizza[0].size === pizzaSize && samePizza[0].crust === crustType){
            //if the item already exist in the basket
            incDecQuantity(basket.orderId, pizzaId, 'inc')
        }
        else if(basket.orderId !== undefined && (pizzaSize !== '' || crustType !== '')){
            //if its not the first item to be added to the nasket (basket exists) 
            addItem(basket.orderId)
        }
    }





    return(
        <Stack 
            direction='column'
            width='350px'
            height='680px'
            key={data._id}
            sx={{ backgroundColor: '#C0C0C0', display: { xs: openBasket ? 'none' : 'block', md: 'block' } }}
        >

            <div>
                <img src={data.img} alt='pizza img' height='250x' width='350px'/>
            </div>
            <Typography variant='h6' ml='3px' style={{ fontWeight: 550}}>{data.name}</Typography>
            
        
            <Box height='100px'>
            <Typography pb='10px' pt='10px' ml='3px'>{data.description}</Typography>
            {data.veg && 
                <Box sx={{ color: '#fff', background: 'green', fontSize: '14px', borderRadius: '20px', height:'35px', width: '65px', ml:'3px'}}>
                    <Typography ml='16px' pt='5px'>VEG</Typography>
                </Box>
            }
            </Box>

            
            <Stack 
                direction='row'
                justifyContent="space-between"
                mt='8px'
            >
                <Typography variant='h6' mb='10px' ml='3px' style={{ fontWeight: 550}}> from £{data.price < 100 ? ((data.price * 10)/100).toFixed(2)  : (data.price/100).toFixed(2) }</Typography>
            </Stack>



            <form onSubmit={handleSubmit} >
            <Stack>
            <FormControl>
                <FormLabel>Select Crust</FormLabel>
                <Select
                    labelId="select-crust-label"
                    id="select-crust"
                    value={crustType}
                    name='crust type'
                    onChange={handleCrustChange}
                    label="crust"
                >
                    
                    <MenuItem value={`Regular crust: £${parseInt(data.sizeandcrust[0][crust[0]][0].price) > 100 ? (parseInt(data.sizeandcrust[0][crust[0]][0].price)/100).toFixed(2) : (parseInt(data.sizeandcrust[0][crust[0]][0].price)/10).toFixed(2)}`}> 
                        Regular crust: £{parseInt(data.sizeandcrust[0][crust[0]][0].price) > 100 ? 
                        (parseInt(data.sizeandcrust[0][crust[0]][0].price)/100).toFixed(2) : 
                        (parseInt(data.sizeandcrust[0][crust[0]][0].price)/10).toFixed(2) }
                    </MenuItem>

                    <MenuItem value={`Cheese stuffed crust: £${parseInt(data.sizeandcrust[0][crust[1]][0].price) > 100 ? (parseInt(data.sizeandcrust[0][crust[1]][0].price)/100).toFixed(2) : (parseInt(data.sizeandcrust[0][crust[1]][0].price)/10).toFixed(2)}`}> 
                        Cheese stuffed crust: £{parseInt(data.sizeandcrust[0][crust[1]][0].price) > 100 ? 
                        (parseInt(data.sizeandcrust[0][crust[1]][0].price)/100).toFixed(2) : 
                        (parseInt(data.sizeandcrust[0][crust[1]][0].price)/10).toFixed(2) }
                    </MenuItem>

                    {crust.length >= 3  && (crust[2] === 'mediumstuffedcrustvegkebab' || crust[2] === 'medium stuffed crust-veg kebab' || crust[2] === 'medium stuffed crust kebab') &&
                    <MenuItem value={`Veg-Kebab stuffed crust: £${parseInt(data.sizeandcrust[0][crust[2]][0].price) > 100 ? (parseInt(data.sizeandcrust[0][crust[2]][0].price)/100).toFixed(2) : (parseInt(data.sizeandcrust[0][crust[2]][0].price)/10).toFixed(2)}`}> 
                        Veg-Kebab stuffed crust: £{parseInt(data.sizeandcrust[0][crust[2]][0].price) > 100 ? 
                        (parseInt(data.sizeandcrust[0][crust[2]][0].price)/100).toFixed(2) : 
                        (parseInt(data.sizeandcrust[0][crust[2]][0].price)/10).toFixed(2) }
                    </MenuItem>}

                    {crust.length >= 3  && crust[2] === 'mediumstuffedcrustchickenseekhkebab' &&
                    <MenuItem value={`Chicken-seekh stuffed crust: £${parseInt(data.sizeandcrust[0][crust[2]][0].price) > 100 ? (parseInt(data.sizeandcrust[0][crust[2]][0].price)/100).toFixed(2) : (parseInt(data.sizeandcrust[0][crust[2]][0].price)/10).toFixed(2)}`}> 
                        Chicken-seekh stuffed crust: £{parseInt(data.sizeandcrust[0][crust[2]][0].price) > 100 ? 
                        (parseInt(data.sizeandcrust[0][crust[2]][0].price)/100).toFixed(2) : 
                        (parseInt(data.sizeandcrust[0][crust[2]][0].price)/10).toFixed(2) }
                    </MenuItem>}

                </Select>
                </FormControl>

                <br/>

                <FormControl>
                <FormLabel>Select Size</FormLabel>
                <Select
                    labelId="select-size-label"
                    id="select-size"
                    value={pizzaSize}
                    name='pizza size'
                    onChange={handleSizeChange}
                    label="Size"
                >
                    
                    <MenuItem value='Small'> 
                        Small 
                    </MenuItem>

                    <MenuItem value='Medium £2.00'> 
                        Medium (+£2.00)
                    </MenuItem>

                    <MenuItem value='Large +£4.00'> 
                        Large (+£4.00)
                    </MenuItem>
                </Select>
                

                    <Box mt='20px' ml='3px'>
                        <Button  variant="contained" style={{ borderRadius: 35, backgroundColor: "red"}} type='submit'>Add to Basket</Button>
                    </Box>
                
                </FormControl>
                </Stack>
            </form>
        </Stack>
    )
}