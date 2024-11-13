

const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}

pokeApi.getPokemonDetailByNumber = (pokemonNumber) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonNumber}`;

    return fetch(url)
        .then(response => response.json())
        .then(pokeDetail => {
            const pokemon = new Pokemon();
            pokemon.number = pokeDetail.id;
            pokemon.name = pokeDetail.name;

            pokemon.types = pokeDetail.types.map(typeSlot => typeSlot.type.name);
            pokemon.type = pokemon.types[0];

            pokemon.photo = pokeDetail.sprites.other.dream_world.front_default;

            pokemon.height = pokeDetail.height;
            pokemon.weight = pokeDetail.weight;
            pokemon.abilities = pokeDetail.abilities.map(ability => ability.ability.name);

            pokemon.baseStats = pokeDetail.stats.reduce((stats, statSlot) => {
                stats[statSlot.stat.name] = statSlot.base_stat;
                return stats;
            }, {});

            pokemon.moves = pokeDetail.moves.slice(0, 5).map(move => move.move.name);

            return fetch(pokeDetail.species.url)
                .then(response => response.json())
                .then(speciesDetail => {
                    return fetch(speciesDetail.evolution_chain.url)
                        .then(response => response.json())
                        .then(evolutionChain => {
                            const evolutions = [];
                            let currentEvolution = evolutionChain.chain;

                            while (currentEvolution) {
                                evolutions.push(currentEvolution.species.name);
                                currentEvolution = currentEvolution.evolves_to[0];
                            }

                            pokemon.evolutions = evolutions;
                            pokemon.color = speciesDetail.color.name;
                            pokemon.form = pokeDetail.form ? pokeDetail.form.name : null;

                            return pokemon;
                        });
                });
        })
        .catch(error => {
            console.error("Erro ao obter detalhes do Pokémon:", error);
        });
};
