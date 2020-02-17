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
import { Line, Bar } from "react-chartjs-2";
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
    Form
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
            hourlyData: []
        };
        this.sortLastAppts = this.sortLastAppts.bind(this);
        this.getTodayAppts = this.getTodayAppts.bind(this);
        this.getTop10 = this.getTop10.bind(this);
        this.getAgentTop5 = this.getAgentTop5.bind(this)
        this.getDealerTop5 = this.getDealerTop5.bind(this)
        this.getMonthChart = this.getMonthChart.bind(this)
        this.getHourlyApps = this.getHourlyApps.bind(this)
    }
    _isMounted = false;
    async getMonthChart() {
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        let labels = []
        let data = []
        let todayApps = []
        for (let a in this.state.agents) {
            todayApps = this._isMounted && todayApps.concat(this.state.agents[a].appointments)
        }
        for (let i = 0; i < 12; i++) {
            let curMonth = new Date(new Date(new Date(new Date().setDate(1)).setHours(0, 0, 0, 0)).setMonth(new Date().getMonth() - i))
            let nextMonth = new Date(new Date(new Date(new Date().setDate(1)).setHours(0, 0, 0, 0)).setMonth(new Date().getMonth() - (i - 1)))
            labels[11 - i] = months[curMonth.getMonth()]
            let curApps = await this.props.mongo.count("all_appointments", {
                "dealership_department": { "$ne": "Service" },
                "verified": {
                    "$gte": curMonth.toISOString(),
                    "$lt": nextMonth.toISOString(),
                }
            })
            data[11 - i] = curApps.count;
            if (i < 1) {
                console.log(curApps.count, todayApps.length, curMonth.toISOString(), nextMonth.toISOString())

                data[5 - i] += todayApps.length
            }

        }
        console.log(data, labels)

        this.setState({ monthLabels: labels, monthData: data })
        this.getHourlyApps(todayApps)
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
            console.log("start", startHour, "end", endHour)
        }
        this.setState({ hourlyLabels: labels, hourlyData: data })
    }
    async componentDidMount() {
        this._isMounted = true;
        this._isMounted && this.setState({ loading: true });
        if (this.props.agent.account_type !== "admin") {
            this._isMounted && this.props.history.push("/admin/dashboard")
        }
        else {
            let dealerships = this._isMounted && await this.props.mongo.find("dealerships", { isActive: true, isSales: true }, { projection: { label: 1, value: 1, isActive: 1 } });
            let agents = this._isMounted && await this.props.mongo.find("agents", { isActive: true, department: "sales" }, { projection: { lastCall: 1, "appointments.agent_id": 1, "appointments.value": 1, "appointments.verified": 1, "appointments.dealership": 1, name: 1 } })
            for (let a in agents) {
                agents[a].label = agents[a].name;
                agents[a].value = agents[a]._id
            }
            this._isMounted && agents.sort((a, b) => {
                if (a.name > b.name) return 1;
                if (a.name < b.name) return -1;
                return 0;
            })
            this._isMounted && this.setState({ dealerships, agents });
            this._isMounted && this.getTodayAppts();
            this._isMounted && this.sortLastAppts();
            this._isMounted && this.getTop10();
            this._isMounted && this.getMonthChart()
        }
        this._isMounted && this.setState({ loading: false });
    }
    componentWillUnmount() {
        this._isMounted = false
    }
    async sortLastAppts() {
        this._isMounted && this.setState({ lastAppsLoading: true })

        let allApps = this._isMounted && await this.props.mongo.find("all_appointments", {
            dealership_department: {
                "$ne": "Service"
            },
            verified: {
                "$gte": new Date(new Date().setDate(new Date().getDate() - 2)).toISOString()
            }
        }, {
            projection: {
                "verified": 1,
                "dealership.value": 1,
                "dealership.label": 1,
                agent_id: 1
            }
        })
        for (let a in this.state.agents) {
            allApps = this._isMounted && await allApps.concat(this.state.agents[a].appointments);
        }
        this._isMounted && allApps.sort((a, b) => {
            return new Date(b.verified).getTime() - new Date(a.verified).getTime()
        })
        let dict = {}
        for (let d in this.state.dealerships) {
            if (dict[this.state.dealerships[d].value] === undefined) {
                dict[this.state.dealerships[d].value] = []
            }
        }
        for (let a in allApps) {
            if (dict[allApps[a].dealership.value] !== undefined) {
                // if (allApps[a].dealership.value === "5dcedce9271f627094b0849c") { console.log(allApps[a]) }
                dict[allApps[a].dealership.value].push(allApps[a].verified)
            }
        }
        let last_appts = []
        for (let d in dict) {
            this._isMounted && await dict[d].sort((a, b) => {
                return new Date(b).getTime() - new Date(a).getTime()
            })
            last_appts.push({ dealership: d, time_elapsed_hrs: Math.round(10 * (new Date().getTime() - new Date(dict[d][0]).getTime()) / (1000 * 60 * 60)) / 10 })
        }
        this._isMounted && await last_appts.sort((a, b) => {
            return b.time_elapsed_hrs - a.time_elapsed_hrs
        })
        this.setState({ last_appts })
        this._isMounted && await this.setState({ lastAppsLoading: false })
    }
    async getTodayAppts() {
        let today = new Date();
        today = new Date(today.setHours(8, 0, 0, 0))
        let first = new Date()
        first = new Date(first.setDate(1))
        first = new Date(first.setHours(0, 0, 0, 0))
        let now = new Date();
        let elapsed = now.getTime() - today.getTime();
        elapsed /= (1000 * 60 * 60)

        let hrs = now.getDay() === 0 ? 8 : 12
        let days = now.getDate()
        let metrics = this._isMounted && await this.props.mongo.findOne("admin_dashboard", { label: "centralbdc_metrics" }, { projection: { total_lifetime: 1 } })
        let lifetime_appts = this._isMounted && await this.props.mongo.count("all_appointments", {})
        let month_appts = this._isMounted && await this.props.mongo.count("all_appointments", {
            "dealership_department": { "$ne": "Service" },
            verified: {
                "$gte": new Date(new Date(new Date().setDate(1)).setHours(0, 0, 0, 0)).toISOString()
            }
        })
        let today_appts = 0;
        for (let a in this.state.agents) {
            today_appts += this.state.agents[a].appointments.length
        }
        lifetime_appts = lifetime_appts.count + today_appts + 397740
        month_appts = month_appts.count + today_appts
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
        let agents = this.state.agents

        let today_appts = [];
        for (let a in agents) {
            today_appts = this._isMounted && today_appts.concat(agents[a].appointments)
        }

        let agent_counts = {}
        for (let a in this.state.agents) {
            agent_counts[this.state.agents[a]._id] = 0
        }
        for (let a in today_appts) {
            if (agent_counts[today_appts[a].agent_id] != undefined) {
                agent_counts[today_appts[a].agent_id]++;
            }
            else {
                agent_counts[today_appts[a].agent_id] = 1
            }
        }
        let sortable = []
        for (let a in agent_counts) {
            sortable.push([a, agent_counts[a]])
        }
        this._isMounted && sortable.sort((a, b) => {
            return b[1] - a[1]
        })
        this._isMounted && this.setState({ top10: sortable, top10Loading: false })
    }
    async getAgentTop5(agent) {
        //get appointments for selected agent..
        this._isMounted && this.setState({ agent5Loading: true })
        let agent_appts = this._isMounted && await this.props.mongo.find("all_appointments", { agent_id: agent._id }, { projection: { "dealership.label": 1, "dealership.value": 1, "dealership.isActive": 1 } })
        let dealer_counts = {}
        let active;
        for (let a in agent_appts) {
            active = false;
            for (let d in this.state.dealerships) {
                if (this.state.dealerships[d].value === agent_appts[a].dealership.value) {
                    active = this.state.dealerships[d].isActive;
                    break;
                }
            }
            if (dealer_counts[agent_appts[a].dealership.label] !== undefined && active) {
                dealer_counts[agent_appts[a].dealership.label]++;
            }
            else {
                dealer_counts[agent_appts[a].dealership.label] = 1;
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
        let dlr_apps = this._isMounted && await this.props.mongo.find("all_appointments", { "dealership.label": dealer.label }, { projection: { agent_id: 1 } })
        let dict = {};
        for (let d in dlr_apps) {
            if (dict[dlr_apps[d].agent_id] == undefined) {
                dict[dlr_apps[d].agent_id] = 1;
            }
            else {
                dict[dlr_apps[d].agent_id]++;
            }
        }
        let sortable = [];
        for (let d in dict) {
            let index = this.state.agents.findIndex((a) => { return a._id == d })
            if (index === -1) { continue }
            // let name = this._isMounted && await this.props.mongo.findOne("agents", { _id: d })
            let name = this.state.agents[this.state.agents.findIndex((a) => { return a._id == d })]
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
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this._isMounted && this.state.last_appts.map((a, i) => {
                                                    if (i > 9) return null
                                                    let dealership_name = ""
                                                    for (let d in this.state.dealerships) {
                                                        if (this.state.dealerships[d].value === a.dealership) {
                                                            dealership_name = this.state.dealerships[d].label
                                                            if (!this.state.dealerships[d].isActive) {
                                                                dealership_name = "Inactive"
                                                            }
                                                        }
                                                    }
                                                    // let dealership_name = this._isMounted && await this.props.mongo.findOne("dealerships", { value: a.dealership })
                                                    return (
                                                        <tr key={a.dealership}>
                                                            <td>
                                                                <p style={{ color: "red" }} hidden={a.time_elapsed_hrs < 1}>{dealership_name}</p>
                                                                <p hidden={a.time_elapsed_hrs >= 1}>{dealership_name}</p>
                                                            </td>
                                                            <td >
                                                                <p style={{ color: "red" }} hidden={a.time_elapsed_hrs < 1}>{a.time_elapsed_hrs + " hours"}</p>
                                                                <p hidden={a.time_elapsed_hrs >= 1}>{a.time_elapsed_hrs + " hours"}</p>
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
                                                let name = "Unavailable"
                                                for (let b in this.state.agents) {
                                                    if (this.state.agents[b]._id == a[0]) {
                                                        name = this.state.agents[b].name
                                                    }
                                                }
                                                return (
                                                    <tr key={a[0]}>
                                                        <td style={{ borderBottom: "solid 1px white" }}><p style={{ color: "white" }}><strong>{i + 1}</strong></p></td>
                                                        <td style={{ borderBottom: "solid 1px white" }}><p style={{ color: "white" }}><strong>{name}</strong></p></td>
                                                        <td style={{ borderBottom: "solid 1px white" }}><p style={{ color: "white" }}><strong>{a[1]}</strong></p></td>
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
                                                    let dealer = {};
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
                    <Row style={{ justifyContent: "center" }} className="text-center" hidden={this.state.agent == undefined ? true : (this.state.agent.name !== "Admin User" && this.state.agent.name !== "Marc Vertus")}>
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
                                                let agents = this._isMounted && this.state.agents.filter((a) => { return a.lastCall !== null && !isNaN(new Date(a.lastCall).getTime()) })
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
                                                    if (a.lastCall === null) return null
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
                                                                let agents = this._isMounted && await this.props.mongo.find("agents", { isActive: true, department: "sales" }, { lastCall: 1, "appointments.verified": 1, "appointments.dealership": 1, name: 1 })
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

                    </Row>

                </div>
            </>
        );
    }
}

export default AdminDashboard;
