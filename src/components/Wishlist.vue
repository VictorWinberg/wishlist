<template>
  <div>
    <h1>Önskelistor</h1>
    <button
      class="sign"
      v-if="this.activeUser"
      v-on:click="signOut()"
    >
      <a href="/">Logga ut</a>
    </button>
    <button
      class="sign"
      v-else
    >
      <a href="/auth/google">Logga in</a>
    </button>
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
        <ul v-if="activeUser">
          <li
            v-for="aWish in getUserWishes(user.name)"
            v-bind:key=aWish.id
          >
            <span>{{aWish.wish}}</span>
            <button
              class="round"
              v-if="user.name === activeUser"
              v-on:click="deleteWish(aWish.id)"
            >
              X
            </button>
            <button
              class="round"
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
      activeUser: this.$cookie.get("name"),
      newWish: { name: "", wish: "" },
      allWishes: []
    };
  },
  methods: {
    signOut: function() {
      activeUser: this.$cookie.delete("name");
    },
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
          credentials: "include",
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
        method: "DELETE",
        credentials: "include"
      });
      const wishes = await res.json();
      this.allWishes = wishes;
    },
    buyWish: async function(wish) {
      console.log("BUY");
      if (!wish.bought || wish.buyer === this.activeUser) {
        const res = await fetch("/api/wishes/" + wish.id, {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({
            bought: !wish.bought,
            buyer: !wish.bought ? this.activeUser : ""
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
    const response = await this.$http.get("/api/wishes", {
      credentials: "include"
    });
    this.allWishes = response.data;
    console.log("user", this.activeUser);
    console.log(response.data);
  }
};
</script>

<style scoped lang="postcss">
h2 {
  text-transform: capitalize;
  font-weight: bold;
  margin: 0;
  padding: 0;
}

.sign {
  background-color: transparent;
  border-radius: 10%;
  position: absolute;
  font-size: 14px;
  right: 0.5em;
  top: 0.5em;
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

.round {
  text-transform: uppercase;
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
  background-color: #001f3f;
  color: hsla(210, 100%, 75%, 1);
}
#simon {
  background-color: #7fdbff;
}
#annie {
  background-color: #39cccc;
}
#mamma {
  background-color: #2ecc40;
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
