import {
    Stitch,
    UserPasswordCredential,
    RemoteMongoClient
  } from "mongodb-stitch-browser-sdk";

// Initialize the App Client
let client = Stitch.initializeDefaultAppClient("centralbdc-bwpmi");
// Get a MongoDB Service Client
// This is used for logging in and communicating with Stitch
let mongodb = client.getServiceClient(
    RemoteMongoClient.factory,
    "mongodb-atlas"
);
let db = mongodb.db("CentralBDC");

async function getCollection(name){
    const collection = await db.collection(name);
    return collection;
}

async function handleLogin(email, password){
    const credential = new UserPasswordCredential(email, password);
    let auth = await client.auth.loginWithCredential(credential);
    return auth;
}
function getActiveUser(mongodb){
    return mongodb.proxy.service.requestClient.activeUserAuthInfo;
}
async function handleLogout(client){
    let auth = await client.auth.logout();
    return auth;
}
export default {
    client,
    mongodb,
    db,
    getCollection,
    handleLogin,
    handleLogout,
    getActiveUser
}
