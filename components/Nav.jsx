'use client'

import Image from "next/image";
import Link from "next/link";
import Cart from "./Cart";

import { useState, useEffect } from "react";
import {signIn, signOut, useSession, getProviders} from 'next-auth/react'
import { FaUser, FaShoppingCart } from 'react-icons/fa';
import { BsCart2 } from 'react-icons/bs';


function Nav(props){

    const {data: session}= useSession();
    
    const[providers, setProviders] = useState(null);
    const [mobileNavOpened, setMobileNavOpened] = useState(false)
    const [openCart, setOpenCart] = useState(false)

    useEffect(()=>{
        const setUpProviders = async () =>{
            const response = await getProviders();

            setProviders(response);
        }

        setUpProviders();
    },[])

    const openCartHandler = ()=>{
        setOpenCart(true)
        setMobileNavOpened(false)
    }

    const closeCartHandler =()=>{
        setOpenCart(false)
    }

    return (
        <nav className="nav flex w-full bg-slate-50 shadow-md justify-center md:pt-5 md:pb-7 py-8 sticky top-0 z-50">
            <Link href ='/'>
                <h3 className="relative text-gray-900 font-bold text-lg hidden md:block">TCG Marketplace</h3>
            </Link>
            <Link href ='/' className="nav-logo absolute left-5 md:left-auto -top-2.5 md:top-8 rounded-full">
                <Image src='/assets/icons/LogoPokemon.svg' width={70} height={70} alt="Pokemon TCG" className="relative left-0 py-2 md:py-3 h-20 w-20 z-2"/>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex absolute right-10 gap-4 top-3 md:top-5">
                {session?.user? (
                    <>
                        <button onClick={openCartHandler} className="text-3xl">
                            <BsCart2/>
                        </button>
                        <button onClick={()=>setMobileNavOpened((prev)=>!prev)} className="">
                            <Image src={session?.user.image} width={37} height={37} alt="User Image" className="rounded-full"/>
                        </button>
                        {mobileNavOpened &&
                            <div className="dropdown shadow-lg" onClick={()=> setMobileNavOpened(false)}>
                                <Link href="./profile" className="black_btn">
                                    <FaUser/>
                                    <span className="ml-3">Profile</span>
                                </Link>
                                <button type="button" onClick={()=>{signOut()}} className="signOut outline_btn">
                                    Sign Out
                                </button>
                            </div>
                        }

                    </>
                    
                )
                :(
                    <>{ providers && Object.values(providers).map((provider)=>(
                            <button type="button" key={provider.id} onClick={()=>{signIn(provider.id)}} className="signIn black_btn">
                                Sign In
                            </button>
                        ))
                    }</>
                )}
                
            </div>

            {/* Mobile Navigation */}
            <div className="flex md:hidden absolute right-5 gap-4 top-3 md:top-5">
                {session?.user? (
                    <>
                        <button onClick={()=>setMobileNavOpened((prev)=>!prev)} className="">
                            <Image src={session?.user.image} width={37} height={37} alt="User Image" className="rounded-full"/>
                        </button>
                        {mobileNavOpened &&
                            <div className="dropdown shadow-lg">
                                <button onClick={openCartHandler} className="black_btn">
                                    <FaShoppingCart/>
                                    <span className="ml-3">Cart</span>
                                </button>
                                <Link href="./profile" className="black_btn" onClick={()=> setMobileNavOpened(false)}>
                                    <FaUser/>
                                    <span className="ml-3">Profile</span>
                                </Link>
                                <button type="button" onClick={()=>{signOut()}} className="signOut outline_btn">
                                    Sign Out
                                </button>
                            </div>
                        }

                    </>
                    
                )
                :(
                    <>{ providers && Object.values(providers).map((provider)=>(
                            <button type="button" key={provider.id} onClick={()=>{signIn(provider.id)}} className="signIn black_btn">
                                Sign In
                            </button>
                        ))
                    }</>
                )}
                
            </div>

            {openCart &&
                <Cart closeCart={closeCartHandler} />
            }

        </nav>
      );
}

export default Nav;