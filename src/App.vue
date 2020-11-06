<template>
    <div id="app">
        <Header />
        <Form />
        <Wishlist />
        <modals-container />
    </div>
</template>

<script>
import Header from "./components/Header";
import Form from "./components/Form";
import Wishlist from "./components/Wishlist";

export default {
    name: "App",
    components: {
        Header,
        Form,
        Wishlist,
    },
};
</script>

<style>
body {
    margin: 0;
}
#app {
    text-align: center;
    font-family: "Avenir", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}

.v--modal {
    margin: 0px auto;
    max-width: 500px;
}
.v--modal-overlay .v--modal-box {
    overflow: visible;
}

@font-face {
    font-family: "Avenir";
    font-style: normal;
    font-weight: normal;
    src: local("Avenir LT Std 55 Roman"),
        url("assets/AvenirLTStd-Roman.woff") format("woff");
}
</style>
