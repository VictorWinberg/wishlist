<template>
    <main>
        <div class="closeBtn" v-on:click="close()">
            <img id="close" src="../assets/cross.svg" />
        </div>
        <h1>Hantera önskning</h1>
        <form>
            <input type="text" ref="input" v-model="editWish" />
            <div class="btns">
                <div class="button remove" v-on:click="remove()">
                    <div class="button-text">ta bort</div>
                    <img class="icon remove-icon" src="../assets/delete.svg" />
                </div>
                <div class="button save" v-on:click="save()">
                    <div class="button-text">spara</div>
                    <img class="icon save-icon" src="../assets/save.svg" />
                </div>
            </div>
        </form>
    </main>
</template>

<script>
export default {
    name: "Modal",
    props: ["wish"],
    data() {
        return {
            editWish: this.wish.wish,
        };
    },
    methods: {
        close: function () {
            this.$emit("close");
        },
        save: async function () {
            const res = await fetch("/api/wishes/" + this.wish.id, {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({
                    wish: this.editWish,
                }),
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            });
            const wishes = await res.json();
            this.$store.state.allWishes = wishes;
            this.close();
        },
        remove: async function () {
            const res = await fetch("/api/wishes/" + this.wish.id, {
                method: "DELETE",
                credentials: "include",
            });
            const wishes = await res.json();
            this.$store.state.allWishes = wishes;
            this.close();
        },
    },
    mounted: function () {
        this.$refs.input.focus();
    },
};
</script>

<style scoped>
main {
    padding: 2em 1em;
}

.closeBtn {
    position: absolute;
    top: 0.25em;
    right: 0.25em;
    border: solid black 1px;
    border-radius: 50%;
    height: 40px;
    width: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
}

#close {
    height: 20px;
    width: 20px;
}

h1 {
    text-align: center;
    font-size: 1.5em;
    margin: 0;
}

.btns {
    display: flex;
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

.button:focus {
    outline-color: #4db3ff;
}

.button {
    display: flex;
    flex: 1;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(32, 160, 255, 0.3);
    border: solid 2px;
    font-weight: 600;
    border-radius: 3px;
}

.button-text {
    flex: 1;
    text-align: center;
    text-transform: uppercase;
    color: #000;
    display: flex;
    justify-content: center;
    align-items: center;
}

.save {
    margin-left: 0.5em;
}

.save {
    margin-left: 0.5em;
    border-color: #2ecc40;
}

.remove {
    border-color: #ff4136;
}

.icon.remove-icon {
    height: 20px;
    width: 20px;
    padding: 10px;
    background-color: #ff4136cc;
}

.icon.save-icon {
    height: 20px;
    width: 20px;
    padding: 10px;
    background-color: #2ecc40cc;
}
</style>
