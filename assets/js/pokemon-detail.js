
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const pokemonNumber = urlParams.get("pokemon");
    if (!pokemonNumber) {
        console.error("Número do Pokémon não encontrado na URL");
        return;
    }

    function updatePokemonDetails(pokemon) {
        const pokemonList = document.getElementById("pokemonList");
        pokemonList.innerHTML = updateDetail(pokemon);
    }

    pokeApi.getPokemonDetailByNumber(pokemonNumber)
        .then(pokemon => {
            console.log(pokemon);
            if (pokemon) {
                updatePokemonDetails(pokemon);
            }
        })
        .catch(error => {
            console.error("Erro ao carregar detalhes do Pokémon:", error);
        });
});


function updateDetail(pokemon) {
    return `
    <li class="pokemon ${pokemon.type}">
        <span class="number">#${pokemon.number}</span>
        <span class="name">${pokemon.name}</span>
        <div class="detail">
            <ol class="types">
                ${pokemon.types.map(type => `<li class="${type}">${type}</li>`).join('')}
            </ol>
            <img class="pokemonImg" src="${pokemon.photo}" alt="${pokemon.name}">
        </div>
    </li>
   <div>
    <ul class="pokemonDetails">
        <li id="height" class="detailItem"><span class="label">Height:</span> ${pokemon.height / 10} m</li>
        <li id="weight" class="detailItem"><span class="label">Weight:</span> ${pokemon.weight / 10} kg</li>
        <li id="abilities" class="detailItem"><span class="label">Abilities:</span> ${pokemon.abilities.join(", ")}</li>
        <!-- Base Stats -->
        <li id="base-stats" class="detailItem"><span class="label">Base Stats:</span>
            <ul class="base-stats-list">
                <li>HP: ${pokemon.baseStats.hp}</li>
                <li>Attack: ${pokemon.baseStats.attack}</li>
                <li>Defense: ${pokemon.baseStats.defense}</li>
                <li>Special Attack: ${pokemon.baseStats.specialAttack}</li>
                <li>Special Defense: ${pokemon.baseStats.specialDefense}</li>
                <li>Speed: ${pokemon.baseStats.speed}</li>
            </ul>
        </li>
        <li id="moves" class="detailItem"><span class="label">Moves:</span> ${pokemon.moves.join(", ")}</li>
        <li id="evolutions" class="detailItem"><span class="label">Evolutions:</span> ${pokemon.evolutions.join(" -> ")}</li>
        <li id="color" class="detailItem"><span class="label">Color:</span> ${pokemon.color}</li>
        <li id="form" class="detailItem"><span class="label">Form:</span> ${pokemon.form || "Standard"}</li>
    </ul>
    </div>
    `;

}

