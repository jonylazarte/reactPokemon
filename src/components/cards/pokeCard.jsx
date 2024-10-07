import react from 'react'

const pokeCard = ({speciesData, data:{id, types, height, weight, cries}})=>{

      const typesArray = [
        {
            "name": "normal",
            "url": "/api/v2/type/1/"
        },
        {
            "name": "fighting",
            "url": "/api/v2/type/2/"
        },
        {
            "name": "flying",
            "url": "/api/v2/type/3/"
        },
        {
            "name": "poison",
            "url": "/api/v2/type/4/"
        },
        {
            "name": "ground",
            "url": "/api/v2/type/5/"
        },
        {
            "name": "rock",
            "url": "/api/v2/type/6/"
        },
        {
            "name": "bug",
            "url": "/api/v2/type/7/"
        },
        {
            "name": "ghost",
            "url": "/api/v2/type/8/"
        },
        {
            "name": "steel",
            "url": "/api/v2/type/9/"
        },
        {
            "name": "fire",
            "url": "/api/v2/type/10/"
        },
        {
            "name": "water",
            "url": "/api/v2/type/11/"
        },
        {
            "name": "grass",
            "url": "/api/v2/type/12/"
        },
        {
            "name": "electric",
            "url": "/api/v2/type/13/"
        },
        {
            "name": "psychic",
            "url": "/api/v2/type/14/"
        },
        {
            "name": "ice",
            "url": "/api/v2/type/15/"
        },
        {
            "name": "dragon",
            "url": "/api/v2/type/16/"
        },
        {
            "name": "dark",
            "url": "/api/v2/type/17/"
        },
        {
            "name": "fairy",
            "url": "/api/v2/type/18/"
        },
        {
            "name": "stellar",
            "url": "/api/v2/type/19/"
        },
        {
            "name": "unknown",
            "url": "/api/v2/type/10001/"
        },
        {
            "name": "shadow",
            "url": "/api/v2/type/10002/"
        }
    ]
  const handlePlaySound = (soundUrl, event) => {
    const id = event.currentTarget.id
    const audio = new Audio(soundUrl);
    audio.play();
    fetch('http://localhost:5050/pokemons/users/addpokemon',{
      method:'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        "id" : "198b73c5-50b6-4fbc-a7dc-d93a6c2ec1d6",
        "data" : {"id" : id}
      }),
    }).then(response =>response.json()).then(data => console.log(data))
  };
  const addToPokedex = (id)=>{ 
     }

      return <article id={id} key={id} className="pokemon-card" onClick={(event)=>{handlePlaySound(cries.latest, event)}} > {/* Unique key and card class */}
          <h2 className="title">{speciesData[id - 1]?.names[7].name}</h2>
          <img
            className="pokemon"
            id={id} // Set unique ID for potential usage
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
            alt={`Sprite of ${speciesData[id - 1]?.names[7].name}`} // Add alt text for accessibility
          />
          <div className="info">
            <span className="types">
              {types.map((type) => (
                <img
                  key={type.type.name} // Ensure unique key based on type name
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/legends-arceus/${type.type.url.split('/')[4]}.png`}
                  alt={`${type.type.name} type`} // Add alt text for accessibility
                />
              ))}
            </span>
            <span>Height: {height}</span>
            <span>Weight: {weight}</span>
            <p>
              {speciesData[id - 1]?.flavor_text_entries[26]?.flavor_text}
            </p>
          </div>
        </article>
}

export default pokeCard