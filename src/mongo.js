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
// let db = mongodb.db("CentralBDC2");

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
    if (agent === "") {
        return;
    }
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
    if (agent === "") {
        return;
    }
    if (agent.userId === undefined) {
        await axios.post(`${SERVER_URL}/findOneAndUpdate`, { "collection": "dealership_users", "query": { email }, "update": { userId } }).catch((err) => { console.log(err) })
        // agent = Object.assign(agent, {userId})
        // await db.collection("agents").findOneAndUpdate({email}, agent)
    }
    return auth;
}

async function handleRemoveUser(email) {
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
async function aggregate(collection, pipeline, options) {
    let req_pipeline = pipeline || {}
    let req_options = options || {}
    let arr = await axios.post(`${SERVER_URL}/aggregate`, { "collection": collection, "pipeline": req_pipeline, options: req_options })
    return arr.data
}
async function find(collection, query, options) {
    let req_query = query || {}
    let req_options = options || {}
    let arr = await axios.post(`${SERVER_URL}/find`, { "collection": collection, "query": req_query, options: req_options })
    return arr.data
}
async function count(collection, query) {
    let req_query = query || {}
    let arr = await axios.post(`${SERVER_URL}/count`, { "collection": collection, "query": req_query })
    return arr.data
}

async function findOne(collection, query, options) {
    let req_options = options || {}
    let res = await axios.post(`${SERVER_URL}/findOne`, { "collection": collection, "query": query, "options": req_options })
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
async function iNeedARooftop(agent, rooftops) {
    let salesID = "5ddde79f1c9d4400008eb646"
    let serviceToSalesID = "5ddde7aa1c9d4400008eb648"
    console.log(agent.rooftopDepartment)
    if (agent.rooftopDepartment === salesID) {
        console.log("hey")
        //SALES BDC

        let sales_rooftops = rooftops[salesID]
        let sales_buckets = await this.findOne("buckets", { department: salesID })
        sales_buckets = sales_buckets.buckets

        let sales_history = await this.find("rooftop_history", { department: salesID, startTime: { "$gte": new Date(new Date().setHours(0, 0, 0, 0)).toISOString() } })
        //close out any rooftops still open by current agent..
        let open = await sales_history.filter((sh) => {
            return sh.agent === agent._id && !sh.endTime
        })
        for (let o in open) {
            let end = new Date().toISOString()
            let timeSpentMinutes = new Date(end).getTime() - new Date(open[0].startTime).getTime()
            timeSpentMinutes = Math.round(10 * (timeSpentMinutes / (1000 * 60))) / 10
            let appointmentCount = await this.count("all_appointments", {
                agent_id: agent._id,
                verified: {
                    "$gte": open[o].startTime,
                    "$lte": end,
                }
            })
            appointmentCount = appointmentCount.count
            await this.findOneAndUpdate("rooftop_history", open[o], {
                endTime: end,
                timeSpentMinutes,
                appointmentCount
            })
        }
        console.log(sales_rooftops)
        //filter out rooftops that aren't open currently
        //
        let now = new Date()
        let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        let today = days[now.getDay()]
        sales_rooftops = await sales_rooftops.filter((top) => {
            //make sure dealer not closed today..
            if (top.dealership.salesHours[top.dealership.salesHours.findIndex((d) => { return d.day === today })].isClosed === true) {
                console.log(top.dealership.label, "closed")
                return false
            }
            let storeOpen = top.dealership.salesHours[top.dealership.salesHours.findIndex((d) => { return d.day === today })].open
            storeOpen = new Date(new Date().setHours(new Date(storeOpen).getHours() - top.dealership.timezoneOffset, new Date(storeOpen).getMinutes()))
            let storeClose = top.dealership.salesHours[top.dealership.salesHours.findIndex((d) => { return d.day === today })].close
            storeClose = new Date(new Date().setHours(new Date(storeClose).getHours() - top.dealership.timezoneOffset, new Date(storeClose).getMinutes()))

            //see if store not open yet
            // if (new Date(now).getTime() < new Date(storeOpen).getTime()) {
            //     return false;
            // }
            //see if store is already closed..
            if (new Date(now).getTime() >= new Date(new Date().setHours(new Date(storeClose).getHours(), new Date(storeClose).getMinutes(), 0, 0)).getTime()) {
                return false;
            }
            return true
        })
        
        //

        // see if next up is available..
        //filter out roofs that already hit goal..
        sales_rooftops = await sales_rooftops.filter((a) => {
            return a.dealership.projectedDistanceFromGoal > 0
        })
        //filter out roofs already in history..
        sales_rooftops = await sales_rooftops.filter((s) => {
            // console.log(s)
            let found = sales_history.findIndex(((hist) => {
                return hist.dealership === s.dealership.value &&
                    hist.bucket === s.bucket
            }))
            return found === -1
        })
        //filter out roofs that dont match agent's skills..
        sales_rooftops = await sales_rooftops.filter((s) => {
            if (agent.skills.sales.newLeads !== true && s.bucket === "New Leads") {
                return false;
            }
            if (agent.skills.sales.day1And2 !== true && s.bucket.indexOf("Day 1 & 2") !== -1) {
                return false;
            }
            if (agent.skills.sales.day3And4 !== true && s.bucket.indexOf("Day 3 & 4") !== -1) {
                return false;
            }
            if (agent.skills.sales.day1 !== true && s.bucket === "Day 1") {
                return false;
            }
            if (agent.skills.sales.day7 !== true && s.bucket === "Day 7") {
                return false;
            }
            if (agent.skills.sales.day10 !== true && s.bucket === "Day 10") {

                return false;
            }
            if (agent.skills.sales.day15 !== true && s.bucket === "Day 15") {

                return false;
            }
            if (agent.skills.sales.day20 !== true && s.bucket === "Day 20") {
                return false;
            }
            if (agent.skills.sales.missedAppointments !== true && s.bucket === "Missed Appointments") {
                return false;
            }
            return true;
        })
        console.log(agent.skills, sales_rooftops, sales_buckets)
        //loop thru high prio buckets
        for (let i = 0; i < 3; i++) {
            if (agent.skills.sales.newLeads !== true && i == 0) {
                continue;
            }
            if (agent.skills.sales.day1And2 !== true && i == 1) {
                continue;
            }
            if (agent.skills.sales.day3And4 !== true && i == 2) {
                continue;
            }
            //if available.. grab next up
            let matched = await sales_rooftops.filter((sr) => {
                return sr.bucket === sales_buckets[i]
            })
            if (matched.length > 0) {
                return matched[0]
            }
        }


        //if all high prios are filled/met goal already..
        // find 5 most struggling dealers
        let top5 = await sales_rooftops.filter((a, i) => {
            return i < 5
        })
        //rank agents dealers (based off lifetime appt history)
        let agentHistory = await this.aggregate("all_appointments", [
            {
                "$match": {
                    agent_id: agent._id
                }
            },
            {
                "$group": {
                    "_id": "$dealership",
                    "count": { "$sum": 1 }
                }
            },
            {
                "$sort": {
                    "count": -1
                }
            }
        ])
        //pick one of 5 thats highest on agents dealer list..
        let min = 100000;
        for (let i in top5) {
            let index = agentHistory.findIndex((ah) => {
                return ah._id === top5[i].dealership.value
            })
            if (index !== -1 && index < min) {
                min = index;
            }
        }

        //if history and available rooftops have no overlap.. put them in first avail rooftop..
        if (min === 100000) {
            return sales_rooftops[0]
        }
        else {

            let dealership = agentHistory[min]._id
            for (let s in sales_rooftops) {
                if (sales_rooftops[s].dealership.value === dealership) {
                    return sales_rooftops[s]
                }
            }
            return false;
        }
        
    }

    //SERVICE TO SALES & DATAMINING
    if (agent.rooftopDepartment === serviceToSalesID) {
        let serviceToSalesRooftops = rooftops[serviceToSalesID]
        let serviceToSales_buckets = await this.findOne("buckets", { department: serviceToSalesID })
        serviceToSales_buckets = serviceToSales_buckets.buckets
        let serviceToSales_history = await this.find("rooftop_history", { department: serviceToSalesID, startTime: { "$gte": new Date(new Date().setHours(0, 0, 0, 0)).toISOString() } })
        //close out any rooftops still open by current agent..
        let open = await serviceToSales_history.filter((sh) => {
            return sh.agent === agent._id && !sh.endTime
        })
        for (let o in open) {
            let end = new Date().toISOString()
            let timeSpentMinutes = new Date(end).getTime() - new Date(open[0].startTime).getTime()
            timeSpentMinutes = Math.round(10 * (timeSpentMinutes / (1000 * 60))) / 10
            let appointmentCount = await this.count("all_appointments", {
                agent_id: agent._id,
                verified: {
                    "$gte": open[o].startTime,
                    "$lte": end,
                }
            })
            appointmentCount = appointmentCount.count
            await this.findOneAndUpdate("rooftop_history", open[o], {
                endTime: end,
                timeSpentMinutes,
                appointmentCount
            })
        }

        //filter out rooftops that aren't open currently
        //
        let now = new Date()
        let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        let today = days[now.getDay()]
        serviceToSalesRooftops = await serviceToSalesRooftops.filter((top) => {
            //make sure dealer not closed today..
            if (top.dealership.salesHours[top.dealership.salesHours.findIndex((d) => { return d.day === today })].isClosed === true) {
                console.log(top.dealership.label, "closed")
                return false
            }
            let storeOpen = top.dealership.salesHours[top.dealership.salesHours.findIndex((d) => { return d.day === today })].open
            storeOpen = new Date(new Date().setHours(new Date(storeOpen).getHours() - top.dealership.timezoneOffset, new Date(storeOpen).getMinutes()))
            let storeClose = top.dealership.salesHours[top.dealership.salesHours.findIndex((d) => { return d.day === today })].close
            storeClose = new Date(new Date().setHours(new Date(storeClose).getHours() - top.dealership.timezoneOffset, new Date(storeClose).getMinutes()))

            //see if store not open yet
            // if (new Date(now).getTime() < new Date(storeOpen).getTime()) {
            //     return false;
            // }
            //see if store is already closed..
            if (new Date(now).getTime() >= new Date(new Date().setHours(new Date(storeClose).getHours(), new Date(storeClose).getMinutes(), 0, 0)).getTime()) {
                return false;
            }
            return true
        })


        //
        // see if next up is available..

        //filter out roofs that already hit goal..
        serviceToSalesRooftops = await serviceToSalesRooftops.filter((a) => {
            return a.dealership.projectedDistanceFromGoal > 0
        })
        //filter out roofs already in history..
        serviceToSalesRooftops = await serviceToSalesRooftops.filter((s) => {
            // console.log(s)
            let found = serviceToSales_history.findIndex(((hist) => {
                return hist.dealership === s.dealership.value &&
                    hist.bucket === s.bucket
            }))
            return found === -1
        })
        //filter out roofs that dont match agent's skills..
        serviceToSalesRooftops = await serviceToSalesRooftops.filter((s) => {
            if (agent.skills.serviceToSales.serviceDriveRd1 !== true && s.bucket === "Round 1") {
                return false;
            }
            if (agent.skills.serviceToSales.serviceDriveRd2 !== true && s.bucket === "Round 2") {
                return false;
            }
            if (agent.skills.serviceToSales.dataMiningHighInterest !== true && s.bucket === "Data-Mining High Interest") {
                return false;
            }
            if (agent.skills.serviceToSales.dataMiningLeases !== true && s.bucket === "Data-Mining Lease") {
                return false;
            }
            if (agent.skills.serviceToSales.serviceDriveRd3 !== true && s.bucket === "Round 3") {
                return false;
            }
            return true;
        })

        //loop thru high prio buckets
        for (let i = 0; i < 2; i++) {
            if (agent.skills.serviceToSales.serviceDriveRd1 !== true && i == 0) {
                continue;
            }
            if (agent.skills.serviceToSales.serviceDriveRd2 !== true && i == 1) {
                continue;
            }
            //if available.. grab next up
            let matched = await serviceToSalesRooftops.filter((sr) => {
                return sr.bucket === serviceToSales_buckets[i]
            })
            if (matched.length > 0) {
                return matched[0]
            }
        }
        //if all high prios are filled/met goal already..
        // find 5 most struggling dealers
        let top5 = await serviceToSalesRooftops.filter((a, i) => {
            return i < 5
        })
        //rank agents dealers (based off lifetime appt history)
        let agentHistory = await this.aggregate("all_appointments", [
            {
                "$match": {
                    agent_id: agent._id
                }
            },
            {
                "$group": {
                    "_id": "$dealership",
                    "count": { "$sum": 1 }
                }
            },
            {
                "$sort": {
                    "count": -1
                }
            }
        ])
        //pick one of 5 thats highest on agents dealer list..
        let min = 100000;
        for (let i in top5) {
            let index = agentHistory.findIndex((ah) => {
                return ah._id === top5[i].dealership.value
            })
            if (index !== -1 && index < min) {
                min = index;
            }
        }

        //if history and available rooftops have no overlap.. put them in first avail rooftop..
        //if its before 2pm, prevent data-mining..
        if (min === 100000) {
            let index = 0;
            if (new Date().getHours() < 14) {
                while (serviceToSalesRooftops[index].bucket.toLowerCase().indexOf("data-mining") !== -1) {
                    index++;
                    if (index >= serviceToSalesRooftops.length) { break; }
                }
            }

            return serviceToSalesRooftops[index]
        }
        else {

            let dealership = agentHistory[min]._id
            for (let s in serviceToSalesRooftops) {
                if (serviceToSalesRooftops[s].dealership.value === dealership) {
                    if (new Date().getHours() < 14 && (serviceToSalesRooftops[s].bucket.toLowerCase().indexOf("data-mining") !== -1)) {
                        continue;
                    }
                    return serviceToSalesRooftops[s]
                }
            }
            return false;
        }
    }

    return null
}
const decodeVIN = async (vin) => {
    let resp = await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${vin}?format=json`)
    return resp.data
}
const getAllMakes = async () => {
    let resp = await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/GetAllMakes?format=json`)
    return resp.data
}
const getModelsForMake = async (make) => {
    let resp = await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${make.toLowerCase()}?format=json`)
    return resp.data
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
    aggregate,
    find,
    findOne,
    findOneAndUpdate,
    findOneAndDelete,
    insertOne,
    count,
    sendGroupText,
    getToken,
    handlePasswordReset,
    callsForMonth,
    iNeedARooftop,
    decodeVIN,
    getAllMakes,
    getModelsForMake
}
