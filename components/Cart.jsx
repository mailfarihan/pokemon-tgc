'use client'
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import pokemon from 'pokemontcgsdk'
pokemon.configure({apiKey: process.env.POKEMONTCG_KEY})

const Cart = (props) => {

  const {data: session}= useSession();
  const [totalPrice, setTotalPrice] = useState('')
  const [cartItems, setCartItems] = useState([])
  const [totalCard, setTotalCard] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const closeCart=()=>{
    props.closeCart()
  }

  const loadCart = async () =>{
    try {
      const res = await fetch(`/api/user/${session?.user.email}/cart`)

      const data = await res.json()
      return(data.cart)
    } catch (error) {
      console.log(error)
    }
  }

  const calculateTotal = (array) =>{
    var totalPrice = 0
    var totalCount = 0
    array.map((item)=>{
      const price = item.count * item.price
      const count = item.count

      totalCount = totalCount + count
      totalPrice = totalPrice + price
    })

    return ([totalCount, totalPrice]);
  }

  const reduceCartData = (array) =>{
    console.log(array)
    var tempCartArr = []
    array.map((item)=>{
      const {id, count} = item

      tempCartArr = [{id,count},...tempCartArr]
    })

    return(tempCartArr)
  }

  const getUpdatedPrice = async()=>{

    const myCart = await loadCart()
    var tempArr =[]

    if (myCart.length > 0){
      myCart.map(async (item) =>{
        const id= item.id
        try {
          const response = await pokemon.card.find(`${id}`);
          const findImage = await response.images.small
          const findPrice = await response.cardmarket.prices.averageSellPrice
          const findName = await response.name
          const cardLeft = await response.set.total


          const tempItem = await {...item, name:findName, price:findPrice, left:cardLeft, image:findImage}

          tempArr = [tempItem, ...tempArr]

          setCartItems(tempArr)
          const countPrice = calculateTotal(tempArr)

          setTotalPrice(countPrice[1].toFixed(2))
          setTotalCard(countPrice[0])
          setIsLoading(false)

        } catch (error) {
          console.log(error)
        }
      })
    }else{
      setCartItems([])
      setTotalPrice(0)
      setTotalCard(0)
      setIsLoading(false)
    }

    
    
  }

  useEffect(()=>{
    setIsLoading(true)
    session?.user.id && getUpdatedPrice()
    document.body.style.overflow = 'hidden'

    return()=>{document.body.style.overflow = 'unset';}
  },[])

  const addCard = async (e) =>{
    const cartCopy = cartItems.slice();

    const index = cartCopy.findIndex((item) => e === item.id);

    if (index === -1) {
        console.log('card not exist')
    } else {
      const pr = cartCopy[index];
      cartCopy[index] = { ...pr, count: pr.count + 1 };
    }

    const saveCart = reduceCartData(cartCopy)

    console.log(saveCart)

    try {
      const response = await fetch(`/api/user/${session?.user.email}/cart`, {
          method: 'PATCH',
          body: JSON.stringify({
              cart: saveCart
          })
      })

      if(response.ok){
        setCartItems(cartCopy)
        const countPrice = calculateTotal(cartCopy)
        setTotalPrice(countPrice[1].toFixed(2))
        setTotalCard(countPrice[0])
      }
        
    } catch (error) {
        console.log(error)
    }
  }

  const removeCard = async (e) =>{
    const cartCopy = cartItems.slice();

    const index = cartCopy.findIndex((item) => e === item.id);

    if (index === -1) {
      console.log('card not exist')
    }else {
      const pr = cartCopy[index];
      pr.count > 1 ? (cartCopy[index] = { ...pr, count: pr.count - 1 }) : (cartCopy.splice(index,1))
      
    }

    const saveCart = reduceCartData(cartCopy)
    try {
      const response = await fetch(`/api/user/${session?.user.email}/cart`, {
          method: 'PATCH',
          body: JSON.stringify({
              cart: saveCart
          })
      })

      if(response.ok){
        setCartItems(cartCopy)
        const countPrice = calculateTotal(cartCopy)
        setTotalPrice(countPrice[1].toFixed(2))
        setTotalCard(countPrice[0])
      }
        
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <div className='absolute flex z-80 h-screen w-screen bg-gray-200/70 top-0 left-0 justify-center backdrop-blur-sm'>
      <div className='modal relative w-full h-full m-auto bg-white rounded-lg py-10 text-center justify-center sm:w-11/12 sm:h-5/6 sm:max-w-2xl' >
          <div className='itemContainer px-10 pb-9'>
            {isLoading ?
              (
                <>
                  <div className="flex flex-row justify-between p-5">
                    <div className="flex flex-row">
                      <div className="mr-5">
                        <Skeleton height={150} width={100}/>
                      </div>
                      <div className="px-2 sm:px-5 my-3 flex flex-col text-left">
                        <Skeleton height={26} width={200}/>
                        <Skeleton height={18} width={100} className="mt-2 mb-10"/>
                        <Skeleton height={12} width={80} className="mt-"/>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center">
                      <Skeleton height={25} width={20}/>
                    </div>
                  </div>
                </>
              ):(<>
                  {cartItems.length === 0? (
                    <div>Cart is empty</div>
                  ):(
                    <AnimatePresence>
                      <>{
                        cartItems.map((item, i)=>(
                          <motion.div key={i}
                            className=" flex flex-row justify-between p-5"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: .5, delay: i * 0.2 }}
                          >
                            <div className="col_1 flex flex-row">
                              <div className="mr-5">
                                {/* <Skeleton height={150} width={100}/> */}
                                <Image src={item.image} width={100} height={100} alt={item.id}/>
                              </div>
                              <div className="px-2 sm:px-5 flex flex-col text-left">
                                <h2 className="py-1 font-bold text-2xl"> {item.name} </h2>
                                <div className=" text-neutral-500">
                                  <span className="font-medium">${item.price} </span>per Card
                                </div>
                                <div className="py-8 text-neutral-500">
                                  <span className=" text-red-400 font-medium">{item.left}</span> cards left
                                </div>
                              </div>
                            </div>
                            <div className="col_2 flex flex-row justify-center gap-2">
                              <div className="font-bold text-blue-500 mx-1 my-4 flex flex-col justify-center"><div>{item.count}</div></div>
                              <div className="flex flex-col justify-center gap-2">
                                <button className=" bg-sky-500 text-gray-100 rounded-sm px-1" onClick={()=>{addCard(item.id)}} data-count={item.count}>+</button>
                                <button className=" bg-red-500 text-gray-100 rounded-sm px-1" onClick={()=>{removeCard(item.id)}}  data-id={item.id} data-count={item.count}>-</button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </>
                    </AnimatePresence> 
                  )
                    
                  }
                </>
              )
            }

          </div>
          <div className='cartSummary absolute bottom-4 w-full text-center rounded-b-lg'>
            <div className='summaryContainer'>
              <div className='clearAll py-4 mt-12'>
                <a className='clearAll'>Clear all</a>
              </div>
              <div className="flex flex-col justify-center py-5 gap-2">
                <div className='summaryInfo totNos mx-auto w-1/3 flex flex-row justify-between font-semibold'>
                  <span>Total Cards</span>
                  <span className='totVal text-red-400'> {totalCard}</span>
                </div>
                <div className='summaryInfo totPrice mx-auto w-1/3 flex flex-row justify-between font-bold text-lg'>
                  <span>Total Cards</span>
                  <span className='totVal text-red-400'>${totalPrice}</span>
                </div>
              </div>
              <button className='payNow bg-blue-400 rounded-full px-10 py-2 text-white font-bold shadow-sm my-5' onClick={getUpdatedPrice}>Pay Now</button>
            </div>
          </div>
          <button className='closeBtn absolute top-1 right-4 mx-auto' onClick={closeCart}>x</button>
      </div>
    </div>
  )
}

export default Cart