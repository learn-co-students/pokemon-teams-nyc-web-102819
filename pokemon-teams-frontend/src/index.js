const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

let mainArea = document.querySelector('main')

// When a user loads the page, they should see all trainers, with their current team of Pokemon.

function getTrainers () {
    fetch ('http://localhost:3000/trainers')
        .then (function (resp) {
            return resp.json();
        })
        .then (function (trainers) {
            trainers.forEach (function (trainer) {
                trainerDiv = document.createElement('div')
                trainerDiv.className = 'card'
                trainerDiv.dataset.id = trainer.id
                trainerDiv.innerHTML = `
                <p>${trainer.name}</p>
                <button class="add" data-trainer-id=${trainer.id}>Add Pokemon</button>
                <ul></ul>
                `
                trainer.pokemons.forEach (function (pokemon) {
                    let pokemonLi = document.createElement('li')
                    let trainerUl = trainerDiv.querySelector('ul')
                    pokemonLi.innerHTML = `
                    <li>${pokemon.nickname}<button class="release" data-pokemon-id=${pokemon.id}>Release</button></li>
                    `
                    trainerUl.appendChild(pokemonLi)
                })
                mainArea.append(trainerDiv)
            })
        })
}

getTrainers();

// Whenever a user hits Add Pokemon and they have space on their team, they should get a new Pokemon.

// Whenever a user hits Release Pokemon on a specific Pokemon team, that specific Pokemon should be released from the team.

document.addEventListener("click", function (e) {
    if (e.target.className === 'release') {
        parentRow = e.target.parentNode
        pokemonIdToDelete = e.target.dataset.pokemonId
        deletePokemon(parentRow, pokemonIdToDelete);
    } else if (e.target.className === 'add') {
        let currentNumOfPokemon = e.target.parentNode.querySelector('ul').children.length
        let trainerId = e.target.parentNode.dataset.id
        let trainerDiv = e.target.parentNode
        if (currentNumOfPokemon < 6) {
            addPokemon(trainerId, trainerDiv);
        }
    }
})

function addPokemon(trainerId, trainerDiv) {
//add it to the DB and then add it to the dom
    fetch ('http://localhost:3000/pokemons', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify ({
            "trainer_id": trainerId
        })
    }).then (function (resp) {
        return resp.json();
    }).then (function (newPokemon) {
        let pokemonLi = document.createElement('li')
        let trainerUl = trainerDiv.querySelector('ul')
        pokemonLi.innerHTML = `
                <li>${newPokemon.nickname}<button class="release" data-pokemon-id=${newPokemon.id}>Release</button></li>
        `
        trainerUl.appendChild(pokemonLi)
    })
}

function deletePokemon(parentRow, pokemonIdToDelete) {

    //optimistically remove parent row
    parentRow.remove();

    //send the delete request to the DB
    fetch (`${POKEMONS_URL}/${pokemonIdToDelete}`, {
        method: 'DELETE'
    })
}

