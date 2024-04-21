<script setup>
const pokemon = defineProps([
  "name",
  "xp",
  "height",
  "img1",
  "img2",
  "weight",
  "types",
  "ability",
  "move",
  "game_indice",
  "hp",
  "attack",
  "defense",
  "special_attack",
  "special_defense",
  "speed",
  "types",
  "evolutionChain",
]);
</script>

<template>
  <div class="card CardSelected">
    <div class="PokemonCardSelected">
      <img
        v-if="pokemon.name"
        :src="pokemon.img1"
        width="150"
        class="card-img-top rounded-circle"
        :alt="pokemon.img1"
      />
      <img
        v-if="pokemon.name"
        :src="pokemon.img2"
        width="150"
        class="card-img-top rounded-circle"
        :alt="pokemon.img2"
      />
      <img
        v-else
        src="../assets/egg_pokemon.svg"
        height="250"
        class="card-img-top pt-2"
        alt="???"
      />
    </div>
    <div class="card-body">
      <h5 class="card-title text-center mb-4">{{ pokemon.name || "???" }}</h5>
      <p class="text-center mb-3 text-white style-type">{{ pokemon.types }}</p>

      <div class="row gx-2" v-if="pokemon.name">
        <div class="col-sm-6 col-lg-4">
          <strong>HP:</strong>
          <span>{{ pokemon.hp }}</span>
        </div>
        <div class="col-sm-6 col-lg-4">
          <strong>Ataque:</strong>
          <span>{{ pokemon.attack }}</span>
        </div>
        <div class="col-sm-6 col-lg-4">
          <strong>Defesa:</strong>
          <span>{{ pokemon.defense }}</span>
        </div>
        <div class="col-sm-6 col-lg-4">
          <strong>Ataque Especial:</strong>
          <span>{{ pokemon.special_attack }}</span>
        </div>
        <div class="col-sm-6 col-lg-4">
          <strong>Defesa Especial:</strong>
          <span>{{ pokemon.special_defense }}</span>
        </div>
        <div class="col-sm-6 col-lg-4">
          <strong>Velocidade:</strong>
          <span>{{ pokemon.speed }}</span>
        </div>
        <div class="col-sm-6 col-lg-4">
          <strong>Altura:</strong>
          <span>{{ pokemon.height / 10 }} m</span>
        </div>
        <div class="col-sm-6 col-lg-4">
          <strong>Peso:</strong>
          <span>{{ (pokemon.weight / 10).toFixed(2) }} kg</span>
        </div>
        <div class="col-12">
          <strong>Habilidades:</strong>
          <ul>
            <li>{{ pokemon.ability }}</li>
          </ul>
        </div>
        <div class="col-12">
          <strong>Movimentos:</strong>
          <ul>
            <li>{{ pokemon.move }}</li>
          </ul>
        </div>
        <div class="col-12">
          <strong>Game Indice:</strong>
          <ul>
            <li>{{ pokemon.game_indice }}</li>
          </ul>
        </div>
        <section>
          <strong>Evolution Chain</strong>
          <ul>
            <li>
              {{ pokemon.evolutionChain }}
            </li>
          </ul>
        </section>
      </div>
      <div></div>
    </div>
  </div>
</template>

<style scoped>
.CardSelected {
  height: 75vh;
  border: 2px solid #f1f1f1;
  border-radius: 10px;
  overflow-y: scroll;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding-top: 40px;
}

.PokemonCardSelected {
  display: flex;
  justify-content: center;
  margin-top: -50px;
}

.card-title {
  color: #333;
}

.card-body {
  padding: 1.5rem;
}

.row > .col-sm-6 {
  margin-bottom: 1.5rem;
}

.row > .col-12 {
  margin-bottom: 1.5rem;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

ul li {
  padding: 5px 0;
  color: #555;
}

strong {
  color: #333;
}
.style-type {
  background-color: rgb(148, 140, 161);
  border: 1px solid green;
  border-radius: 10px;
  margin: 5px;
}

.CardSelected::-webkit-scrollbar {
  width: 8px;
}

.CardSelected::-webkit-scrollbar-track {
  background-color: #f1f1f1;
  border-radius: 10px;
}

.CardSelected::-webkit-scrollbar-thumb {
  background-color: #aaa;
  border-radius: 10px;
}
</style>
