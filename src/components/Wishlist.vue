<template>
  <div>
    <h1>Önskelistor</h1>
    <form v-on:submit="addWish">
      <select v-model="newWish.name">
        Välj
        <option
          value=""
          disabled
          selected
        >
          Välj namn
        </option>
        <option
          v-for="user in users"
          :key="user.name"
        >
          {{user.name}}
        </option>
      </select>
      <input
        type="text"
        placeholder="Vad önskar du dig..."
        v-model="newWish.wish"
      />
      <input
        type="submit"
        value="Lägg till"
        calss="sumbit"
      />
    </form>
    <main>
      <div
        v-for="user in users"
        :key="user.name"
        v-bind:id="user.name"
        class="user"
      >
        <h2>{{user.name}}</h2>
        <ul>
          <li
            v-for="aWish in allWishes"
            :key="aWish.id"
            v-if="aWish.name === user.name"
          >
            {{aWish.wish}}
            <span><button v-on:click="deleteWish(aWish.id)">X</button></span>
          </li>
        </ul>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      users: [
        { name: "ludwig" },
        { name: "simon" },
        { name: "annie" },
        { name: "mamma" },
        { name: "pappa" }
      ],
      newWish: { id: 0, name: "", wish: "" },
      allWishes: []
    };
  },
  methods: {
    addWish: function(e) {
      if (this.newWish.wish.replace(/ /g, "") != "") {
        this.allWishes.push({
          id: this.newWish.id,
          name: this.newWish.name,
          wish: this.newWish.wish
        });
        this.newWish.wish = "";
        this.newWish.id += 1;
      }
      e.preventDefault();
    },
    deleteWish: function(id) {
      for (var i = 0; i < this.allWishes.length; i += 1) {
        if (this.allWishes[i].id === id) {
          this.allWishes.splice(i, 1);
        }
      }
    }
  }
};
</script>

<style scoped lang="postcss">
h2 {
  font-weight: bold;
  margin: 0;
  padding: 0;
}

ul {
  margin: 0;
  padding: 0;
}

li {
  list-style: none;
  text-align: left;
  margin-left: 0.5em;
  padding: 0.5em 0;
  clear: both;
  overflow: hidden;
  font-size: 16px;
}

span {
  float: right;
  margin-right: 0.5em;
}

button {
  border-radius: 100%;
  font-weight: bold;
}

form {
  margin: 0.5em;
  display: grid;
}

form * {
  margin: 0.25em 1em;
  font-size: 20px;
}

#ludwig {
  background-color: #7fdbff;
}
#simon {
  background-color: #39cccc;
}
#annie {
  background-color: #2ecc40;
}
#mamma {
  background-color: #01ff70;
}
#pappa {
  background-color: #ffdc00;
}

@media (min-width: 600px) {
  main {
    display: flex;
  }

  form {
    display: block;
  }

  form * {
    width: 25%;
    max-width: 200px;
  }

  .user {
    width: 20%;
  }
}
</style>
