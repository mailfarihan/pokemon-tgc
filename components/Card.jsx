import React from 'react'
import Image from 'next/image'

const Card = ({card}) => {
  return (
    <div className="card text-center">
        <div className="cardImage relative flex -bottom-16 justify-center rounded-sm"><Image height={350}  width={250} src={card.images.small} alt="pokemon" className='rounded-lg bg-transparent'/>{/*<Skeleton height={340}  width={250}/>*/}</div>
        <div className="infoContainer bg-white w-80 pt-16 pb-8 line px-5 leading-7 rounded-lg shadow-md">
            <div className="single pokeName font-bold text-2xl mt-5">{card.name}</div>
            <div className="single pokeRarity my-1 text-sky-500">{card.rarity? card.rarity : 'N/A'}</div>
            <div className='flexContainer flex flex-row justify-center gap-5'>
                <div className="double pokePrice">${card.cardmarket?.prices.averageSellPrice ? card.cardmarket.prices.averageSellPrice : 0}</div>
                <div className="double pokeLeft">{card.set.total} left</div>
            </div>
        </div>
        <button className="select_btn font-semibold" style={{margin:"0, 30%, 0 30%"}} ><span>Select card</span></button>
    </div>
  )
}

export default Card