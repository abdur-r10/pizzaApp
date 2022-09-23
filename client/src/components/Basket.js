import {Typography} from '@mui/material'
import ItemIcon from '../components/ItemIcon'

export default function Basket({basket, deleteItem, incDecQuantity}) {
    console.log('we are in BASKET')
    const orderId = basket.orderId
    //if there is no basket or if there is an empty basket we want to dsplay there is no items 
    //otherwise we want to display the items in basket
    if(basket.items === undefined || basket.items.length === 0){
        console.log('no items in basket')
        return( <Typography color='white'>*No items in basket*</Typography> )
    } else {
        const itemsArr = [...basket.items]
        console.log('item(s) in basket')
        return (itemsArr.map(item => {
            const size = item.size
            const crust = item.crust
            const quantity = item.quantity
            //if size is small the cost for size is £0 otherwise whatever value we are displaying in the pizza card (which size user chose)
            const sizeCost = size === 'Small' ? 0 : parseFloat(size.split('£')[1])
            //crust cost is from what we are displaying in the pizza card (which crust user chose)
            const crustCost = parseFloat(crust.split('£')[1])
            const totalCostOfItem = ((sizeCost + crustCost)* ((((quantity))))).toFixed(2)


            return  (
                <ItemIcon key={item.orderId} pizzaId={item.pizza._id} size={size} crust={crust} quantity={quantity} totalCostOfItem={totalCostOfItem} img={item.pizza.img} name={item.pizza.name} toppings={item.pizza.description} orderId={orderId} deleteItem={deleteItem} incDecQuantity={incDecQuantity} sx={{backgroundColor: '#C0C0C0'}}/>
            )
        }))
    }
}
