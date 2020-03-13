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

// reactstrap components
import {
    Card,
    CardImg,
    Container,
    CardHeader,
    CardBody,
    CardTitle,
    Table,
    Row,
    Col,
} from "reactstrap";
import Select from "react-select"
class ServiceDashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            agent: {

            },
            isAdmin: false,
            appointments: [],
            loading: false,
            agents: [],
            dealerships: [],
            top5: [],
            mtdTop5: [],
            todays_appts: [],
            todays_dealer_counts: [],
            selected_agent: { label: "", value: "" },
            counts: {},
            mtdtop5loading: false
        };
        this.getBreakDown = this.getBreakDown.bind(this)
        this.getMtdTop5 = this.getMtdTop5.bind(this)
        this.getProjection = this.getProjection.bind(this)
    }
    _isMounted = false;
    componentWillMount() {
        if (this.props.agent.account_type !== 'admin' && this.props.agent.department !== "service") {
            this.props.history.push("/admin/dashboard");
            return;
        }
    }
    async componentDidMount() {
        this._isMounted = true
        this._isMounted && this.setState({ loading: true })
        let agent = this.props.agent
        let agents = this._isMounted && await this.props.mongo.aggregate("agents", [
            {
                "$match": {
                    isActive: true,
                    department: "service"
                }
            },
            {
                "$group": {
                    "_id": "$_id",
                    "name": { "$first": "$name" },
                    "label": { "$first": "$name" },
                    "value": { "$first": "$_id" },
                    "inboundToday": { "$first": "$inboundToday" },
                    "outboundToday": { "$first": "$outboundToday" },
                    "callCountLastUpdated": { "$first": "$callCountLastUpdated" }
                }
            },
            {
                "$sort": {
                    "label": 1
                }
            }
        ])
        if (agent.account_type !== "admin") {
            let selected = this._isMounted && agents.filter((a) => {
                return a._id === agent._id
            })
            selected = selected[0]
            this.getBreakDown(agent)
            this.setState({ selected_agent: selected })
        }
        this._isMounted && this.setState({ agent, agents, isAdmin: agent.account_type === "admin" })
        this._isMounted && await this.getTop5()
        this._isMounted && await this.getMtdTop5()
        this._isMounted && this.setState({ loading: false })

    }
    componentWillUnmount() {
        this._isMounted = false
    }
    async getTop5() {
        this._isMounted && this.setState({ loading: true })
        let agentNames = await this.props.mongo.find("agents", { department: "service", isActive: true }, { projection: { name: 1, account_type: 1 } })
        let grouped = this._isMounted && await this.props.mongo.aggregate("all_appointments", [
            {
                "$match": {
                    dealership_department: "Service",
                    verified: {
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
            }, {
                "$sort": {
                    "count": -1
                }
            }
        ])
        let top5 = []
        for (let ap in grouped) {
            let index = agentNames.findIndex((a) => {
                return a._id === grouped[ap]._id
            })
            if(index === -1){
                continue;
            }
            let name = agentNames[index].name
            let type = agentNames[index].account_type
            let obj = {
                count: grouped[ap].count,
                type,
                name
            }
            top5.push(obj)
        }
        this._isMounted && this.setState({ top5, loading: false })

    }
    async getMtdTop5() {
        this._isMounted && this.setState({ loading: true, mtdtop5loading: true })
        let agentNames = await this.props.mongo.find("agents", { department: "service", isActive: true }, { projection: { name: 1, account_type: 1 } })
        let grouped = this._isMounted && await this.props.mongo.aggregate("all_appointments", [
            {
                "$match": {
                    dealership_department: "Service",
                    verified: {
                        "$gte": new Date(new Date(new Date().setDate(1)).setHours(0, 0, 0, 0)).toISOString()
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
            }, {
                "$sort": {
                    "count": -1
                }
            }
        ])
        let mtdTop5 = []
        for (let ap in grouped) {
            let index = agentNames.findIndex((a) => {
                return a._id === grouped[ap]._id
            })
            if (index === -1) continue;
            let name = agentNames[index].name
            let type = agentNames[index].account_type
            let obj = {
                count: grouped[ap].count,
                type,
                name
            }
            mtdTop5.push(obj)
        }
        this._isMounted && this.setState({ loading: false, mtdtop5loading: false, mtdTop5 })
    }
    getMonday(d) {
        d = new Date(d);
        d.setHours(0, 0, 0, 0)
        var day = d.getDay(),
            diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        return new Date(d.setDate(diff));
    }
    createdAppointmentsSince(appts, numDays) {
        let ct = 0
        let curr = new Date()
        curr.setHours(0, 0, 0, 0)
        if (numDays === 0) {
            for (let appt in appts) {
                if (new Date(appts[appt].verified).getTime() >= curr.getTime()) {
                    ct++;
                }
            }
            return ct;
        }
        if (numDays === 7) {
            let monday = this.getMonday(new Date())
            for (let appt in appts) {
                if (new Date(appts[appt].verified).getTime() >= monday.getTime()) {
                    ct++;
                }
            }
            return ct;
        }
        if (numDays === 30) {
            let date = new Date()
            var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            for (let appt in appts) {
                if (new Date(appts[appt].verified).getTime() >= firstDay.getTime()) {
                    ct++;
                }
            }
            return ct;
        }
        return 0
    }
    pendingAppointmentsSince(appts, numDays) {
        let someDay = new Date();
        let ret = 0;
        someDay.setDate(someDay.getDate() + (-1 * numDays));
        for (let appt in appts) {
            if (new Date(appts[appt].created).getTime() >= someDay.getTime() && appts[appt].isPending === true) {
                ret++;
            }
        }

        return ret;
    }
    async getBreakDown(agent) {
        let appointments = this._isMounted && await this.props.mongo.find("all_appointments", {
            agent_id: agent._id,
            verified: {
                "$gte": new Date(new Date().setHours(0, 0, 0, 0)).toISOString()
            }
        }, { projection: { verified: 1 } })
        let start = new Date()
        let end = new Date();
        let now = new Date();
        let counts = {

        }
        start.setHours(7, 0, 0, 0)
        end.setHours(8, 0, 0, 0)

        for (let i = 0; i < 15; i++) {

            if (now.getTime() < start.getTime()) {
                counts[i + 7] = { count: "", color: "red" }
                continue;
            }
            let color = "red";
            let count = 0;
            for (let a in appointments) {
                if (new Date(appointments[a].verified).getTime() >= start.getTime() && new Date(appointments[a].verified).getTime() < end.getTime()) {
                    count++
                }
            }
            if (count === 2) {
                color = "yellow"
            }
            if (count > 2) {
                color = "green"
            }
            counts[i + 7] = { count: count, color }
            start = new Date(end);
            end.setHours(end.getHours() + 1, 0, 0, 0)
        }
        counts["total"] = { count: appointments.length, color: "black" }
        this.setState({ counts })
    }
    getProjection(curr) {
        let now = new Date();
        let isSunday = now.getDay() === 0;
        let hrs = isSunday === true ? 8 : 12
        let start = isSunday === true ? new Date(new Date().setHours(10, 0, 0, 0)) : new Date(new Date().setHours(8, 0, 0, 0));
        if (isSunday === true) {
            if (now.getHours() > 18) {
                return curr
            }
        }
        else {
            if (now.getHours() > 20) {
                return curr
            }
        }
        let elapsed = (now.getTime() - start.getTime()) / (1000 * 60 * 60)
        return Math.round(10 * curr / elapsed * hrs) / 10

    }
    render() {

        if (this.state.loading) {
            return (
                <>
                    <div className="content">
                        <Container>
                            <Col className="ml-auto mr-auto text-center" md="6">
                                {/* <Card color="transparent" > */}
                                <CardImg top width="100%" src={this.props.utils.loading} />
                                {/* </Card> */}
                            </Col>
                        </Container>
                    </div>
                </>
            );
        }
        return (

            <>
                <div className="content">

                    <Row style={{ justifyContent: "center" }}>
                        <Col lg="12">
                            <Card className="card-raised card-white" color="primary" style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                <CardHeader>
                                    <CardTitle tag="h3"><p style={{ color: "white" }}><strong>Agent Hourly Breakdown</strong></p></CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Select
                                        options={this.state.agent.account_type === "admin" ? this.state.agents : this.state.agents.filter((a) => { return a.label === this.state.agent.name })}
                                        value={this.state.agent.account_type === "admin" ? this.state.selected_agent : this.state.agents.filter((a) => { return a.label === this.state.agent.name })[0]}
                                        onChange={(e) => {
                                            this.setState({ selected_agent: e })
                                            this.getBreakDown(e)
                                        }}
                                    />
                                    <br />
                                    <Table style={{ backgroundColor: "lightgrey" }} bordered striped hidden={this.state.selected_agent.label.length < 1} className="text-center">
                                        <thead className="text-primary">
                                            <tr>
                                                <th></th>
                                                <th>7 - 8</th>
                                                <th>8 - 9</th>
                                                <th>9 - 10</th>
                                                <th>10 - 11</th>
                                                <th>11 - 12</th>
                                                <th>12 - 1</th>
                                                <th>1 - 2</th>
                                                <th>2 - 3</th>
                                                <th>3 - 4</th>
                                                <th>4 - 5</th>
                                                <th>5 - 6</th>
                                                <th>6 - 7</th>
                                                <th>7 - 8</th>
                                                <th>8 - 9</th>
                                                <th>9 - 10</th>
                                                <th>Total</th>
                                                <th>Projection</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Appointments</td>
                                                <td><p style={this.state.counts[7] === undefined ? {} : { color: this.state.counts[7].color }}><strong>{this.state.counts[7] === undefined ? 0 : this.state.counts[7].count}</strong></p></td>
                                                <td><p style={this.state.counts[8] === undefined ? {} : { color: this.state.counts[8].color }}><strong>{this.state.counts[8] === undefined ? 0 : this.state.counts[8].count}</strong></p></td>
                                                <td><p style={this.state.counts[9] === undefined ? {} : { color: this.state.counts[9].color }}><strong>{this.state.counts[9] === undefined ? 0 : this.state.counts[9].count}</strong></p></td>
                                                <td><p style={this.state.counts[10] === undefined ? {} : { color: this.state.counts[10].color }}><strong>{this.state.counts[10] === undefined ? 0 : this.state.counts[10].count}</strong></p></td>
                                                <td><p style={this.state.counts[11] === undefined ? {} : { color: this.state.counts[11].color }}><strong>{this.state.counts[11] === undefined ? 0 : this.state.counts[11].count}</strong></p></td>
                                                <td><p style={this.state.counts[12] === undefined ? {} : { color: this.state.counts[12].color }}><strong>{this.state.counts[12] === undefined ? 0 : this.state.counts[12].count}</strong></p></td>
                                                <td><p style={this.state.counts[13] === undefined ? {} : { color: this.state.counts[13].color }}><strong>{this.state.counts[13] === undefined ? 0 : this.state.counts[13].count}</strong></p></td>
                                                <td><p style={this.state.counts[14] === undefined ? {} : { color: this.state.counts[14].color }}><strong>{this.state.counts[14] === undefined ? 0 : this.state.counts[14].count}</strong></p></td>
                                                <td><p style={this.state.counts[15] === undefined ? {} : { color: this.state.counts[15].color }}><strong>{this.state.counts[15] === undefined ? 0 : this.state.counts[15].count}</strong></p></td>
                                                <td><p style={this.state.counts[16] === undefined ? {} : { color: this.state.counts[16].color }}><strong>{this.state.counts[16] === undefined ? 0 : this.state.counts[16].count}</strong></p></td>
                                                <td><p style={this.state.counts[17] === undefined ? {} : { color: this.state.counts[17].color }}><strong>{this.state.counts[17] === undefined ? 0 : this.state.counts[17].count}</strong></p></td>
                                                <td><p style={this.state.counts[18] === undefined ? {} : { color: this.state.counts[18].color }}><strong>{this.state.counts[18] === undefined ? 0 : this.state.counts[18].count}</strong></p></td>
                                                <td><p style={this.state.counts[19] === undefined ? {} : { color: this.state.counts[19].color }}><strong>{this.state.counts[19] === undefined ? 0 : this.state.counts[19].count}</strong></p></td>
                                                <td><p style={this.state.counts[20] === undefined ? {} : { color: this.state.counts[20].color }}><strong>{this.state.counts[20] === undefined ? 0 : this.state.counts[20].count}</strong></p></td>
                                                <td><p style={this.state.counts[21] === undefined ? {} : { color: this.state.counts[21].color }}><strong>{this.state.counts[21] === undefined ? 0 : this.state.counts[21].count}</strong></p></td>
                                                <td><p style={this.state.counts["total"] === undefined ? {} : { color: this.state.counts["total"].color }}><strong>{this.state.counts["total"] === undefined ? 0 : this.state.counts["total"].count}</strong></p></td>
                                                <td><strong>{this.state.counts["total"] === undefined ? 0 : this.getProjection(this.state.counts["total"].count)}</strong></td>
                                            </tr>
                                            <tr>
                                                <td>Calls</td>
                                                <td>-</td>
                                                <td>-</td>
                                                <td>-</td>
                                                <td>-</td>
                                                <td>-</td>
                                                <td>-</td>
                                                <td>-</td>
                                                <td>-</td>
                                                <td>-</td>
                                                <td>-</td>
                                                <td>-</td>
                                                <td>-</td>
                                                <td>-</td>
                                                <td>-</td>
                                                <td>-</td>
                                                <td><strong>{this.state.selected_agent.outboundToday === undefined || this.state.selected_agent.inboundToday === undefined ? 0 : this.state.selected_agent.outboundToday + this.state.selected_agent.inboundToday}</strong></td>
                                                <td><strong>{this.getProjection(this.state.selected_agent.outboundToday === undefined || this.state.selected_agent.inboundToday === undefined ? 0 : this.state.selected_agent.outboundToday + this.state.selected_agent.inboundToday)}</strong></td>
                                            </tr>

                                        </tbody>
                                    </Table>
                                    <p style={{ color: "white" }} hidden={this.state.selected_agent.label.length < 1}>Call Count Last Updated: <strong>{new Date(this.state.selected_agent.callCountLastUpdated).toLocaleTimeString()}</strong></p>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row style={{ justifyContent: "center" }}>
                        <Col lg="6">
                            <Card className="text-center card-raised card-white" style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                <CardHeader>
                                    <CardTitle tag="h3"><p style={{ color: "white" }}><strong>Daily Performance Report for </strong></p><p style={{ color: "white" }}><strong>{this.state.agent.name}</strong></p></CardTitle>
                                </CardHeader>
                                <CardBody>
                                    {(() => {
                                        let index = this.state.top5.findIndex((ag) => {
                                            return ag.name === this.state.agent.name
                                        })

                                        let rank = index + 1;
                                        if (rank === 0) {
                                            rank = this.state.top5.length + 1;

                                        }
                                        return (
                                            <div>
                                                <h4 style={{ color: "white" }}>Appointment Count: <strong>{index === -1 ? 0 : this.state.top5[index].count}</strong></h4>
                                                <h4 style={{ color: "white" }}>Call Center Rank: <strong>#{rank}</strong></h4>
                                            </div>
                                        );


                                    })()}
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg="6">
                            <Card className="text-center card-raised card-white" color="primary" style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                <CardHeader>
                                    <CardTitle tag="h3"><p style={{ color: "white" }}><strong>MTD Performance Report for </strong></p><p style={{ color: "white" }}><strong>{this.state.agent.name}</strong></p></CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <CardImg top width="100%" hidden={!this.state.mtdtop5loading} src={this.props.utils.loading} style={{ backgroundColor: "white" }} />
                                    {(() => {
                                        let index = this.state.mtdTop5.findIndex((ag) => {
                                            return ag.name === this.state.agent.name
                                        })

                                        let rank = index + 1;
                                        if (rank === 0) {
                                            rank = this.state.mtdTop5.length + 1;

                                        }
                                        return (
                                            <div>
                                                <h4 style={{ color: "white" }}>Appointment Count: <strong>{index === -1 ? 0 : this.state.mtdTop5[index].count}</strong></h4>
                                                <h4 style={{ color: "white" }}>Call Center Rank: <strong>#{rank}</strong></h4>
                                            </div>
                                        );


                                    })()}
                                    {/* {

                                        this._isMounted && this.state.mtdTop5.map((a, i) => {
                                            let index = this.state.mtdTop5.findIndex((ag)=>{
                                                return ag._id === this.props.agent._id
                                            })
                                            let thisAgent = this._isMounted && this.state.mtdTop5.filter((a) => {
                                                return a._id === this.state.agent._id
                                            })
                                            thisAgent = thisAgent[0]
                                            if (i > 0) return null;
                                            let rank = 1
                                            for (let agent in this.state.mtdTop5) {
                                                if (this.state.mtdTop5[agent].count > thisAgent.count) {
                                                    rank++;
                                                }
                                                else {
                                                    break;
                                                }
                                            }
                                            return (
                                                <div key={i}>
                                                    <h4 style={{ color: "white" }}>Appointment Count: <strong>{thisAgent.count}</strong></h4>
                                                    <h4 style={{ color: "white" }}>Call Center Rank: <strong>#{rank}</strong></h4>
                                                </div>
                                            );
                                        })
                                    } */}
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row style={{ justifyContent: "center" }}>
                        <Col lg="6">
                            <Card className="card-raised card-white" style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                <CardHeader>
                                    <div className="tools float-right">
                                        {/* <Button
                      onClick={(e) => { e.preventDefault(); this.getTop5() }}
                    >

                      <i className={this.state.loading ? "tim-icons icon-refresh-02 tim-icons-is-spinning" : "tim-icons icon-refresh-02 "} />
                      
                    </Button> */}
                                    </div>
                                    <CardTitle tag="h3"><p style={{ color: "white" }}><strong>Top 10 Agents Today</strong></p></CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Table responsive >
                                        <thead className="text-primary" >
                                            <tr>
                                                <th style={{ borderBottom: "1px solid white" }} className="text-center"><p style={{ color: "white" }}>Rank</p></th>
                                                <th style={{ borderBottom: "1px solid white" }} className="text-center"><p style={{ color: "white" }}>Agent Name</p></th>
                                                <th style={{ borderBottom: "1px solid white" }} className="text-center"><p style={{ color: "white" }}># Approved Appointments</p></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this._isMounted && this.state.top5.map((agent, index) => {
                                                    if (index > 9 || agent.type === "admin") return null;
                                                    return (
                                                        <tr key={index} className="text-center" style={{ borderTop: "1px solid white" }}>
                                                            <td style={{ borderBottom: "1px solid white" }}><p style={{ color: "white" }}><strong>{index + 1}</strong></p></td>
                                                            <td style={{ borderBottom: "1px solid white" }}><p style={{ color: "white" }}><strong>{agent.name}</strong></p></td>
                                                            <td style={{ borderBottom: "1px solid white" }}><p style={{ color: "white" }}><strong>{agent.count}</strong></p></td>
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
                                    <CardTitle tag="h3"><p style={{ color: "white" }}><strong>Top 10 Agents MTD</strong></p></CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <CardImg top width="100%" src={this.props.utils.loading} hidden={!this.state.mtdtop5loading} style={{ backgroundColor: "white" }} />
                                    <Table responsive style={this.state.mtdtop5loading ? { display: "none" } : {}}>
                                        <thead className="text-primary" >
                                            <tr >
                                                <th style={{ borderBottom: "1px solid white" }} className="text-center"><p style={{ color: "white" }}>Rank</p></th>
                                                <th style={{ borderBottom: "1px solid white" }} className="text-center"><p style={{ color: "white" }}>Agent Name</p></th>
                                                <th style={{ borderBottom: "1px solid white" }} className="text-center"><p style={{ color: "white" }}># Approved Appointments</p></th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            {
                                                this._isMounted && this.state.mtdTop5.map((agent, index) => {
                                                    if (index > 9 || agent.type === "admin") return null;
                                                    return (
                                                        <tr key={index} className="text-center" >
                                                            <td style={{ borderBottom: "1px solid white" }}><p style={{ color: "white" }}><strong>{index + 1}</strong></p></td>
                                                            <td style={{ borderBottom: "1px solid white" }}><p style={{ color: "white" }}><strong>{agent.name}</strong></p></td>
                                                            <td style={{ borderBottom: "1px solid white" }}><p style={{ color: "white" }}><strong>{agent.count}</strong></p></td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </Table>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row style={{ justifyContent: "center" }}>
                        <Col lg="12">
                            <Card className="card-raised card-white" hidden={!this.state.isAdmin} style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                <CardHeader>


                                    <CardTitle tag="h3"><p style={{ color: "white" }}><strong>Created Appointments</strong></p></CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Table responsive>
                                        <thead className="text-primary">
                                            <tr>

                                                <th style={{ color: "white", borderBottom: "1px solid white" }}>Agent Name</th>
                                                <th style={{ color: "white", borderBottom: "1px solid white" }}>Today</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this._isMounted && this.state.top5.map((app, index) => {
                                                    return (
                                                        <tr key={index}>

                                                            <td key={index + "-name"} style={{ borderBottom: "1px solid white" }}><p style={{ color: "white" }}><strong>{app.name}</strong></p></td>
                                                            <td key={index + "-day"} style={{ borderBottom: "1px solid white" }}><p style={{ color: "white" }}><strong>{app.count}</strong></p></td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </Table>
                                </CardBody>
                            </Card>

                        </Col>
                    </Row>
                </div>
            </>
        );
    }
}

export default ServiceDashboard;
