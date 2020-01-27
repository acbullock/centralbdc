const loading = require("./assets/loading.gif")
// const loading = require("./assets/img/logo.png")
const toTitleCase = (str) => {
    let sentence = str.toLowerCase().split(" ");
    for (var i = 0; i < sentence.length; i++) {
        sentence[i] = (sentence[i][0] !== undefined ? sentence[i][0].toUpperCase() : "") + sentence[i].slice(1);
    }
    return sentence.join(" ");
}
const toBuffer = (ab) => {
    var buf = Buffer.alloc(ab.byteLength);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        buf[i] = view[i];
    }
    return buf;
}
const toArrayBuffer = (buf) => {
    var ab = new ArrayBuffer(buf.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return ab;
}

const imageUrlFromBuffer = (fileBinary) => {
    var blob = new Blob([fileBinary], { type: "image/jpeg" });
    var urlCreator = window.URL || window.webkitURL;
    return urlCreator.createObjectURL(blob);
}
const Utils = {
    loading,
    toTitleCase,
    toBuffer,
    toArrayBuffer,
    imageUrlFromBuffer
}
export default Utils
