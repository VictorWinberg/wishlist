<template>
  <div id="app">
    <Wishlist />
    <modals-container />
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
  font-family: "Avenir", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /*margin-top: 60px;*/
}

@font-face {
  font-family: "Avenir";
  font-style: normal;
  font-weight: normal;
  src: local("Avenir LT Std 55 Roman"),
    url("assets/AvenirLTStd-Roman.woff") format("woff");
}
</style>
