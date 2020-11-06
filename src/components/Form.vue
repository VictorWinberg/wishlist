<template>
    <form v-on:submit="addWish" v-if="activeUser">
        <div class="welcome">{{ welcomeText }}</div>
        <input type="text" :placeholder="placeholder" v-model="newWish" />
        <input type="submit" value="Önska" />
    </form>
</template>

<script>
import { capitalize } from "lodash";
export default {
    data() {
        return {
            activeUser: this.$cookie.get("name"),
            newWish: "",
        };
    },
    computed: {
        placeholder() {
            return "Skriv din önskan här...";
        },
        welcomeText() {
            return " Hej "
                .concat(capitalize(this.activeUser))
                .concat(", vad önskar du dig?");
        },
    },
    methods: {
        addWish: async function (e) {
            e.preventDefault();
            if (this.newWish.replace(/ /g, "") != "") {
                const res = await fetch("/api/wishes/", {
                    method: "POST",
                    body: JSON.stringify({
                        wish: this.newWish,
                        name: this.activeUser,
                    }),
                    credentials: "include",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                });
                const wishes = await res.json();
                this.$store.state.allWishes = wishes;
                this.newWish = "";
            }
        },
    },
};
</script>

<style scoped>
form {
    margin-bottom: 3em;
}

.welcome {
    color: #515155;
    font-size: 20px;
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    margin: 0.5em;
}

input[type="text"] {
    width: calc(80% - 5em);
    height: 2em;
    padding: 0.5px 5px;
}

input[type="submit"] {
    margin-left: -10px;
    height: 2.4em;
    width: 5em;
    background: #515155;
    color: white;
    border: 0;
    text-transform: uppercase;
}

::placeholder {
    color: #999999;
}

@media (min-width: 900px) {
    input[type="text"] {
        max-width: 750px;
    }
}
</style>
