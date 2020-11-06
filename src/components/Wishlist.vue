<template>
    <main id="main">
        <div
            v-for="user in users"
            :key="user.name"
            :id="user.name"
            class="user"
        >
            <img v-if="true" class="photo" :src="getImage(user.name)" />
            <h2>{{ user.name }}</h2>
            <ul v-if="activeUser">
                <li
                    v-for="aWish in getUserWishes(user.name)"
                    v-bind:key="aWish.id"
                    v-on:click="activeUser === user.name ? edit(aWish) : null"
                >
                    <span v-bind:class="{ active: activeUser === user.name }">
                        {{ aWish.wish }}
                    </span>
                    <button class="round edit" v-if="user.name === activeUser">
                        <img id="close" src="../assets/edit.svg" />
                    </button>
                    <button
                        class="round"
                        v-else
                        v-on:click="buyWish(aWish)"
                        v-bind:class="{
                            unavailable: aWish.bought,
                            available: !aWish.bought,
                        }"
                    >
                        <span v-if="aWish.bought">
                            {{ aWish.buyer.charAt(0) }}
                        </span>
                    </button>
                </li>
                <li v-if="getUserWishes(user.name).length == 0">
                    <span class="no-wishes">Inga önskningar ännu!</span>
                </li>
            </ul>
        </div>
    </main>
</template>

<script>
import { sortBy } from "lodash";
import EditDialog from "./EditDialog.vue";
const utils = require("../utils");

export default {
    name: "Wishlist",
    data() {
        return {
            activeUser: this.$cookie.get("name"),
        };
    },
    components: {
        EditDialog,
    },
    computed: {
        users: function () {
            return this.$store.state.users;
        },
        allWishes: function () {
            return this.$store.state.allWishes;
        },
    },
    methods: {
        getImage(name) {
            return utils.getImage(name);
        },
        getUserWishes: function (name) {
            var userWishes = [];
            this.allWishes.forEach((wish) => {
                if (wish.name === name) {
                    userWishes.push(wish);
                }
            });
            return sortBy(userWishes, "id");
        },
        buyWish: async function (wish) {
            console.log("BUY");
            if (!wish.bought || wish.buyer === this.activeUser) {
                const res = await fetch("/api/wishes/" + wish.id, {
                    method: "POST",
                    credentials: "include",
                    body: JSON.stringify({
                        bought: !wish.bought,
                        buyer: !wish.bought ? this.activeUser : "",
                    }),
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                });
                const wishes = await res.json();
                this.$store.state.allWishes = wishes;
            }
        },
        edit: function (wish) {
            this.$modal.show(
                EditDialog,
                {
                    wish: wish,
                },
                {
                    width: "100%",
                    draggable: false,
                    clickToClose: true,
                    height: "auto",
                }
            );
        },
    },
    created: async function () {
        const res_wishes = await this.$http.get("/api/wishes", {
            credentials: "include",
        });
        this.$store.state.allWishes = res_wishes.data;

        const res_users = await this.$http.get("/api/users", {
            credentials: "include",
        });
        this.$store.state.users = sortBy(res_users.data, "id");
    },
};
</script>

<style scoped>
main {
    margin-top: 2em;
}

h2 {
    text-transform: capitalize;
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
    padding: 0.5em;
    clear: both;
    overflow: hidden;
    font-size: 18px;
    display: flex;
}

span {
    flex: 1;
}

.no-wishes {
    text-align: center;
}

#close {
    height: 100%;
    width: 100%;
}

.active {
    border-bottom: dotted rgba(0, 0, 0, 0.2) 2px;
}

.round {
    /* background-color: rgba(255, 255, 255, 0.8); */
    text-transform: uppercase;
    border: solid 1px black;
    border-radius: 100%;
    font-weight: bold;
    font-size: 18px;
    height: 2em;
    width: 2em;
    outline: none;
}

.edit {
    background: transparent;
    border: none;
    cursor: pointer;
}

.available {
    background-color: #01ff70;
}

.unavailable {
    background-color: orangered;
}

.user {
    position: relative;
    padding-top: 4em;
    padding-bottom: 2em;
}

#ludwig {
    background-color: #001f3f;
    color: hsla(210, 100%, 75%, 1);
}

#ludwig .active {
    border-bottom: dotted rgba(255, 255, 255, 0.2) 2px;
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

.photo {
    width: 5em;
    border-radius: 50%;
    position: absolute;
    top: -1.5em;
    left: calc(50% - 2.5em);
    filter: saturate(0.5);
    transition: all 1s;
    transform: scale(1);
}

.animate {
    transform: scale(0);
}

@media (min-width: 900px) {
    main {
        display: flex;
    }

    .user {
        width: 20%;
    }
}
</style>
