'use client'

import CardContainer from "@components/CardContainer"
import Nav from "@components/Nav";
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react";

import pokemon from 'pokemontcgsdk'
pokemon.configure({apiKey: process.env.POKEMONTCG_KEY})


const page = () => {

    const {data: session}= useSession();
    const [data, setData] = useState(null)
    const [rarity, setRarity] = useState([]);
    const [type, setType] = useState([]);
    const [set, setSet] = useState([]);
    const [page, setPage] = useState(1)
    
    const [nameInput, setNameInput] = useState('')
    const [typeInput, setTypeInput] = useState('')
    const [rarityInput, setRarityInput] = useState('')
    const [setInput, setSetInput] = useState('')

    const [filterChanged, setFilterChanged] = useState({Pname: '', Ptype: '', Prarity: '', Pset:''})

    const [searchTimeout, setSearchTimeout] = useState(null)

    const [isLoading, setIsLoading] = useState(false)

    const [totalCards, setTotalCards] = useState('')


    const loadData = async (filterChanged, page) => {
        setIsLoading(true)
        let query =''
        if(filterChanged.constructor === Object && Object.keys(filterChanged).length === 0){
            query =''
        }else{
            const nameData = filterChanged.Pname !== '' ? `name:"${filterChanged.Pname}*" ` : '';
            const rarityData = filterChanged.Prarity !== '' ? `rarity:"${filterChanged.Prarity}" ` : '';
            const typeData = filterChanged.Ptype !== '' ? `types:"${filterChanged.Ptype}" ` : '';
            const setFData = filterChanged.Pset !== '' ? `set.name:"${filterChanged.Pset}" ` : '';
            query = nameData + rarityData + typeData + setFData
            console.log(query)
        }

        try {
            const response = await pokemon.card.where({q: query, pageSize: 12, page: `${page}` });
            console.log(response)
            setPage(response.page);
            page===1 ? setData(response.data) : setData([...data, ...response.data]);
            setTotalCards(response.totalCount)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
        }

        try{
            const resRarity = await pokemon.rarity.all()
            setRarity(resRarity)
        }catch(err){
            alert(err + '- Cannot get Pokemon rarity list')
        }
        try{
            const resType = await pokemon.type.all()
            setType(resType)
        }catch(err){
            alert(err + '- Cannot get Pokemon type list')
        }

        try{
            const resSet = await pokemon.set.all()
            setSet(resSet)
        }catch(err){
            alert(err + '- Cannot get Pokemon sets list')
        }
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
    useEffect(() => {
        loadData(filterChanged, page)
        
        session?.user.id && loadCart()
    }, [filterChanged, page, session])

    const selectCardHandler = async (e)=>{
        const existingCart = await loadCart()
        const cartCopy = existingCart.slice();
        console.log(e)
        const index = cartCopy.findIndex((product) => e === product.id);

        if (index === -1) {
            cartCopy.push({ id:e, count: 1});
        } else {
            const pr = cartCopy[index];
            cartCopy[index] = { ...pr, count: pr.count + 1 };
        }

        console.log(cartCopy)
        
        try {
            const response = await fetch(`/api/user/${session?.user.email}/cart`, {
                method: 'PATCH',
                body: JSON.stringify({
                    cart: cartCopy
                })
            })

            if(response.ok){
                console.log('cartUpdated')
            }

        } catch (error) {
            console.log(error)
        }
    }

    const nameChangeHandler = (e) =>{
        setNameInput(e.target.value)

        clearTimeout(searchTimeout)
        setSearchTimeout(
            setTimeout(()=>{
                setFilterChanged({...filterChanged, Pname: `${e.target.value}`})
                setPage(1)
            }, 500)
        )
    }

    const typeChangeHandler = (e) =>{
        setTypeInput(e.target.value)
        setFilterChanged({...filterChanged, Ptype: `${e.target.value}`})
        setPage(1)
    }

    const rarityChangeHandler = (e) =>{
        setRarityInput(e.target.value)
        setFilterChanged({...filterChanged, Prarity: `${e.target.value}`})
        setPage(1)
    }

    const setChangeHandler = (e) =>{
        setSetInput(e.target.value)
        setFilterChanged({...filterChanged, Pset: `${e.target.value}`})
        setPage(1)

    }

    const loadMoreHandler = () =>{
        setPage(page +1)
    }

    return (
        <>
            <Nav/>
            <section className='section'>
                
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

                <CardContainer cards={data} selectCard={selectCardHandler} loadMore={loadMoreHandler} isLoading={isLoading} totalCards={totalCards} />
            </section>
        </>
    )
}

export default page