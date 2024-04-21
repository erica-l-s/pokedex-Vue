<script setup>
  // Importações dos componentes e utilitários do Vue
  import CardPokemon from "@/components/CardPokemon.vue";
  import { onMounted, reactive, ref, computed } from "vue";
  import PokemonList from "../components/PokemonList.vue";

  // Definição de variáveis reativas
  let pokemons = reactive(ref()); // Lista de pokémons
  let urlBaseSvg = ref("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/"); // URL base para sprites dos pokémons
  let searchPokemonField = ref(""); // Campo de pesquisa por nome ou ID de pokémon
  let pokemonSelected = reactive(ref()); // Pokémon selecionado para exibir detalhes
  let searchPokemonType = ref(""); // Tipo de pokémon para filtragem
  let pokemonTypes = ref([]); // Lista de tipos de pokémon
  let searchPokemonSpecies = ref(""); // Espécie de pokémon para filtragem
  let evolutionChain = reactive(ref([])); // Cadeia de evolução do pokémon selecionado
  let selectedLanguage = ref("en"); // Idioma selecionado para exibição dos dados

  // Função executada após o componente ser montado
  onMounted(async () => {
    // Carregar a lista inicial de pokémons
    const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100&offset=0");
    const data = await res.json();
    pokemons.value = await Promise.all(
      data.results.map(async (pokemon, index) => {
        // Para cada pokémon, carregar dados adicionais
        const pokemonRes = await fetch(pokemon.url);
        const pokemonData = await pokemonRes.json();
        // Carregar tipos de pokémons
        const resTypes = await fetch("https://pokeapi.co/api/v2/type");
        const dataTypes = await resTypes.json();
        pokemonTypes.value = dataTypes.results.map((type) => type.name);
        // Carregar espécie do pokémon
        const speciesRes = await fetch(pokemonData.species.url);
        const speciesData = await speciesRes.json();
        // Retornar objeto do pokémon com dados adicionais
        return {
          ...pokemon,
          id: index + 1,
          type: pokemonData.types.map((type) => type.type.name),
          species: speciesData.name,
        };
      })
    );
  });

  // Função computada para filtrar pokémons com base nos critérios de pesquisa
  const pokemonsFiltered = computed(() => {
    if (pokemons.value) {
      return pokemons.value.filter(
        (pokemon) =>
          (searchPokemonField.value === "" ||
            pokemon.name.toLowerCase().startsWith(searchPokemonField.value.toLowerCase()) ||
            pokemon.id.toString() === searchPokemonField.value) &&
          (searchPokemonType.value === "" ||
            pokemon.type.includes(searchPokemonType.value.toLowerCase())) &&
          (searchPokemonSpecies.value === "" ||
            pokemon.species.toLowerCase().startsWith(searchPokemonSpecies.value.toLowerCase()))
      );
    }
    return pokemons.value;
  });

  // Função para selecionar um pokémon e carregar detalhes
  const selectPokemon = async (pokemon) => {
    await fetch(`${pokemon.url}?language=${selectedLanguage.value}`)
      .then((res) => res.json())
      .then((res) => {
        pokemonSelected.value = res;
        pokemon.type = res.types.map((type) => type.type.name);
        fetchEvolutionChain(res.species.url);
      });
  };

  // Função recursiva para obter os nomes da cadeia de evolução de um pokémon
  function getEvolutionNames(chain) {
    let names = [chain.species.name];
    if (chain.evolves_to && chain.evolves_to.length > 0) {
      chain.evolves_to.forEach((evo) => {
        names.push(...getEvolutionNames(evo));
      });
    }
    return names;
  }

  // Função para buscar a cadeia de evolução de um pokémon
  const fetchEvolutionChain = async (speciesUrl) => {
    const speciesRes = await fetch(`${speciesUrl}?language=${selectedLanguage.value}`);
    const speciesData = await speciesRes.json();
    const evolutionChainRes = await fetch(speciesData.evolution_chain.url);
    const evolutionChainData = await evolutionChainRes.json();

    const evolutionNames = getEvolutionNames(evolutionChainData.chain);
    evolutionChain.value = evolutionNames;
  };

  // Função para mudar o idioma dos dados dos pokémons
  const changeLanguage = async () => {
    console.log("Selected Language:", selectedLanguage.value);

    // Limpar a lista de pokémons para recarregar com o novo idioma
    pokemons.value = [];

    // Recarregar a lista de pokémons com o novo idioma selecionado
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0&language=${selectedLanguage.value}`);
    const data = await res.json();
    pokemons.value = await Promise.all(
      data.results.map(async (pokemon, index) => {
        const pokemonRes = await fetch(pokemon.url);
        const pokemonData = await pokemonRes.json();
        const speciesRes = await fetch(pokemonData.species.url);
        const speciesData = await speciesRes.json();
        return {
          species: speciesData.name,
          ...pokemon,
          id: index + 1,
          type: pokemonData.types.map((type) => type.type.name),
        };
      })
    );
  };
</script>

<template>
  <main class="main">
    <div class="container mt-4 mb-4">
      <div class="text-center">
        <label for="language-select">Select Language:</label>
        <select
          id="language-select"
          v-model="selectedLanguage"
          @change="changeLanguage"
        >
          <option value="en">English</option>
          <option value="pt">Português</option>
          <option value="es">Español</option>
        </select>
      </div>
      <div class="row mt-4">
        <div class="col-sm-12 col-md-6 mb-4 mb-md-0">
          <CardPokemon
            :name="pokemonSelected?.name"
            :xp="pokemonSelected?.base_experience"
            :height="pokemonSelected?.height"
            :weight="pokemonSelected?.weight"
            :img1="pokemonSelected?.sprites.front_default"
            :img2="pokemonSelected?.sprites.back_default"
            :types="
              pokemonSelected?.types.map((type) => type.type.name).join(' | ')
            "
            :ability="
              pokemonSelected?.abilities
                .map((ability) => ability.ability.name)
                .join(', ')
            "
            :move="
              pokemonSelected?.moves.map((move) => move.move.name).join(', ')
            "
            :game_indice="
              pokemonSelected?.game_indices
                .map((indice) => indice.version.name)
                .join(', ')
            "
            :hp="pokemonSelected?.stats[0].base_stat"
            :attack="pokemonSelected?.stats[1].base_stat"
            :defense="pokemonSelected?.stats[2].base_stat"
            :special_attack="pokemonSelected?.stats[3].base_stat"
            :special_defense="pokemonSelected?.stats[4].base_stat"
            :speed="pokemonSelected?.stats[5].base_stat"
            :evolutionChain="evolutionChain.join(' -> ')"
          />
        </div>

        <div class="col-sm-12 col-md-6">
          <div class="card card-list">
            <div class="card-body row">
              <div class="mb-3">
                <label for="searchPokemonSpecies" class="form-label"
                  >Filtrar por espécie</label
                >
                <input
                  v-model="searchPokemonSpecies"
                  type="text"
                  class="form-control"
                  id="searchPokemonSpecies"
                  placeholder="Pesquisar espécie"
                />
              </div>
              <div class="mb-3">
                <label for="searchPokemonType" class="form-label"
                  >Filtrar por tipo</label
                >
                <select
                  v-model="searchPokemonType"
                  id="searchPokemonType"
                  class="form-control"
                >
                  <option value="">Todos os tipos</option>
                  <option
                    v-for="type in pokemonTypes"
                    :key="type"
                    :value="type"
                  >
                    {{ type }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label for="searchPokemonField" class="form-label"
                  >Pesquisar</label
                >
                <input
                  v-model="searchPokemonField"
                  type="text"
                  class="form-control"
                  id="searchPokemonField"
                  placeholder="Pesquisar nome, ID"
                />
              </div>

              <PokemonList
                v-for="pokemon in pokemonsFiltered"
                :key="pokemon.name"
                :ids="pokemon.id"
                :name="pokemon.name"
                :urlBaseSvg="urlBaseSvg + pokemon.id + '.svg'"
                :type="pokemon.type.join(' | ')"
                @click="selectPokemon(pokemon)"
                class="mb-3"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.main {
  background-color: #446cee;
  padding: 20px;
}

.card-list {
  max-height: 75vh;
  overflow-y: scroll;
  overflow-x: hidden;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
/* Personalizando a barra de rolagem */
.card-list::-webkit-scrollbar {
  width: 8px; /* Largura da barra de rolagem */
}

.card-list::-webkit-scrollbar-track {
  background: #f1f1f1; /* Cor de fundo da área da barra de rolagem */
  border-radius: 10px; /* Raio do canto da barra de rolagem */
}

.card-list::-webkit-scrollbar-thumb {
  background: #888; /* Cor do indicador da barra de rolagem */
  border-radius: 10px; /* Raio do canto do indicador */
}

.card-body {
  padding: 20px;
}

.mb-3 {
  margin-bottom: 1rem;
}
</style>
