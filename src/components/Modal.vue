<template>
  <div>
    <h1>Ändra önskning</h1>
    <input
      type="text"
      v-model=editWish
    />
    <div class="buttons">
      <button v-on:click="save()">save</button>
      <button v-on:click="close()">avbryt</button>
    </div>
  </div>
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
      this.$emit("close");
    }
  }
};
</script>

<style scoped>
div {
  color: red;
}

b {
  font-size: 40px;
}

.buttons {
  position: absolute;
  bottom: 0;
  border: 1px solid green;
  width: 100%;
}

button {
  background-color: white;
  text-transform: uppercase;
  border: 1px solid blue;
  width: 49%;
}
</style>
