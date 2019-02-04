<template>
  <main>
    <h1>Ändra önskning</h1>
    <form>
      <input
        type="text"
        v-model=editWish
      />
      <span class="btns">
        <input
          id="save"
          type="button"
          v-on:click="save()"
          value=spara
        />
        <input
          type="button"
          v-on:click="close()"
          value=avbryt
        />
      </span>
    </form>
  </main>
</template>

<script>
export default {
  name: "Modal",
  props: ["wish"],
  data() {
    return {
      editWish: this.wish.wish
    };
  },
  methods: {
    close: function() {
      this.$emit("close");
    },
    save: async function() {
      const res = await fetch("/api/wishes/" + this.wish.id, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          wish: this.editWish
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      });
      const wishes = await res.json();
      this.$store.state.allWishes = wishes;
      this.close();
    }
  }
};
</script>

<style scoped>
main {
  margin: 0.5em;
}

h1 {
  text-align: center;
  font-size: 1.5em;
  margin: 0;
}

.btns {
  font-size: 0;
}

input {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  font-size: 18px;
}

input[type="text"] {
  width: 100%;
  margin-bottom: 0.5em;
  box-sizing: border-box;
  background-color: white;
  border: 1px solid black;
  border-radius: 4px;
  padding: 0.2em;
}

input[type="button"] {
  text-transform: uppercase;
  width: calc(50% - 0.25em);
  border: 0;
  padding: 10px 18px;
  cursor: pointer;
  color: #fff;
  box-shadow: 0 4px 8px rgba(32, 160, 255, 0.3);
  background: #4db3ff;
  font-weight: 600;
  border-radius: 3px;
}

#save {
  margin-right: 0.5em;
}
</style>
