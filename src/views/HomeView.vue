<script setup>
  import { onMounted, reactive, ref, computed } from "vue";
  import PokemonList from "../components/PokemonList.vue";
  import CardPokemon from "@/components/CardPokemon.vue";

  // Definição das variáveis reativas
  let pokemons = reactive(ref()); // Lista de pokemons
  let urlBaseSvg = ref("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/"); // URL base para imagens dos pokemons
  let searchPokemonField = ref(""); // Campo de pesquisa de pokemons
  let pokemonSelected = reactive(ref()); // Pokemon selecionado
  let searchPokemonType = ref(""); // Tipo de pokemon para filtragem
  let pokemonTypes = ref([]); // Lista de tipos de pokemon
  let searchPokemonSpecies = ref(""); // Espécie de pokemon para filtragem
  let evolutionChain = reactive(ref([])); // Cadeia de evolução do pokemon selecionado
  let selectedLanguage = ref('pt'); // Idioma selecionado (padrão: português)

  // Método executado após a montagem do componente
  onMounted(async () => {
    try {
      // Requisição para obter a lista de pokemons
      const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100&offset=0");
      const data = await res.json();
      // Preenchendo a lista de pokemons com dados adicionais
      pokemons.value = await Promise.all(
        data.results.map(async (pokemon, index) => {
          const pokemonRes = await fetch(pokemon.url);
          const pokemonData = await pokemonRes.json();
          const resTypes = await fetch("https://pokeapi.co/api/v2/type");
          const dataTypes = await resTypes.json();
          pokemonTypes.value = dataTypes.results.map((type) => type.name);
          const speciesRes = await fetch(pokemonData.species.url);
          const speciesData = await speciesRes.json();
          return {
            ...pokemon,
            id: index + 1,
            type: pokemonData.types.map((type) => type.type.name),
            species: speciesData.name,
          };
        })
      );
    } catch (error) {
      console.error("Failed to fetch initial data:", error);
    }
  });

  // Método computado para filtrar a lista de pokemons
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

  // Função para selecionar um pokemon
  const selectPokemon = async (pokemon) => {
    try {
      const res = await fetch(`${pokemon.url}?language=${selectedLanguage.value}`);
      const data = await res.json();
      pokemonSelected.value = data;
      pokemon.type = data.types.map((type) => type.type.name);
      fetchEvolutionChain(data.species.url);
    } catch (error) {
      console.error("Failed to fetch selected Pokemon:", error);
    }
  };

  // Função para obter os nomes da cadeia de evolução de um pokemon
  function getEvolutionNames(chain) {
    let names = [chain.species.name];
    if (chain.evolves_to && chain.evolves_to.length > 0) {
      chain.evolves_to.forEach((evo) => {
        names.push(...getEvolutionNames(evo));
      });
    }
    return names;
  }

  // Função para obter e preencher a cadeia de evolução de um pokemon
  const fetchEvolutionChain = async (speciesUrl) => {
    try {
      const res = await fetch(`${speciesUrl}?language=${selectedLanguage.value}`);
      const data = await res.json();
      const evolutionRes = await fetch(data.evolution_chain.url);
      const evolutionData = await evolutionRes.json();
      const evolutionNames = getEvolutionNames(evolutionData.chain);
      evolutionChain.value = evolutionNames;
    } catch (error) {
      console.error("Failed to fetch evolution chain:", error);
    }
  };

  // Função para alterar o idioma
  const changeLanguage = async () => {
    console.log("Selected Language:", selectedLanguage.value);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1000&offset=0&language=${selectedLanguage.value}`);
      const data = await res.json();
      // Preenchendo a lista de pokemons com dados atualizados para o idioma selecionado
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
    } catch (error) {
      console.error("Failed to fetch Pokemon data in selected language:", error);
    }
  };
</script>

<template>
  <main class="main">
    <div class="container mt-4 mb-4">
      <div class="text-center">
        <div>
 
  </div>
        <label for="language-select">Select Language: </label>
        <select
        id="language-select"
        v-model="selectedLanguage"
        @change="changeLanguage"
      >
        <option value="pt">Português</option>
        <option value="en">English</option>
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
