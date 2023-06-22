'use client'

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

const CustomFilter = ({type, rarity, set}) => {

    const [nameInput, setNameInput] = useState('')
    const [typeInput, setTypeInput] = useState('')
    const [rarityInput, setRarityInput] = useState('')
    const [setInput, setSetInput] = useState('')

    const router = useRouter()


    const nameChangeHandler = (e) =>{
        setNameInput(e.target.value)
    }

    const typeChangeHandler = (e) =>{
        setTypeInput(e.target.value)
    }

    const rarityChangeHandler = (e) =>{
        setRarityInput(e.target.value)
    }

    const setChangeHandler = (e) =>{
        setSetInput(e.target.value)
    }

    const updateSearchParams = () =>{
        const searchParams = new URLSearchParams(window.location.search)

        if(nameInput){
            searchParams.set('name', nameInput)
        }else{
            searchParams.delete('name')
        }

        if(typeInput){
            searchParams.set('type', typeInput)
        }else{
            searchParams.delete('type')
        }

        const newPathname = `${window.location.pathname}?${searchParams.toString()}`
        console.log(newPathname)
        router.push(newPathname)
    }

    useEffect(() => {
        updateSearchParams()
    
    }, [nameInput, typeInput, rarityInput, setInput])
    

  return (
    <div>
        
        {/* Filter for Desktop */}
        <div className="hidden lg:flex w-fit my-16 mx-auto bg-white rounded-full shadow-sm">
            <input className="p-2 px-5 rounded-l-full" placeholder="Pikachu" value={nameInput} onChange={nameChangeHandler}/>
            <select placeholder='Type' className="p-2 px-5 max-w-[8rem] border-l-[1px] ml-2 border-neutral-400" value={typeInput} onChange={typeChangeHandler}>
                <option key='' value='' >Type</option>
                {type.map((type)=>(
                    <option key={type} value={type}>{type}</option>
                ))}
            </select>
            <select placeholder='Rarity' className="p-2 px-5 max-w-[8rem] border-spacing-1.5 border-l-[1px] ml-2 border-neutral-400" value={rarityInput} onChange={rarityChangeHandler}>
                <option key='' value='' >Rarity</option>
                {rarity.map((rarity)=>(
                    <option key={rarity} value={rarity}>{rarity}</option>
                ))}
            </select>
            <select placeholder='Set' className="p-2 px-5 max-w-[8rem] rounded-r-full border-l-[1px] ml-2 border-neutral-400" value={setInput} onChange={setChangeHandler}>                    
                <option key='' value=''>Set</option>
                {set.map((set)=>(
                    <option key={set.id} value={set.name}>{set.name}</option>
                ))}
            </select>
        </div>

        {/* Filter for Mobile */}
        <div className="mt-16 mb-8 px-10 flex lg:hidden flex-col filterContainer my-16">
            <input className=" b-r-1 mb-9 py-2 px-5 rounded-full text-center shadow-sm" placeholder="Pikachu" value={nameInput} onChange={nameChangeHandler}/>

            <div className="selectContainer flex items-center flex-row sm:flex-sm gap-4">
                <select placeholder='Type' className="py-2 px-5 w-full rounded-full text-center shadow-sm" value={typeInput} onChange={typeChangeHandler}>
                    <option key='' value='' >Type</option>
                    {type.map((type)=>(
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
                <select placeholder='Rarity' className="py-2 px-5 w-full rounded-full text-center shadow-sm" value={rarityInput} onChange={rarityChangeHandler}>
                    <option key='' value='' >Rarity</option>
                    {rarity.map((rarity)=>(
                        <option key={rarity} value={rarity}>{rarity}</option>
                    ))}
                </select>
                <select placeholder='Set' className="py-2 px-5 w-full rounded-full text-center shadow-sm" value={setInput} onChange={setChangeHandler}>                    
                    <option key='' value=''>Set</option>
                    {set.map((set)=>(
                        <option key={set.id} value={set.name}>{set.name}</option>
                    ))}
                </select>
            </div>
        </div>

    </div>
  )
}

export default CustomFilter