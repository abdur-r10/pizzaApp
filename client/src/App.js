import { Route, Routes} from 'react-router-dom';
import { Box } from '@mui/material'
import {useState, useEffect} from 'react';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LogIn from './pages/LogIn.js'
import VerifyEmail from './pages/VerifyEmail';
import CreateAccount from './pages/CreateAccount.js'
import ConfirmOrder from './pages/ConfirmOrder'
import CancelledPayment from './pages/CancelledPayment'
import SuccessfulPayment from './pages/SuccessfulPayment'
import PreviousOrders from './pages/PreviousOrders'
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'


export default function App() {
  let navigate= useNavigate()
  //? STATES
  //pizza data 
  const [pizzaData, setPizzaData] = useState([])
  //user data contains { accountType, verified, data: {previous orders: []}}
  const [userData, setUserData] = useState({})
  //basket contains {assignedToUser, orderId, items: []}
  const [basket, setBasket] = useState({})
  //used for toggling opening and closing the hamburger menu in navbar
  const [openMenu, setOpenMenu] = useState(false);
  //used for toggling opening and closing the basket in navbar
  const [openBasket, setOpenBasket] = useState(false);
  //when Logging in we requure the following:
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  
//?LOADING PIZZA
  useEffect(() => {
    const fetchPizzaData = async () => {
      const response = await fetch('http://localhost:5000/api/pizzas')
      const dataPizza = await response.json();

      setPizzaData(dataPizza)
    } 

    fetchPizzaData();
  }, [])



//?FUNCTION TO INCREASE/DECREASE QUANTITY OF ITEM IN BASKET
  async function incDecQuantity(orderId, pizzaId, incOrDec){
    //make an api request to increase or decrese 
    //if increase make a request to increase order quantity via backend
    const response = await fetch(`http://localhost:5000/api/orders/incOrDecQuantity/${orderId}/${pizzaId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                incOrDec: incOrDec
            })
    })

    const data = await response.json()
    console.log(data)

    if(incOrDec === 'inc'){
      const itemsInBasket = {...basket}
      console.log(itemsInBasket)
      console.log(orderId)
      const findOrder = itemsInBasket.items.filter(item => item.pizza._id === pizzaId)
      console.log(findOrder)
      const updateOrder = findOrder[0]
      console.log(updateOrder)
      const updatedQuantity = updateOrder.quantity += 1
      console.log(updatedQuantity)
      updateOrder.quantity = updatedQuantity
      console.log(updateOrder)
      setBasket(itemsInBasket)
      console.log(basket)
      alert('quantity has been increased')
    }
    else if(incOrDec === 'dec'){
      const itemsInBasket = {...basket}
      console.log(itemsInBasket)
      console.log(orderId)
      const findOrder = itemsInBasket.items.filter(item => item.pizza._id === pizzaId)
      console.log(findOrder)
      const updateOrder = findOrder[0]
      console.log(updateOrder)
      const updatedQuantity = updateOrder.quantity -= 1
      console.log(updatedQuantity)
      updateOrder.quantity = updatedQuantity
      console.log(updateOrder)
      setBasket(itemsInBasket)
      console.log(basket)
      alert('quantity has been decreased')
    }
  }


//?DELETE AN ITEM IN BASKET
  async function deleteItem(pizzaId, orderId, crust, size, quantity){
    //make an api request to delete order in backend
    const response = await fetch('http://localhost:5000/api/orders/deleteItem', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pizzaId: pizzaId,
                orderId: orderId,
                crust: crust, 
                size: size, 
                quantity: quantity
            })
    })

    const data = await response.json()
    //functionality to delete order
    const copyOfBasket = {...basket}
    const copyOfItems = copyOfBasket.items
    const newItems = copyOfItems.filter(item => (item.pizza._id !== pizzaId | item.crust !== crust | item.size !== size | item.quantity !== quantity ))

    const newBasket = {
      orderId: orderId,
      items: newItems
    }

    console.log(newBasket)
    setBasket(newBasket)
    alert(data.message)
  }


  //?PLACE FINAL ORDER
  async function placeFinalOrder() {
    const response = await fetch('http://localhost:5000/api/orders/placeFinalOrder', {
      method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                basket: basket,
                userData: userData
            }),
            credentials: 'include'
    })
  
    const data = await response.json()
    console.log(data)
    

    if(data === 'Not authorized, no token found may have expired'){
      alert('session timed out, please log in again')
      setUserData({})
      Cookies.remove('access-token')
      navigate('/logIn')
    }
    else {
      window.open(data)
    }
  }

  //?LOG OUT FUNCTIONALITY
  async function logOut(){
    setUserData({})
    Cookies.remove('access-token')
    navigate('/')
  }


return(
      <Box width="400px" sx={{width: {xl : '1488px'}}} m='auto' >
          <Navbar openMenu={openMenu} setOpenMenu={setOpenMenu} openBasket={openBasket} setOpenBasket={setOpenBasket} basket={basket} deleteItem={deleteItem} incDecQuantity={incDecQuantity} userData={userData} logOut={logOut}/>
          <Routes>
              < Route path="/" element={<Home openBasket={openBasket} pizzaData={pizzaData} basket={basket} setBasket={setBasket} userData={userData} incDecQuantity={incDecQuantity}/>} />
              < Route path='/register' element={<CreateAccount openBasket={openBasket}/>} />
              < Route path='/logIn' element={<LogIn openBasket={openBasket} basket={basket} setBasket={setBasket} userData={userData} setEmail={setEmail} setPassword={setPassword} setUserData={setUserData} email={email} password={password}/>} /> 
              < Route path='/users/:id/verify/:token' element={ <VerifyEmail/>} />
              < Route path='/confirmOrder/:id' element={<ConfirmOrder openBasket={openBasket} userData={userData} basket={basket} incDecQuantity={incDecQuantity} deleteItem={deleteItem} placeFinalOrder={placeFinalOrder}/>} />
              < Route path='/successfulPayment/:orderId/:userId' element={<SuccessfulPayment openBasket={openBasket} userData={userData} setUserData={setUserData}/>} />
              < Route path='/cancelledPayment/:orderId' element={<CancelledPayment />} />
              < Route path='/previousOrders' element={<PreviousOrders openBasket={openBasket} userData={userData} basket={basket} setBasket={setBasket} setUserData={setUserData}/>}/>
          </Routes>
          <Footer />
      </Box>
)
}


//TODO: Double check VerifyEmail.js (under pages in client side)
//TODO: For CreateAccount once form is filled in and you click on create an account and click on it again it will say user already exists but it should also resend email (or have a way to resend the email)
//TODO: Double check all .env for secret or private keys and if someone else can know them
//TODO: In orderController (in controllers in server) the red comments (do the logic for the newArrayOfItems in the backend rather than frontend)
//TODO: Double check are the apis rest apis
//TODO: MAYBE VERY BIG MAYBE => add discounts/offers page where either user can get a deal (3 pizzas for £15 something like that) or if they have a discount code they can enter that in the confirm order page
//TODO: change token timer in usersController (under controllers in server) currently set to 1min
//TODO: C:\Users\abdur\OneDrive\Desktop\Programming\Programming portfolio projects\pizza_app_new
