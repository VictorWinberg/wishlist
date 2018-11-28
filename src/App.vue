<template>
  <div id="app">
    <Wishlist />
  </div>
</template>

<script>
import Wishlist from "./components/Wishlist";

export default {
  name: "App",
  components: {
    Wishlist
  }
};
</script>

<style>
body {
  margin: 0;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /*margin-top: 60px;*/
}
</style>
