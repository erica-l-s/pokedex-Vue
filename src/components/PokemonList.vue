<script setup>
const pokemon = defineProps(["name", "urlBaseSvg", "ids", "type"]);
</script>

<template>
  <div class="col-md-4 col-sm-6 mb-4">
    <div class="card mb-3 cardListPokemon">
      <div class="card-body d-flex flex-column align-items-center">
        <p class="text-secondary">#{{ pokemon.ids }}</p>

        <img
          :src="pokemon.urlBaseSvg"
          class="card-img-top mb-2"
          alt="Pokemon Image"
          height="80"
        />
        <p class="text-center mb-0">{{ pokemon.name }}</p>
        <p class="text-center mb-0 text-white style-type">{{ pokemon.type }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cardListPokemon {
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.cardListPokemon:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-body {
  padding: 1.25rem;
}

.text-secondary {
  color: #999;
}

.text-white {
  color: #fff;
}
.style-type {
  background-color: rgb(148, 140, 161);
  border: 1px solid green;
  border-radius: 10px;
  margin: 5px;
  padding: 2px;
}
</style>
