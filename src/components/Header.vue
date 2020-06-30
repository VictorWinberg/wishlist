<template>
    <div>
        <h1>Önskelistor</h1>
        <a href="/" v-if="this.activeUser" v-on:click="signOut()">
            <img id="power" src="../assets/power.svg" />
            <button class="sign out">Logga ut</button>
        </a>
        <span v-else>
            <p>
                Du behöver <b>logga in</b> med ditt <b>Google-konto</b> för att
                kunna se och hantera <b>önskelistor</b>!
            </p>
            <button class="sign in">
                <a href="/auth/google">Logga in</a>
            </button>
        </span>
    </div>
</template>

<script>
export default {
    data() {
        return {
            activeUser: this.$cookie.get("name")
        };
    },
    methods: {
        signOut: function() {
            activeUser: this.$cookie.delete("name");
        }
    }
};
</script>

<style scoped>
p {
    margin: 0.5em;
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

.out {
    display: none;
}

.in {
    font-size: 20px;
    margin-bottom: 1em;
    padding: 0.5em 2em;
    border: solid black 1px;
    border-radius: 10px;
}

.sign a {
    text-decoration: none;
    color: black;
}

@media (min-width: 900px) {
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
