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
            v-for="aWish in getUserWishes(user.name)"
            v-bind:key=aWish.id
          >
            <span>{{aWish.wish}}</span>
            <button
              v-if="user.name === activeUser"
              v-on:click="deleteWish(aWish.id)"
            >
              X
            </button>
            <button
              v-else
              v-on:click="{buyWish(aWish)}"
              v-bind:class="{unavailable : aWish.bought, available : !aWish.bought}"
            ><span v-if="aWish.bought">{{aWish.buyer.charAt(0)}}</span></button>
          </li>
        </ul>
      </div>
    </main>
  </div>
</template>

<script>
import { sortBy } from "lodash";
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
      activeUser: "simon",
      newWish: { name: "", wish: "" },
      allWishes: []
    };
  },
  methods: {
    getUserWishes: function(name) {
      var userWishes = [];
      this.allWishes.forEach(wish => {
        if (wish.name === name) {
          userWishes.push(wish);
        }
      });
      return sortBy(userWishes, "id");
    },
    addWish: async function(e) {
      e.preventDefault();
      if (this.newWish.wish.replace(/ /g, "") != "") {
        const res = await fetch("/api/wishes/", {
          method: "POST",
          body: JSON.stringify(this.newWish),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        });
        const wishes = await res.json();
        this.allWishes = wishes;
        this.newWish.wish = "";
      }
    },
    deleteWish: async function(id) {
      const res = await fetch("/api/wishes/" + id, {
        method: "DELETE"
      });
      const wishes = await res.json();
      this.allWishes = wishes;
    },
    buyWish: async function(wish) {
      console.log("BUY");
      if (!wish.bought || wish.buyer === this.activeUser) {
        const res = await fetch("/api/wishes/" + wish.id, {
          method: "POST",
          body: JSON.stringify({
            bought: !wish.bought,
            buyer: !wish.bought ? this.activeUser : "NULL"
          }),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        });
        const wishes = await res.json();
        this.allWishes = wishes;
      }
    }
  },
  created: async function() {
    const response = await this.$http.get("/api/wishes");
    this.allWishes = response.data;
    console.log(response.data);
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
  font-size: 18px;
  display: flex;
}

span {
  width: calc(100% - 30px - 0.5em);
}

button {
  border: solid 1px black;
  margin-right: 0.5em;
  border-radius: 100%;
  font-weight: bold;
  font-size: 18px;
  height: 30px;
  width: 30px;
}

.available {
  background-color: #01ff70;
}

.unavailable {
  background-color: orangered;
}

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
