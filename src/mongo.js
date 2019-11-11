import {
    Stitch,
    UserPasswordCredential,
    UserPasswordAuthProviderClient,
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
    let {userId} = await this.getActiveUser(mongodb);
    let agent = await db.collection("agents").findOne({email});
    if(agent.userId === undefined){
        agent = Object.assign(agent, {userId})
        await db.collection("agents").findOneAndUpdate({email}, agent)
    }
    return auth;
}
async function handleRemoveUser(email){
    let agents = await this.getCollection("agents")
    await agents.findOneAndDelete({email})
        console.log("delete done")
}
async function handleRegister(email, password){
    const emailPasswordClient = Stitch.defaultAppClient.auth
    .getProviderClient(UserPasswordAuthProviderClient.factory);

    let result = await emailPasswordClient.registerWithEmail(email, password)
    return result
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
    getActiveUser,
    handleRegister,
    handleRemoveUser
}
