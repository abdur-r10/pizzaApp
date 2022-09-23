import { Typography, Stack, Button, Box } from "@mui/material";
import { useEffect, useState } from "react";
import PrevOrdersScroll from "../components/PrevOrdersScroll";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'

export default function PreviousOrders({ userData, basket, setBasket, openBasket, setUserData }) {
  let navigate = useNavigate();
  const [previousOrders, setPreviousOrders] = useState([]);


  useEffect(() => {
    if(previousOrders.length === 0){
        const fetchData = async () => {
          //getting previous order data
            const prevOrders = await fetch(
              "http://localhost:5000/api/orders/getPreviousOrders",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  prevOrders: userData.data.previousOrders,
                }),
                credentials: 'include'
              }
            );
            const data = await prevOrders.json();
              console.log(data)
              //if authorised 
            if(typeof data === 'object'){
              const copyOfData = [...data]
              setPreviousOrders(copyOfData);
            }
            //if not authorised
            else if(data === 'Not authorized, no token found may have expired'){
              alert('session timed out, please log in again')
              setUserData({})
              Cookies.remove('access-token')
              navigate('/logIn')
            }
            else {
              alert('something went wrong')
            }
            
          };
      
          fetchData();
    }
  }, []);

  console.log(previousOrders.join(''))
  console.log(typeof previousOrders.join(''))


//when ordering again we want to keep the same orderId 
  async function orderAgain(orderId) {
    const order = previousOrders.filter((item) => item._id === orderId);
    const items = order[0].items.map((item) => {
      const newItems = Object.assign({}, item, {
        product: JSON.parse(item.product),
      });
      return newItems;
    });

    const pizzas = items.map((item) => {
      return { ...item, pizza: item.product };
    });
    const newItems = pizzas.map(({ product, ...item }) => item);

    const newBasket = {
      orderId: orderId,
      items: newItems,
    };

    setBasket(newBasket);
    navigate(`/confirmOrder/${orderId}`);
  }


//when adding to basket we want to keep the same orderId and make changes to that order by adding items to it
  async function addToBasket(orderId) {
    const order = previousOrders.filter((item) => item._id === orderId);
    const items = order[0].items.map((item) => {
      const newItems = Object.assign({}, item, {
        product: JSON.parse(item.product),
      });
      return newItems;
    });
    const pizzas = items.map((item) => {
      return { ...item, pizza: item.product };
    });
    let itemsToAdd = pizzas.map(({ product, ...item }) => item);

    if(basket.items !== undefined){
        let result = basket.items.reduce((acc, elem, index) => {
            index = itemsToAdd.findIndex(
              (val) =>
                val.pizza._id === elem.pizza._id &&
                val.size === elem.size &&
                val.crust === elem.crust
            );
            if (index !== -1) {
              itemsToAdd[index].quantity = elem.quantity +=
                itemsToAdd[index].quantity;
            } else {
              itemsToAdd.push(elem);
            }
            acc.push(elem);
            return acc;
          }, []);
      
          result = [
            ...result,
            ...itemsToAdd.filter(
              (elem) =>
                !basket.items.some(
                  (val) =>
                    val.pizza._id === elem.pizza._id &&
                    val.size === elem.size &&
                    val.crust === elem.crust
                )
            ),
          ];
      
          const newBasket = {
            orderId: basket.orderId,
            items: result,
          };
          setBasket(newBasket);
    }
    
    //get an array of pizzaIds of pizzas already in basket and send them to backend to add to the order
    //if pizzas already exist in order inc quantity
    const newArrayOfItems = itemsToAdd.map((item) => {
      const itemObj = {
        product: item.pizza._id,
        size: item.size,
        crust: item.crust,
        quantity: item.quantity,
      };
      return itemObj;
    });
    console.log(newArrayOfItems);
    console.log(basket.orderId);

    const response = await fetch(
      `http://localhost:5000/api/orders/previousOrders/addToBasket`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: basket.orderId,
          newArrayOfItems: basket.orderId !== undefined ? newArrayOfItems : itemsToAdd,
          assignedToUser: userData._id,
        }),
      }
    );

    const data = await response.json();
    console.log(data);
    if(data._id !== undefined){
        const newBasket = {
            orderId: data._id,
            items: data.items
        }
        setBasket(newBasket)
    }
  }

  return (
    <Stack sx={{display: { xs: openBasket ? 'none' : 'block', md: 'block'} }}>
      {userData.data.previousOrders.length === 0 && (
        <Typography variant="h2" mb="400px" mt="100px">
          Oh no, looks like you have no previous orders
        </Typography>
      )}

      {userData.data.previousOrders.length > 0 && (
        <div>
          <Typography variant="h4" mb="10px" mt='30px'>
            Your previous orders:
          </Typography>
          <Typography variant="body2" mb="30px">
            *SLIDE HORIZONTALLY OVER ORDER TO VIEW ITEMS*
          </Typography>
          {previousOrders.map((order, index) => {
            return (
              <>
                <Stack
                  alignItems="center"
                  spacing={{ xs: 1, lg: 6}}
                  mb="50px"
                  direction={{ xs: 'column', lg: 'row'}}
                  border='solid grey 3px'
                  key={index}
                >
                  <Box>
                    <Typography variant="h5">Order {index + 1}:</Typography>
                  </Box>

                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={4}
                    sx={{
                      background: "#19334d",
                      overflowY: "auto",
                      scrollBehaviour: "smooth",
                      width: {lg:'510px', xs:'380px'},
                      height: {lg:'280px', xs:'260px'},
                    }}
                  >
                    {order.items.map((item, index) => {
                      const size = item.size;
                      const crust = item.crust;
                      const quantity = item.quantity;
                      const product = item.product;
                      const pizza = JSON.parse(product);
                      console.log(pizza);
                      console.log(typeof pizza);
                      return (
                        <PrevOrdersScroll
                          size={size}
                          crust={crust}
                          name={pizza.name}
                          img={pizza.img}
                          toppings={pizza.description}
                          veg={pizza.veg}
                          quantity={quantity}
                          key={index}
                        />
                      );
                    })}
                  </Stack>

                  <Box>
                    <Typography>
                      Ordered on: {order.createdAt.split("T")[0]}
                    </Typography>
                  </Box>
                  

                  <Stack
                  direction={{ xs: 'column', lg: 'row' }}
                  gap='20px'
                  >
                    <Button
                      variant="contained"
                      onClick={() => orderAgain(order._id)}
                      style={{
                        borderRadius: 35,
                        backgroundColor: "red",
                        height: "65px",
                        width: "100px",
                      }}
                      sx={{display: openBasket ? 'none' : 'block'}}
                    >
                      order again
                    </Button>

                    <Button
                      variant="contained"
                      onClick={() => addToBasket(order._id)}
                      style={{
                        borderRadius: 35,
                        backgroundColor: "red",
                        height: "65px",
                        width: "100px",
                        marginBottom: '10px'
                      }}
                      sx={{display: openBasket ? 'none' : 'block'}}
                    >
                      add to basket
                    </Button>
                  </Stack>
                </Stack>
              </>
            );
          })}
        </div>
      )}
    </Stack>
  );
}
