const loading = require("./assets/loading.gif")
// const loading = require("./assets/img/logo.png")
const toTitleCase = (str) => {
    let sentence = str.toLowerCase().split(" ");
    for (var i = 0; i < sentence.length; i++) {
        sentence[i] = (sentence[i][0] !== undefined ? sentence[i][0].toUpperCase() : "") + sentence[i].slice(1);
    }
    return sentence.join(" ");
}
const Utils = {
    loading,
    toTitleCase
}
export default Utils
