import { getPokemonCard, getRarityList, getTypeList, getSetList } from "@util/pokemon"
import Card from "@components/Card"
import CustomFilter from "@components/CustomFilter"


const page = async ({searchParams}) => {

    const getCard = await getPokemonCard({
        name: searchParams.name || '',
        type: searchParams.type || '',
        rarity: searchParams.rarity || '',
        set: searchParams.set || '',

    })
    const isCardEmpty = getCard.length<1 || !getCard

    const rarityList = await getRarityList()
    const typeList = await getTypeList()
    const setList = await getSetList()

  return (
    <section className="section">
        <div className='page__filterContainer'>
            <CustomFilter
                rarity = {rarityList}
                type={typeList}
                set={setList}
            />
        </div>
        <section>
            <div className='container flex flex-wrap mx- justify-evenly gap-10 pb-20 overflow-auto h-50'>
                {!isCardEmpty ?
                    (getCard.data.map((card)=>
                        (
                            <Card
                                key = {card.id}
                                card={card}
                            />
                        ))
                    ):(
                        <div>No Result</div>
                    )
                }
            </div>
        </section>
    </section>
  )
}

export default page