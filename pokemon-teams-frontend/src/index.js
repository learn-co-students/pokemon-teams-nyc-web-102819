const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

const trainerContainer = document.getElementById('trainer-container')
// DELIVERABLE: When a user loads the page, they should see all trainers, with their current team of Pokemon.
function fetchAllTrainers(){
    fetch(TRAINERS_URL)
    .then(res => res.json())
    .then(trainers => renderTrainerCards(trainers))
}
function renderTrainerCards(trainers){
    trainers.forEach(trainer => {
        trainerContainer.innerHTML += `
            <div class="card" data-id="${trainer.id}"><p>${trainer.name}</p>
                <button class="add" data-trainer-id="${trainer.id}">Add Pokemon</button>  
                <ul id="list-${trainer.id}">
                </ul>      
            </div>
        `
        renderPokemonz(trainer.id, trainer.pokemons)
    })
}
function renderPokemonz(trainerid, pokemonz){
    let currentList = document.getElementById(`list-${trainerid}`)
    pokemonz.forEach(pokemon => {
        currentList.innerHTML += `
            <li id="pokemon-li-${pokemon.id}">${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id="${pokemon.id}">Release</button></li>
        `
    })
}
fetchAllTrainers();
// DELIVERABLE: Whenever a user hits Release Pokemon on a specific Pokemon team, that specific Pokemon should be released from the team.
function releasePokemon(id){
    fetch(`http://localhost:3000/pokemons/${id}`, {
        method: 'DELETE'
    })
    .then(res => res.json())
    .then(pokemon => removePokemon(pokemon))
}
function removePokemon(pokemon){
    let deletedPokemon = document.getElementById(`pokemon-li-${pokemon.id}`)
    deletedPokemon.remove()
}
//DELIVERABLE: Whenever a user hits Add Pokemon and they have space on their team, they should get a new Pokemon.
function capturePokemon(trainerId) {
    fetch(POKEMONS_URL, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({
            "trainer_id": trainerId
          })
    })
    .then(res => res.json())
    .then(pokemon => console.log("new guy", pokemon))
}
trainerContainer.addEventListener('click', e => {
    if (e.target.className === "release"){
        releasePokemon(e.target.dataset.pokemonId)     
    } else if (e.target.className === "add") {
        let liCount = e.target.parentNode.querySelectorAll('li').length
        let trainerId = e.target.dataset.trainerId
        // console.log("id", trainerID)
        if(liCount < 6) {
            capturePokemon(trainerId)
        }
    }
})