const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

// √1. get data from API
// √2. iterate through JSON, create a card for each trainer
// √3. append each card to main
// 4. event listener on click for add pokemon button
// 5. send post request to /pokemons
// 6. append new pokemon to appropriate div

function getTrainers(){
    fetch(TRAINERS_URL)
      .then(function(response){
        return response.json()
      })
      .then(function(trainers){
        console.log('Trainers', trainers)
        trainers.forEach(function(trainer){
          appendTrainer(trainer)
        })
      })
  }

  getTrainers()

  function appendTrainer(trainer) {
    let div = document.createElement("div")
    div.className = 'card'
    div.dataset.id = trainer.id
    div.innerHTML = `
      <p>${trainer.name}</p>
      <button data-trainer-id="${trainer.id}">Add Pokemon</button>
    `
    trainer.pokemons.forEach(function (pokemon) {
      appendPokemon(pokemon, div)
    })
    main.appendChild(div)
  }
  function appendPokemon(pokemon, div) {
    let ul = document.createElement('ul')
    ul.innerHTML = `
      <li>${pokemon.nickname} (${pokemon.species}) 
      <button class="release" data-pokemon-id="${pokemon.id}">Release</button>
      </li>
    `
    div.appendChild(ul)
  }

  main.addEventListener('click', function (e) {
    let div = document.querySelector(`div[data-id="${e.target.dataset.trainerId}"]`)
    if (e.target.innerText === 'Add Pokemon') {
      addPokemon(e.target, div)
    } else if (e.target.innerText === 'Release'){
      fetch (`${POKEMONS_URL}/${e.target.dataset.pokemonId}`,{
        method: `DELETE`
      })
      e.target.parentNode.remove()
    }
  })

  function addPokemon(el, div) {
    fetch(POKEMONS_URL, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        trainer_id: el.dataset.trainerId
      })
    })
      .then(function (response) {
        return response.json()
      })
      .then(function (pokemon) {
        appendPokemon(pokemon, div)
      })
  }
  
  
  