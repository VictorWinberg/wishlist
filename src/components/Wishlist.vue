<template>
  <div>
    <h1>Önskelistor</h1>
    <a
      href="/"
      v-if="this.activeUser"
      v-on:click="signOut()"
    >
      <img
        id="power"
        src="../assets/power.svg"
      />
      <button class="sign out">Logga ut</button>
    </a>
    <span v-else>
      <p>Du behöver <b>logga in</b> med ditt <b>Google-konto</b> för att kunna se och hantera <b>önskelistor</b>!</p>
      <button class="sign in">
        <a href="/auth/google">Logga in</a>
      </button>
    </span>
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
            <span
              v-bind:class="{active : activeUser === user.name}"
              v-on:click="activeUser === user.name ? edit(aWish) : null"
            >{{aWish.wish}}</span>
            <button
              class="round"
              v-if="user.name === activeUser"
              v-on:click="deleteWish(aWish.id)"
            >
              <img
                id="close"
                src="../assets/cross.svg"
              />
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
import { sortBy, capitalize } from "lodash";
import Form from "./Form.vue";
import Modal from "./Modal.vue";
export default {
  name: "Wishlist",
  data() {
    return {
      activeUser: this.$cookie.get("name"),
      newWish: ""
    };
  },
  components: {
    Form,
    Modal
  },
  computed: {
    placeholder: function() {
      return " Vad önskar du dig "
        .concat(capitalize(this.activeUser))
        .concat("?");
    },
    users: function() {
      return this.$store.state.users;
    },
    allWishes: function() {
      return this.$store.state.allWishes;
    }
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
    },
    deleteWish: async function(id) {
      const res = await fetch("/api/wishes/" + id, {
        method: "DELETE",
        credentials: "include"
      });
      const wishes = await res.json();
      this.$store.state.allWishes = wishes;
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
        this.$store.state.allWishes = wishes;
      }
    },
    edit: function(wish) {
      console.log("I am triggered");
      this.$modal.show(
        Modal,
        {
          wish: wish
        },
        {
          width: "100%",
          maxWidth: "300px",
          draggable: false,
          clickToClose: true,
          height: "auto"
        }
      );
    }
  },
  created: async function() {
    const res1 = await this.$http.get("/api/wishes", {
      credentials: "include"
    });
    this.$store.state.allWishes = res1.data;

    const res2 = await this.$http.get("/api/users", {
      credentials: "include"
    });
    this.$store.state.users = sortBy(res2.data, "id");
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
  font-size: 14px;
}

#power {
  position: absolute;
  cursor: pointer;
  right: 0.5em;
  top: 0.5em;
  height: 25px;
  width: 25px;
}

#close {
  height: 100%;
  width: 100%;
}

.out {
  display: none;
}

.in {
  font-size: 20px;
  margin-bottom: 1em;
  padding: 0.5em 2em;
}

.sign a {
  text-decoration: none;
  color: black;
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

.active {
  cursor: pointer;
}

.round {
  background-color: rgba(255, 255, 255, 0.8);
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
    width: 40%;
    max-width: 300px;
  }

  .user {
    width: 20%;
  }

  .out {
    display: initial;
    position: absolute;
    right: 0.5em;
    top: 0.5em;
  }

  #power {
    display: none;
  }
}
</style>
