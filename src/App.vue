<script setup>
</script>

<template>
  <div>
    <nav class="navbar bg-primary">
      <div class="container-fluid d-flex justify-content-between">
        <!-- Logo -->
        <router-link class="navbar-brand" href="/">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/International_Pok%C3%A9mon_logo.svg/2000px-International_Pok%C3%A9mon_logo.svg.png"
            alt="Logo"
            width="150"
            class="d-inline-block align-text-top"
          />
        </router-link>
      </div>
    </nav>
    <div class="main">
      <router-view> </router-view>
    </div>
    <footer class="bg-primary text-light">
      <div class="container-fluid">
        <div class="row justify-content-center align-items-center">
          <div class="col-auto">
            <span
              >Desenvolvido com Vue por Erica Lima e Silva em
              {{ new Date().getFullYear() }}.</span
            >
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
footer {
  bottom: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 54px;
}
</style>
