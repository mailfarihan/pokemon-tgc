'use client'

import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import Image from "next/image";
import 'react-loading-skeleton/dist/skeleton.css'


const CardContainer = (props) => {
    const [isSelected, setIsSelected] = useState('')

    const selectCard =(val)=>{
        props.selectCard(val)
        setIsSelected(val)
        setTimeout(()=> setIsSelected(""), 1500)
    }

    return (
    <div className='container flex flex-wrap mx- justify-evenly gap-10 pb-20 overflow-auto h-50'>
        {props.isLoading? (
            <>{props.cards?.map((card, id)=>(
                <div className="card text-center" key={id}>
                    <div className="cardImage relative flex -bottom-16 justify-center rounded-sm"><Skeleton height={340}  width={250}/></div>
                    <div className="infoContainer bg-white w-80 pt-16 pb-8 line px-5 leading-7 rounded-lg shadow-md">
                        <div className="single pokeName font-bold text-2xl mt-5"><Skeleton width={200}/></div>
                        <div className="single pokeRarity my-1 text-sky-500"><Skeleton width={150}/></div>
                        <div className='flexContainer flex flex-row justify-center gap-5'>
                            <div className="double pokePrice"><Skeleton /></div>
                            <div className="double pokeLeft"><Skeleton /></div>
                        </div>
                    </div>
                </div>))
                }
            </> 
            ):(
               <>
                {props.cards?.length > 0 ?
                    (
                        <AnimatePresence>
                            <>
                                {props.cards?.map((card, i)=>(
                                    <motion.div className="card text-center" 
                                        key={card.id} 
                                        data-types={card.types}
                                        initial={{ y: -1 }}
                                        animate={{ y: 0 }}
                                        transition={{ duration: .5, delay: i * 0.2 }}
                                    >
                                        <div className="cardImage relative flex -bottom-16 justify-center rounded-sm"><Image height={350}  width={250} src={card.images.small} alt="pokemon" className='rounded-lg bg-transparent'/>{/*<Skeleton height={340}  width={250}/>*/}</div>
                                        <div className="infoContainer bg-white w-80 pt-16 pb-8 line px-5 leading-7 rounded-lg shadow-md">
                                            <div className="single pokeName font-bold text-2xl mt-5">{card.name}</div>
                                            <div className="single pokeRarity my-1 text-sky-500">{card.rarity? card.rarity : 'N/A'}</div>
                                            <div className='flexContainer flex flex-row justify-center gap-5'>
                                                <div className="double pokePrice">${card.cardmarket?.prices.averageSellPrice ? card.cardmarket.prices.averageSellPrice : 0}</div>
                                                <div className="double pokeLeft">{card.set.total} left</div>
                                            </div>
                                        </div>
                                        <button className="select_btn font-semibold" style={{margin:"0, 30%, 0 30%"}} onClick={()=>{selectCard(card.id)}}>{isSelected === card.id? <span className="text-green-400">Selected</span> : <span>Select card</span>}</button>
                                    </motion.div>
                                ))}
                            </>
                        </AnimatePresence>
                    ):(
                        <>
                            <div className="w-full text-center">No Data</div>
                            
                        </>
                    )
                }
            </> 
            )
            
    }
        {props.cards?.length > 0 && props.cards.length < props.totalCards &&
            <>
                <button className='relative black_btn mx-[20%]' onClick={props.loadMore}>Show More</button>
                
            </>
        }
    </div>
    )
}

export default CardContainer