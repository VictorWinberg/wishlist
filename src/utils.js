module.exports = {
    getImage(name) {
        return require.context(
            "./assets/",
            true,
            /$/
        )("./" + name + ".jpg");
    }
};