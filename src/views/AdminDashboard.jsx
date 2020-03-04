/*!

=========================================================
* Black Dashboard PRO React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-pro-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import axios from "axios"
// react plugin used to create charts
import { Bar, Pie } from "react-chartjs-2";
// reactstrap components
import {
    Button,
    Card,
    CardImg,
    Container,
    Label,
    CardBody,
    CardHeader,
    CardTitle,
    Table,
    Row,
    Col,
} from "reactstrap";
import Select from "react-select"
class AdminDashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            agents: [],
            all_appointments: [],
            last_appts: [],
            dealerships: [],
            lifetime_appts: 0,
            month_appts: 0,
            today_appts: 0,
            projected_today: 0,
            projected_month: 0,
            top10: [],
            selected_agent: {
                label: "",
                value: ""
            },
            agent_top_5: [],
            total: [],
            top10Loading: false,
            lastAppsLoading: false,
            agent5Loading: false,
            agent_recent_call: { label: "", value: "" },
            token: "",
            latestLoading: false,
            selected_dlr: { label: "", value: "" },
            dlrtop5loading: false,
            dlrTop5: [],
            monthLabels: [],
            monthData: [],
            hourlyLabels: [],
            hourlyData: [],
            followupLabels: [],
            followupData: [],
            followupByAgent: [],
            followupColors: ["white", "black"]
        };
        this.sortLastAppts = this.sortLastAppts.bind(this);
        this.getTodayAppts = this.getTodayAppts.bind(this);
        this.getTop10 = this.getTop10.bind(this);
        this.getAgentTop5 = this.getAgentTop5.bind(this)
        this.getDealerTop5 = this.getDealerTop5.bind(this)
        this.getMonthChart = this.getMonthChart.bind(this)
        this.getHourlyApps = this.getHourlyApps.bind(this)
        this.getFollowupChart = this.getFollowupChart.bind(this)
    }
    _isMounted = false;
    async getFollowupChart(todayAsst) {

        let labels = [];
        let data = []
        let today = new Date(new Date().setHours(0, 0, 0, 0))
        todayAsst = todayAsst.filter((a) => {
            return new Date(a.created).getTime() >= new Date(today).getTime()
        })

        for (let i = 0; i < 12; i++) {
            let startHour = new Date().getHours() - i
            let endHour = new Date().getHours() - i + 1

            let startDate = new Date(new Date().setHours(startHour, 0, 0, 0))
            let endDate = new Date(new Date().setHours(endHour, 0, 0, 0, 0))
            let curTotal = todayAsst.filter((a) => {
                return new Date(a.created).getTime() >= startDate.getTime() &&
                    new Date(a.created).getTime() < endDate.getTime()
            })
            labels[11 - i] = startDate.toLocaleTimeString('en-US', { hour: '2-digit' }) + "-" + endDate.toLocaleTimeString('en-US', { hour: '2-digit' })
            data[11 - i] = curTotal.length
        }

        let dict = {}
        for (let a in todayAsst) {
            if (dict[todayAsst[a].userId] === undefined) {
                dict[todayAsst[a].userId] = 1;
            }
            else {
                dict[todayAsst[a].userId]++
            }
        }

        let sortable = []
        for (let a in dict) {
            let name = await this.props.mongo.findOne("agents", { userId: a }, { projection: { name: 1 } })
            sortable.push({ agent: name.name, count: dict[a] })
        }

        let colors = []
        for (let a in sortable) {
            colors.push('#' + Math.floor(Math.random() * 16777215).toString(16));
        }

        this.setState({ followupLabels: labels, followupData: data, followupByAgent: sortable, followupColors: colors })

    }
    async getMonthChart() {
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        let labels = []
        let data = []
        let todayApps = await this.props.mongo.find("all_appointments", { dealership_department: {"$ne": "Service"}, verified: { "$gte": new Date(new Date().setHours(0, 0, 0, 0)).toISOString() } }, { projection: { verified: 1 } })
        let todayAsst = []
        for (let a in this.state.agents) {
            todayAsst = this._isMounted && await todayAsst.concat(this.state.agents[a].assistance)
        }
        for (let i = 0; i < 6; i++) {
            let curMonth = new Date(new Date(new Date(new Date().setDate(1)).setHours(0, 0, 0, 0)).setMonth(new Date().getMonth() - i))
            let nextMonth = new Date(new Date(new Date(new Date().setDate(1)).setHours(0, 0, 0, 0)).setMonth(new Date().getMonth() - (i - 1)))
            labels[5 - i] = months[curMonth.getMonth()]
            let curApps = await this.props.mongo.count("all_appointments", {
                "dealership_department": { "$ne": "Service" },
                "verified": {
                    "$gte": curMonth.toISOString(),
                    "$lt": nextMonth.toISOString(),
                }
            })
            data[5 - i] = curApps.count;
        }

        this.setState({ monthLabels: labels, monthData: data })
        this.getHourlyApps(todayApps)
        this.getFollowupChart(todayAsst)
    }
    async getHourlyApps(todayApps) {
        let labels = [];
        let data = []
        for (let i = 0; i < 12; i++) {
            let startHour = new Date().getHours() - i
            let endHour = new Date().getHours() - i + 1

            let startDate = new Date(new Date().setHours(startHour, 0, 0, 0))
            let endDate = new Date(new Date().setHours(endHour, 0, 0, 0, 0))
            let curTotal = todayApps.filter((a) => {
                return new Date(a.verified).getTime() >= startDate.getTime() &&
                    new Date(a.verified).getTime() < endDate.getTime()
            })
            labels[11 - i] = startDate.toLocaleTimeString('en-US', { hour: '2-digit' }) + "-" + endDate.toLocaleTimeString('en-US', { hour: '2-digit' })
            data[11 - i] = curTotal.length
        }
        this.setState({ hourlyLabels: labels, hourlyData: data })
    }
    async componentWillMount() {
        if (this.props.agent.account_type !== "admin") {
            this._isMounted && this.props.history.push("/admin/dashboard")
            return;
        }
    }
    async componentDidMount() {
        this._isMounted = true;
        this._isMounted && this.setState({ loading: true });


        let dealerships = this._isMounted && await this.props.mongo.find("dealerships", { isActive: true, isSales: true }, { projection: { label: 1, value: 1, isActive: 1 } });
        let agents = this._isMounted && await this.props.mongo.find("agents", { isActive: true, department: "sales" }, { projection: { "assistance.created": 1, "assistance.userId": 1, account_type: 1, callCountLastUpdated: 1, extension: 1, lastCall: 1, "appointments.agent_id": 1, "appointments.value": 1, "appointments.verified": 1, "appointments.dealership": 1, name: 1 } })
        for (let a in agents) {
            agents[a].label = agents[a].name;
            agents[a].value = agents[a]._id
        }
        // //do this with aggregation..
        this._isMounted && agents.sort((a, b) => {
            if (a.name > b.name) return 1;
            if (a.name < b.name) return -1;
            return 0;
        })
        this._isMounted && await this.setState({ dealerships, agents });
        this._isMounted && this.getTodayAppts();
        this._isMounted && this.sortLastAppts();
        this._isMounted && await this.getTop10();
        this._isMounted && this.getMonthChart()
        // }



        this._isMounted && this.setState({ loading: false, agent: this.props.agent });
    }
    componentWillUnmount() {
        this._isMounted = false
    }
    async sortLastAppts() {
        this._isMounted && this.setState({ lastAppsLoading: true })
        let dealerships = await this.props.mongo.find("dealerships", {
            isActive: true,
            isSales: true
        }, {
            projection: {
                "label": 1,
                value: 1,
                goal: 1
            }
        })
        let groupedApps = await this.props.mongo.aggregate("all_appointments", [
            {
                "$project": {
                    "dealership": 1,
                    "verified": 1
                }
            },
            {
                "$sort": {
                    "dealership": 1, "verified": -1
                }
            },
            {
                "$group": {
                    "_id": "$dealership",
                    "recent": { "$first": "$verified" }
                }
            },
            {
                "$sort": {
                    "recent": 1
                }
            }
        ])
        let last_appts = []
        for (let a in groupedApps) {
            let index = dealerships.findIndex((d) => {
                return d.value === groupedApps[a]._id
            })
            if (index === -1) continue;
            let obj = {
                name: dealerships[index].label,
                dealership: groupedApps[a]._id,
                goal: dealerships[index].goal,
                time_elapsed_hrs: Math.round(10 * ((new Date().getTime() - new Date(groupedApps[a].recent).getTime()) / (1000 * 60 * 60))) / 10
            }
            last_appts.push(obj)
        }

        this._isMounted && await this.setState({ last_appts, lastAppsLoading: false })
    }
    async getTodayAppts() {
        let today = new Date();
        today = new Date(today.setHours(8, 0, 0, 0))
        let now = new Date();
        let elapsed = now.getTime() - today.getTime();
        elapsed /= (1000 * 60 * 60)

        let hrs = now.getDay() === 0 ? 8 : 12
        let days = now.getDate()
        let lifetime_appts = this._isMounted && await this.props.mongo.count("all_appointments", {})
        let month_appts = this._isMounted && await this.props.mongo.count("all_appointments", {
            "dealership_department": { "$ne": "Service" },
            verified: {
                "$gte": new Date(new Date(new Date().setDate(1)).setHours(0, 0, 0, 0)).toISOString()
            }
        })
        month_appts = month_appts.count
        let today_appts = this._isMounted && await this.props.mongo.count("all_appointments", {
            "dealership_department": { "$ne": "Service" },
            verified: {
                "$gte": new Date(new Date().setHours(0, 0, 0, 0)).toISOString()
            }
        })
        today_appts = today_appts.count
        lifetime_appts = lifetime_appts.count + today_appts + 397740
        let projected_today = Math.round(today_appts / elapsed * hrs)
        let projected_month = Math.round(month_appts / days * 26)
        if (elapsed >= hrs) {
            projected_today = today_appts
        }
        if (projected_month < month_appts) {
            projected_month = month_appts
        }
        this._isMounted && this.setState({ lifetime_appts, month_appts, today_appts: today_appts, projected_today, projected_month })
    }
    async getTop10() {
        this._isMounted && this.setState({ top10Loading: true })
        let groupedAppts = await this.props.mongo.aggregate("all_appointments", [
            {
                "$match": {
                    "dealership_department": {
                        "$ne": "Service"
                    },
                    "verified": {
                        "$gte": new Date(new Date().setHours(0, 0, 0, 0)).toISOString()
                    }
                }
            },
            {
                "$group": {
                    "_id": "$agent_id",
                    "count": {
                        "$sum": 1
                    }
                }
            },
            {
                "$sort": {
                    "count": -1
                }
            }
        ])
        let agents = await this.props.mongo.find("agents", {
            department: "sales",
        }, {
            projection: {
                _id: 1,
                name: 1
            }
        })
        let newArr = []
        for (let a in groupedAppts) {
            let index = agents.findIndex((ag) => {
                return ag._id === groupedAppts[a]._id
            })
            if (index === -1) continue;
            let obj = groupedAppts[a];
            obj.name = agents[index].name
            newArr.push(obj)
        }
        this._isMounted && this.setState({ top10: newArr, top10Loading: false })
    }
    async getAgentTop5(agent) {
        //get appointments for selected agent..
        this._isMounted && this.setState({ agent5Loading: true })
        let agent_appts = this._isMounted && await this.props.mongo.find("all_appointments", { agent_id: agent._id }, { projection: { "dealership": 1 } })
        let dealer_counts = {}
        let active;
        for (let a in agent_appts) {
            active = false;
            let index = -1;
            for (let d in this.state.dealerships) {
                if (this.state.dealerships[d].value === agent_appts[a].dealership) {
                    active = this.state.dealerships[d].isActive;
                    index = d
                    break;
                }
            }
            if (index === -1) continue;
            if (dealer_counts[this.state.dealerships[index].label] !== undefined && active) {
                dealer_counts[this.state.dealerships[index].label]++;
            }
            else {
                dealer_counts[this.state.dealerships[index].label] = 1;
            }
        }
        let sortable = []
        for (let d in dealer_counts) {
            sortable.push([d, dealer_counts[d]])
        }
        this._isMounted && sortable.sort((a, b) => {
            return b[1] - a[1];
        })
        this._isMounted && this.setState({ agent_top_5: sortable, agent5Loading: false })

    }
    async getDealerTop5(dealer) {
        this._isMounted && this.setState({ dlrtop5loading: true })
        let dlr_apps = this._isMounted && await this.props.mongo.find("all_appointments", { "dealership": dealer.value }, { projection: { agent_id: 1 } })
        let dict = {};
        for (let d in dlr_apps) {
            if (dict[dlr_apps[d].agent_id] === undefined) {
                dict[dlr_apps[d].agent_id] = 1;
            }
            else {
                dict[dlr_apps[d].agent_id]++;
            }
        }
        let sortable = [];
        for (let d in dict) {
            let index = this.state.agents.findIndex((a) => { return a._id === d })
            if (index === -1) { continue }
            // let name = this._isMounted && await this.props.mongo.findOne("agents", { _id: d })
            let name = this.state.agents[this.state.agents.findIndex((a) => { return a._id === d })]
            sortable.push({ name: name.name, count: dict[d] })
        }
        this._isMounted && sortable.sort((a, b) => {
            return b.count - a.count
        })
        this._isMounted && this.setState({ dlrtop5loading: false, dlrTop5: sortable })
    }
    render() {
        if (this.state.loading) {
            return (
                <>
                    <div className="content">
                        <Container>
                            <Col className="ml-auto mr-auto text-center" md="6">
                                <CardImg top width="100%" src={this.props.utils.loading} />
                            </Col>
                        </Container>
                    </div>
                </>
            );
        }
        return (

            <>
                <div className="content">

                    <Row style={{ justifyContent: "center" }} className="text-center">
                        <Col lg="6">
                            <Card className="card-raised card-white blur" color="primary" style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                <CardHeader>
                                    <CardTitle >
                                        <h3 style={{ color: "white" }}><strong>Longest Time Since Last Appointment</strong></h3>
                                        <hr style={{ backgroundColor: "white" }} />
                                    </CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <CardImg hidden={!this.state.lastAppsLoading} top width="100%" src={this.props.utils.loading} style={{ backgroundColor: "white" }} />

                                    <Table hidden={this.state.lastAppsLoading} style={{ backgroundColor: "white" }}>
                                        <thead>
                                            <tr>
                                                <th>Dealership Name</th>
                                                <th>Time Elapsed Since Last Appointment</th>
                                                <th>Goal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this._isMounted && this.state.last_appts.map((a, i) => {
                                                    if (i > 9) return null
                                                    return (
                                                        <tr key={a.dealership}>
                                                            <td>
                                                                <p style={{ color: "red" }} hidden={a.time_elapsed_hrs < 1}>{a.name}</p>
                                                                <p hidden={a.time_elapsed_hrs >= 1}>{a.name}</p>
                                                            </td>
                                                            <td >
                                                                <p style={{ color: "red" }} hidden={a.time_elapsed_hrs < 1}>{a.time_elapsed_hrs + " hours"}</p>
                                                                <p hidden={a.time_elapsed_hrs >= 1}>{a.time_elapsed_hrs + " hours"}</p>
                                                            </td>
                                                            <td >
                                                                <p style={{ color: "red" }} hidden={a.time_elapsed_hrs < 1}>{a.goal}</p>
                                                                <p hidden={a.time_elapsed_hrs >= 1}>{a.goal}</p>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </Table>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg="6">
                            <Card className="card-raised card-white" color="primary" style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                <CardHeader>
                                    <CardTitle>
                                        <h3 style={{ color: "white" }}><strong>Top 10 Agents Today</strong></h3>
                                        <hr style={{ backgroundColor: "white" }} />
                                    </CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <CardImg hidden={!this.state.top10Loading} top width="100%" src={this.props.utils.loading} style={{ backgroundColor: "white" }} />

                                    <Table hidden={this.state.top10Loading}>
                                        <thead>
                                            <tr>
                                                <th style={{ color: "white", borderBottom: "solid 1px white" }}>#</th>
                                                <th style={{ color: "white", borderBottom: "solid 1px white" }}>Agent Name</th>
                                                <th style={{ color: "white", borderBottom: "solid 1px white" }}>Count</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this._isMounted && this.state.top10.map((a, i) => {
                                                if (i > 9) return null;
                                                return (
                                                    <tr key={i}>
                                                        <td style={{ borderBottom: "solid 1px white" }}><p style={{ color: "white" }}><strong>{i + 1}</strong></p></td>
                                                        <td style={{ borderBottom: "solid 1px white" }}><p style={{ color: "white" }}><strong>{a.name}</strong></p></td>
                                                        <td style={{ borderBottom: "solid 1px white" }}><p style={{ color: "white" }}><strong>{a.count}</strong></p></td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </Table>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row style={{ justifyContent: "center" }} className="text-center">
                        <Col lg="6" style={{ justifyContent: "center" }} className="text-center">
                            <Card className="card-raised card-white" color="primary" style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                <CardHeader>
                                    <CardTitle>
                                        <h3 style={{ color: "white" }}><strong>Agent's Top 5 Dealerships</strong></h3>
                                        <hr style={{ backgroundColor: "white" }} />
                                    </CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Label style={{ color: "white" }}>Agent</Label>
                                    <Select
                                        options={this.state.agents}
                                        value={this.state.selected_agent}
                                        onChange={(e) => {
                                            this._isMounted && this.setState({ selected_agent: e })
                                            this.getAgentTop5(e)
                                        }}
                                    />
                                    <CardImg hidden={!this.state.agent5Loading} top width="100%" src={this.props.utils.loading} style={{ backgroundColor: "white" }} />

                                    <hr hidden={this.state.selected_agent.label.length < 1} />
                                    <Table hidden={this.state.selected_agent.label.length < 1 || this.state.agent5Loading} style={{ backgroundColor: "white" }}>
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Dealership Name</th>
                                                <th>Count</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this._isMounted && this.state.agent_top_5.map((d, i) => {

                                                if (i > 4) return null;
                                                let stale = false
                                                let stales = []
                                                for (let l in this.state.last_appts) {
                                                    if (l > 9) break;
                                                    for (let dealership in this.state.dealerships) {
                                                        if (this.state.dealerships[dealership].value === this.state.last_appts[l].dealership) {
                                                            stales.push(this.state.dealerships[dealership].label)
                                                            break;
                                                        }
                                                    }
                                                }
                                                if (stales.indexOf(d[0]) !== -1) {
                                                    stale = true;
                                                }
                                                return (
                                                    <tr key={i}>
                                                        <td>{i + 1}</td>
                                                        <td hidden={!stale}><p style={{ color: "red" }}>{d[0]}</p></td>
                                                        <td hidden={stale}><p>{d[0]}</p></td>
                                                        <td>{d[1]}</td>
                                                    </tr>

                                                )
                                            })}
                                        </tbody>
                                    </Table>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg="6">
                            <Card className="card-raised card-white" color="primary" style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                <CardHeader>
                                    <CardTitle>
                                        <h3 style={{ color: "white" }}><strong>CentralBDC Metrics</strong></h3>
                                        <hr style={{ backgroundColor: "white", borderBottom: "2px solid white" }} />
                                    </CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Card className="card-raised card-white" color="transparent">
                                        <CardBody>
                                            <h2 style={{ color: "white" }}>Total Appts Today</h2>
                                            <h3 style={{ color: "white" }}><strong>{this.state.today_appts}</strong></h3>
                                            <hr style={{ borderBottom: "2px dotted white" }} />
                                            <h2 style={{ color: "white" }}>Projected Appts Today</h2>
                                            <h3 style={{ color: "white" }}><strong>{this.state.projected_today}</strong></h3>

                                        </CardBody>
                                    </Card>
                                    <hr style={{ backgroundColor: "white", borderBottom: "2px solid white" }} />
                                    <Card className="card-raised card-white" color="transparent">
                                        <CardBody>
                                            <h2 style={{ color: "white" }}>Total Appts This Month</h2>
                                            <h3 style={{ color: "white" }}><strong>{this.state.month_appts}</strong></h3>
                                            <hr style={{ borderBottom: "2px dotted white" }} />
                                            <h2 style={{ color: "white" }}>Projected Appts This Month</h2>
                                            <h3 style={{ color: "white" }}><strong>{this.state.projected_month}</strong></h3>
                                        </CardBody>
                                    </Card>
                                    <hr style={{ backgroundColor: "white", borderBottom: "2px solid white" }} />
                                    <Card className="card-raised card-white" color="transparent">
                                        <CardBody>
                                            <h2 style={{ color: "white" }}>Total Appts Lifetime</h2>
                                            <h3 style={{ color: "white" }}><strong>{this.state.lifetime_appts}</strong></h3>
                                        </CardBody>
                                    </Card>
                                </CardBody>

                            </Card>
                        </Col>


                    </Row>
                    <Row style={{ justifyContent: "center" }} className="text-center" hidden={this.state.agent === undefined ? true : (this.state.agent.name !== "Admin User" && this.state.agent.name !== "Marc Vertus")}>
                        <Col lg="6" style={{ justifyContent: "center" }} className="text-center">
                            <Card className="card-raised card-white shadow" color="primary" style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                <CardHeader>
                                    <p style={{ color: "white" }}><strong>Agent's Most Recent Call</strong></p>
                                </CardHeader>
                                <CardBody>
                                    <Table>
                                        <thead>
                                            <tr>
                                                <th style={{ color: "white", borderBottom: "1px solid white" }}>Name</th>
                                                <th style={{ color: "white", borderBottom: "1px solid white" }}>Time Elapsed</th>
                                                <th style={{ color: "white", borderBottom: "1px solid white" }}>Last Updated</th>
                                                <th style={{ color: "white", borderBottom: "1px solid white" }}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(() => {
                                                let agents = this._isMounted && this.state.agents.filter((a) => { return a.lastCall !== null && !isNaN(new Date(a.lastCall).getTime()) && a.account_type === "agent" })
                                                for (let a in agents) {
                                                    agents[a].elapsed = Math.round(10 * ((new Date().getTime() - new Date(agents[a].lastCall).getTime()) / (60000))) / 10
                                                    // console.log(Math.round(10 * (new Date().getTime() - new Date(agents[a].lastCall).getTime()) / (1000 * 60)) / 10)
                                                }
                                                agents = this._isMounted && agents.sort((a, b) => {
                                                    if (a.elapsed > b.elapsed) return -1;
                                                    if (a.elapsed < b.elapsed) return 1;
                                                    return 0;
                                                })
                                                return this._isMounted && agents.map((a, i) => {
                                                    if (i > 9) return null
                                                    if (a.lastCall === null) {
                                                        return null
                                                    }
                                                    return (
                                                        <tr key={i}>
                                                            <td style={{ borderBottom: "solid 1px white" }}><p style={{ color: "white" }}><strong>{a.name}</strong></p></td>
                                                            <td style={{ borderBottom: "solid 1px white" }}><p style={{ color: "white" }}><strong>{a.lastCall === null ? "No Calls Today" : Math.round(10 * (new Date().getTime() - new Date(a.lastCall).getTime()) / (1000 * 60)) / 10 + " min"}</strong></p></td>
                                                            <td style={{ borderBottom: "solid 1px white" }}><p style={{ color: "white" }}><strong>{new Date(a.callCountLastUpdated).toLocaleTimeString()}</strong></p></td>
                                                            <td style={{ borderBottom: "solid 1px white" }}><Button color="neutral" disabled={this.state.latestLoading} onClick={async () => {
                                                                this._isMounted && this.setState({ latestLoading: true })
                                                                //get voice token
                                                                let token = this._isMounted && await this.props.mongo.findOne("utils", { "_id": "5df2b825f195a16a1dbd4bf5" })
                                                                token = token.voice_token
                                                                //get curr users records
                                                                let currCount = this._isMounted && await axios.get(`https://platform.ringcentral.com/restapi/v1.0/account/~/extension/${a.extension}/call-log?dateFrom=${new Date(new Date().setHours(0, 0, 0, 0)).toISOString()}&access_token=${token}&perPage=1000`).catch()
                                                                let records = currCount.data.records;
                                                                let lastTime = null
                                                                for (let i in records) {
                                                                    if (records[i].direction === "Inbound" && records[i].result === "Missed") {
                                                                        continue;
                                                                    }
                                                                    else {
                                                                        lastTime = new Date(new Date(records[i].startTime).getTime() + (records[i].duration * 1000));
                                                                        break;
                                                                    }
                                                                }
                                                                let outbound = this._isMounted && records.filter(r => { return r.direction === "Outbound" })
                                                                let inbound = this._isMounted && records.filter(r => { return r.direction === "Inbound" && r.result === "Accepted" })
                                                                this._isMounted && await this.props.mongo.findOneAndUpdate("agents", { name: a.name }, { inboundToday: inbound.length, outboundToday: outbound.length, callCountLastUpdated: new Date(), lastCall: lastTime })
                                                                let agents = this._isMounted && await this.props.mongo.find("agents", { isActive: true, department: "sales" }, { projection: { "assistance.created": 1, "assistance.userId": 1, account_type: 1, lastCall: 1, "appointments.verified": 1, "appointments.dealership": 1, name: 1, extension: 1, callCountLastUpdated: 1 } })
                                                                this._isMounted && this.setState({ agents })
                                                                //force update
                                                                setTimeout(() => {
                                                                    this._isMounted && this.setState({ latestLoading: false })
                                                                }, 7000);
                                                            }}><i className="tim-icons icon-refresh-01" /></Button></td>
                                                        </tr>
                                                    );
                                                })
                                            })()}
                                        </tbody>
                                    </Table>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg="6" style={{ justifyContent: "center" }} className="text-center">
                            <Card className="card-raised card-white shadow" color="primary" style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                <CardHeader>
                                    <p style={{ color: "white" }}><strong>Dealership's Top 10 Agents</strong></p>
                                </CardHeader>
                                <CardBody>

                                    <Select
                                        options={this.state.dealerships}
                                        value={this.state.selected_dlr}
                                        onChange={(e) => { this._isMounted && this.setState({ selected_dlr: e }); this.getDealerTop5(e) }}
                                        inputProps={{ disabled: this.state.dlrtop5loading }}
                                    />
                                    <br />
                                    <CardImg hidden={!this.state.dlrtop5loading} style={{ backgroundColor: "white" }} top width="100%" src={this.props.utils.loading} />
                                    <Table responsive striped hidden={this.state.dlrtop5loading || this.state.selected_dlr.label.length < 1}>
                                        <thead>
                                            <tr>
                                                <th style={{ color: "white" }}>#</th>
                                                <th style={{ color: "white" }}>Name</th>
                                                <th style={{ color: "white" }}>Count</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this._isMounted && this.state.dlrTop5.map((d, i) => {
                                                if (i > 9) return null;
                                                return (<tr key={i}>
                                                    <td style={{ borderBottom: "1px solid white" }}><p style={{ color: "white" }}><strong>{i + 1}</strong></p></td>
                                                    <td style={{ borderBottom: "1px solid white" }}><p style={{ color: "white" }}><strong>{d.name}</strong></p></td>
                                                    <td style={{ borderBottom: "1px solid white" }}><p style={{ color: "white" }}><strong>{d.count}</strong></p></td>
                                                </tr>);
                                            })}
                                        </tbody>
                                    </Table>

                                </CardBody>

                            </Card>
                        </Col>

                    </Row>
                    <Row style={{ justifyContent: "center" }} className="text-center">
                        <Col lg="8">
                            <Card className="card-raised card-white blur" color="white" style={{ padding: "20px", background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                <Card>
                                    <Bar
                                        data={
                                            {
                                                labels: this.state.hourlyLabels,
                                                datasets: [{ label: "Total Sales Appts", backgroundColor: '#1d67a8', borderColor: '#1d67a8', data: this.state.hourlyData }]
                                            }
                                        }
                                        options={
                                            {
                                                title: {
                                                    display: true,
                                                    text: "# of Sales Appointments Each Hour",
                                                    fontSize: 24,
                                                },

                                            }
                                        }
                                    />
                                </Card>
                            </Card>
                        </Col>
                        <Col lg="8">
                            <Card className="card-raised card-white blur" color="white" style={{ padding: "20px", background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>

                                <Card className="card-raised card-white blur" color="white">

                                    <Bar
                                        data={
                                            {
                                                labels: this.state.monthLabels,
                                                datasets: [{ label: "Total Sales Appts", backgroundColor: '#1d67a8', borderColor: '#1d67a8', data: this.state.monthData }]
                                            }
                                        }
                                        options={
                                            {
                                                title: {
                                                    display: true,
                                                    text: "# of Sales Appointments Each Month",
                                                    fontSize: 24,
                                                },

                                            }
                                        }
                                    />

                                </Card>
                            </Card>
                        </Col>
                        <Col lg="6">
                            <Card className="card-raised card-white blur" color="white" style={{ padding: "20px", background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                <Card className="card-raised card-white blur" color="white">
                                    <Bar
                                        data={
                                            {
                                                labels: this.state.followupLabels,
                                                datasets: [{ label: "Total Follow-ups", backgroundColor: '#1d67a8', borderColor: '#1d67a8', data: this.state.followupData }]
                                            }
                                        }
                                        labels={this.state.followupLabels}
                                        options={
                                            {
                                                title: {
                                                    display: true,
                                                    text: "# of Follow-ups Each Hour",
                                                    fontSize: 24
                                                }
                                            }
                                        }
                                    />
                                </Card>
                            </Card>
                        </Col>
                        <Col lg="6">
                            <Card className="card-raised card-white blur" color="white" style={{ padding: "20px", background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                <Card className="card-raised card-white blur" color="white">
                                    <Pie
                                        data={
                                            {
                                                datasets: [{
                                                    backgroundColor: this.state.followupColors,
                                                    data: (() => {
                                                        let counts = [];
                                                        for (let a in this.state.followupByAgent) {
                                                            counts.push(this.state.followupByAgent[a].count)
                                                        }
                                                        return counts
                                                    })()
                                                }],
                                                labels: (() => {
                                                    let l = [];
                                                    for (let a in this.state.followupByAgent) {
                                                        l.push(this.state.followupByAgent[a].agent)
                                                    }
                                                    return l
                                                })()
                                            }
                                        }
                                        options={
                                            {
                                                title: {
                                                    display: true,
                                                    text: "Today's Follow-ups by Agent",
                                                    fontSize: 24
                                                }
                                            }
                                        }
                                    />
                                </Card>
                            </Card>
                        </Col>
                    </Row>

                </div>
            </>
        );
    }
}

export default AdminDashboard;
