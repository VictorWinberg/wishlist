<template>
  <form
    v-on:submit="addWish"
    v-if="activeUser"
  >
    <input
      type="text"
      v-bind:placeholder="placeholder"
      v-model="newWish"
    />
    <input
      type="submit"
      value="Lägg till"
      calss="sumbit"
    />
  </form>
</template>

<script>
import { capitalize } from "lodash";
export default {
  data() {
    return {
      activeUser: this.$cookie.get("name"),
      newWish: ""
    };
  },
  computed: {
    placeholder: function() {
      return " Vad önskar du dig "
        .concat(capitalize(this.activeUser))
        .concat("?");
    }
  },
  methods: {
    addWish: async function(e) {
      e.preventDefault();
      if (this.newWish.replace(/ /g, "") != "") {
        const res = await fetch("/api/wishes/", {
          method: "POST",
          body: JSON.stringify({
            wish: this.newWish,
            name: this.activeUser
          }),
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        });
        const wishes = await res.json();
        this.$store.state.allWishes = wishes;
        this.newWish = "";
      }
    }
  }
};
</script>

<style scoped>
form {
  margin: 0.5em;
  display: grid;
}

form * {
  margin: 0.25em 1em;
  font-size: 20px;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  background-color: white;
  border: 1px solid black;
  border-radius: 4px;
}

@media (min-width: 600px) {
  form {
    display: block;
  }

  form * {
    width: 40%;
    max-width: 300px;
  }
}
</style>
</style>
