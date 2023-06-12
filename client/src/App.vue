<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link :to="{ name:'About' }">About</router-link> |
    <router-link :to="{ name:'Exchangerates' }">Exchange Rates</router-link> |
    <router-link :to="{ name:'Exchangeratesbasetarget', params: { base: 'USD', target: 'EUR'} }">Exchange Rates with Base and Target</router-link> |
    <router-link :to="{ name:'Exchangerateccu' }">Exchangerate Create Update</router-link> |
    <router-link :to="{ name:'Conversion' }">Exchange Rate Conversion</router-link> |
  </nav>
  <router-view/>
</template>

<script>
  export default{
    name: "App"
  };
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42a1b9;
}
</style>
