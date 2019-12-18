const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    let main = document.querySelector('main')
    function getTrainers() {
      fetch(TRAINERS_URL)
      .then(res => res.json())
      .then(data => renderData(data))
    }
    getTrainers()
    function renderData(data) {
      main.innerHTML = ''
      data.forEach(function(trainer) {
        console.log(trainer);
        main.innerHTML += `
        <div class="card" data-id=${trainer.id}><p>${trainer.name}</p>
          <button data-trainer-id=${trainer.id}>Add Pokemon</button>
          <ul id=${trainer.id}-pokemon>
          </ul>
        </div>
        `
        let ul = document.getElementById(`${trainer.id}-pokemon`)
        trainer.pokemons.forEach(function(pokemon) {
          let li = document.createElement('li');
          let button = document.createElement('button');
          li.innerText = `${pokemon.nickname} (${pokemon.species})`
          button.className = 'release'
          button.dataset.pokemonId = `${pokemon.id}`
          button.innerText = 'Release'
          ul.appendChild(li)
          li.appendChild(button)
        })
      })
    }
    main.addEventListener('click', function(e) {
      console.log(e.target);
      if (e.target.innerText === 'Add Pokemon') {
        console.log('add!');
        let trainerId = e.target.dataset.trainerId
        console.log(trainerId);
        fetch(POKEMONS_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "trainer_id": `${trainerId}`
          })
        })
          .then(res => res.json())
          .then(pokemon => getTrainers())
      } else if (e.target.innerText === 'Release') {
        console.log('release');
        let pokemonId = e.target.dataset.pokemonId
        fetch(POKEMONS_URL + `/${pokemonId}`, {
          method: 'DELETE'
        })
          .then(res => res.json())
          .then(pokemon => getTrainers())
      }
    })
});