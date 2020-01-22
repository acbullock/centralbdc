import {
    Stitch,
    UserPasswordCredential,
    UserPasswordAuthProviderClient,
    RemoteMongoClient
} from "mongodb-stitch-browser-sdk";
import axios from "axios"
// Initialize the App Client
let client = Stitch.initializeDefaultAppClient("centralbdc-bwpmi");
// Get a MongoDB Service Client
// This is used for logging in and communicating with Stitch
let mongodb = client.getServiceClient(
    RemoteMongoClient.factory,
    "mongodb-atlas"
);
let db = mongodb.db("CentralBDC2");

let SERVER_URL = "https://guarded-castle-33109.herokuapp.com"
// let SERVER_URL = "http://localhost:3001"
// let db = mongodb.db("CentralBDC2");

// async function getCollection(name){
//     const collection = await db.collection(name);
//     return collection;
// }

async function handleLogin(email, password) {
    const credential = new UserPasswordCredential(email, password);
    let auth = await client.auth.loginWithCredential(credential);
    let { userId } = await this.getActiveUser(mongodb);
    // let agent = await db.collection("agents").findOne({email});
    let agent = await axios.post(`${SERVER_URL}/findOne`, { "collection": "agents", "query": { email } }).catch((err) => { console.log(err) })
    agent = agent.data
    if (agent.userId === undefined) {
        await axios.post(`${SERVER_URL}/findOneAndUpdate`, { "collection": "agents", "query": { email }, "update": { userId } }).catch((err) => { console.log(err) })
        // agent = Object.assign(agent, {userId})
        // await db.collection("agents").findOneAndUpdate({email}, agent)
    }
    return auth;
}
async function handleDealerLogin(email, password) {
    const credential = new UserPasswordCredential(email, password);
    let auth = await client.auth.loginWithCredential(credential);
    let { userId } = await this.getActiveUser(mongodb);
    // let agent = await db.collection("agents").findOne({email});
    let agent = await axios.post(`${SERVER_URL}/findOne`, { "collection": "dealership_users", "query": { email } }).catch((err) => { console.log(err) })
    agent = agent.data
    if (agent.userId === undefined) {
        await axios.post(`${SERVER_URL}/findOneAndUpdate`, { "collection": "dealership_users", "query": { email }, "update": { userId } }).catch((err) => { console.log(err) })
        // agent = Object.assign(agent, {userId})
        // await db.collection("agents").findOneAndUpdate({email}, agent)
    }
    return auth;
}

async function handleRemoveUser(email) {
    let agents = await this.getCollection("agents")
    await axios.post(`${SERVER_URL}/findOneAndDelete`, { "collection": "agents", "query": { email } }).catch((err) => console.log(err))
    // await agents.findOneAndDelete({email})
    console.log("delete done")
}
async function handleRegister(email, password) {
    const emailPasswordClient = Stitch.defaultAppClient.auth
        .getProviderClient(UserPasswordAuthProviderClient.factory);

    let result = await emailPasswordClient.registerWithEmail(email, password)
    return result
}

function getActiveUser(mongodb) {
    return mongodb.proxy.service.requestClient.activeUserAuthInfo;
}

async function handleLogout(client) {
    let auth = await client.auth.logout();
    return auth;
}

async function find(collection, query) {
    let req_query = query || {}
    let arr = await axios.post(`${SERVER_URL}/find`, { "collection": collection, "query": req_query })
    return arr.data
}

async function findOne(collection, query) {
    let res = await axios.post(`${SERVER_URL}/findOne`, { "collection": collection, "query": query })
    return res.data
}

async function findOneAndUpdate(collection, query, update) {
    let res = await axios.post(`${SERVER_URL}/findOneAndUpdate`, { "collection": collection, "query": query, "update": update })
    return res.data
}
async function insertOne(collection, newObject) {
    let res = await axios.post(`${SERVER_URL}/insertOne`, { "collection": collection, "item": newObject })
    return res.data
}
async function findOneAndDelete(collection, query) {
    let res = await axios.post(`${SERVER_URL}/findOneAndDelete`, { "collection": collection, "query": query })
    return res.data
}
function sendGroupText(fromNumber, text, toNumber, token) {
    return axios.post(`${SERVER_URL}/sendGroupText?toNumber=${toNumber}&fromNumber=${fromNumber}&token=${token}`, {
        text
    })
}
async function getToken() {
    // let token = await axios.post(`${SERVER_URL}/getToken`, {
    // })
    // return token.data
    let utils = await this.find("utils")
    return utils[0].ring_central_token
}
async function handlePasswordReset(email) {
    // let agent = await this.findOne("agents", {email: email})
    const emailPassClient = Stitch.defaultAppClient.auth
        .getProviderClient(UserPasswordAuthProviderClient.factory);

    let reset = await emailPassClient.sendResetPasswordEmail(email)
    return reset
}
async function callsForMonth(token, month, year, phoneNumber, page) {
    let result = await axios.get(`${SERVER_URL}/callsForMonth?access_token=${token}&month=${month}&year=${year}&phoneNumber=${phoneNumber}&page=${page}`);
    return result.data;
}
export default {
    client,
    mongodb,
    // db,
    // getCollection,
    handleLogin,
    handleDealerLogin,
    handleLogout,
    getActiveUser,
    handleRegister,
    handleRemoveUser,
    find,
    findOne,
    findOneAndUpdate,
    findOneAndDelete,
    insertOne,
    sendGroupText,
    getToken,
    handlePasswordReset,
    callsForMonth,
}
