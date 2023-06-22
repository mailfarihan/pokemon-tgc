import pokemon from 'pokemontcgsdk'
pokemon.configure({apiKey: process.env.POKEMONTCG_KEY})


export async function getPokemonCard (filters){

    console.log(filters)

    try {
        const response = await pokemon.card.where({q: 'name:blastoise', pageSize:5 });
        return response
    } catch (error) {
        console.log(error)
    }
}

export async function getRarityList (){
    try{
        const resRarity = await pokemon.rarity.all()
        return resRarity
    }catch(err){
        alert(err + '- Cannot get Pokemon rarity list')
    }
}

export async function getTypeList(){
    try{
        const resType = await pokemon.type.all()
        return resType
    }catch(err){
        alert(err + '- Cannot get Pokemon type list')
    }
}

export async function getSetList(){
    try{
        const resSet = await pokemon.set.all()
        return resSet
    }catch(err){
        alert(err + '- Cannot get Pokemon sets list')
    }
}