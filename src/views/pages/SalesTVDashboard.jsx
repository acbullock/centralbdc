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
    CardBody,
    CardTitle,
    Table,
    Row,
    Col,
} from "reactstrap";
import logo from "../../assets/img/logo.png";
class SalesTVDashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            agent: {},
            agents: [],
            totalCallCountToday: 0,
            totalApptCountToday: 0,
            callSortedAgents: [],
            callMTDSortedAgents: [],
            apptMtdLoading: false,
            callsMtdLoading: false,
            apptMtdTotal: 0,
            totalCallCountMTD: 0,
            mtdDataLoading: false,
            mtdApps: [],
            todayAgents: []
        };
        this.getDepartmentCallCount = this.getDepartmentCallCount.bind(this)
        this.getDepartmentApptCount = this.getDepartmentApptCount.bind(this)
        this.getDepartmentCallCountMTD = this.getDepartmentCallCountMTD.bind(this)
        this.getMTDData = this.getMTDData.bind(this)
    }
    _isMounted = false;
    async componentDidMount() {
        this._isMounted = true
        document.body.classList.toggle("sidebar-mini");
        setInterval(() => {
            this.refreshPage()
        }, 900000);
        this._isMounted && this.setState({ loading: true })
        let agents = this._isMounted && await this.props.mongo.find("agents", {
            department: "sales",
            isActive: true,
            account_type: "agent"
        }, {
            projection: {
                name: 1,
                inboundToday: 1,
                outboundToday: 1,
                inboundMTD: 1,
                outboundMTD: 1,
                "appointments.verified": 1,
                callCountLastUpdated: 1,
                personalRecord: 1
            }
        })
        let groupedToday = await this.props.mongo.aggregate("all_appointments", [
            {
                "$match": {
                    dealership_department: {
                        "$ne": "Service"
                    },
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
                    },
                    "name": { "$first": "$_id" }
                }
            },
            {
                "$sort": {
                    "count": -1
                }
            }
        ])
        for(let ap in groupedToday){
            let index = agents.findIndex((ag)=>{
                return ag._id === groupedToday[ap]._id
            })
            if(index === -1)continue
            groupedToday[ap].name = agents[index].name
        }
        this.setState({ todayAgents: groupedToday })
        this._isMounted && this.setState({ agent: this.props.agent, agents });
        this._isMounted && this.getMTDData();
        this._isMounted && this.getDepartmentCallCount()
        this._isMounted && this.getDepartmentApptCount()
        this._isMounted && this.getDepartmentCallCountMTD()
        this._isMounted && await this.setState({ loading: false })

    }
    componentWillMount() {
        if (this.props.agent.account_type !== "admin") {
            this.props.history.push("/admin/dashboard")
            return;
        }
    }
    componentWillUnmount() {
        this._isMounted = false
        document.body.classList.toggle("sidebar-mini");
        window.stop()
    }
    async getDepartmentCallCount() {
        let { agents } = this.state;
        let totalCallCountToday = 0;
        for (let a in agents) {
            totalCallCountToday += agents[a].inboundToday + agents[a].outboundToday;
        }
        this._isMounted && await this.setState({ totalCallCountToday })
        let callSortedAgents = this._isMounted && agents.slice().sort((a, b) => {
            if ((a.inboundToday + a.outboundToday) > (b.inboundToday + b.outboundToday)) return -1;
            if ((a.inboundToday + a.outboundToday) < (b.inboundToday + b.outboundToday)) return 1;
            return 0;
        })
        this._isMounted && await this.setState({ callSortedAgents })
    }
    async getDepartmentCallCountMTD() {
        let { agents } = this.state;
        let totalCallCountMTD = 0;
        for (let a in agents) {
            if (agents[a].inboundMTD === undefined || agents[a].outboundMTD === undefined) { continue }
            totalCallCountMTD += agents[a].inboundMTD + agents[a].outboundMTD
        }
        this._isMounted && await this.setState({ totalCallCountMTD })
        let callMTDSortedAgents = this._isMounted && agents.slice().sort((a, b) => {
            if ((a.inboundMTD + a.outboundMTD) > (b.inboundMTD + b.outboundMTD)) return -1;
            if ((a.inboundMTD + a.outboundMTD) < (b.inboundMTD + b.outboundMTD)) return 1;
            return 0;
        })
        this._isMounted && await this.setState({ callMTDSortedAgents })
    }
    async getDepartmentApptCount() {
        let totalApptCountToday = await this.props.mongo.count("all_appointments", {
            dealership_department: {
                "$ne": "Service"
            },
            verified: {
                "$gte": new Date(new Date().setHours(0, 0, 0, 0)).toISOString()
            }
        })
        totalApptCountToday = totalApptCountToday.count
        this._isMounted && await this.setState({ totalApptCountToday })
    }
    refreshPage() {
        window.location.reload(false);
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
    async getMTDData() {
        this._isMounted && this.setState({ mtdDataLoading: true, apptMtdLoading: false, apptMtdTotal: "Loading.." })
        let agents = this.state.agents
        let first = new Date(new Date(new Date().setDate(1)).setHours(0, 0, 0, 0))
        let sevenDaysAgo = new Date(new Date(new Date().setDate(new Date().getDate() - 7)))

        let mtd_appts = await this.props.mongo.find("all_appointments", {
            dealership_department: { "$ne": "Service" },
            verified: { "$gte": first.toISOString() }
        }, { projection: { _id: 1, agent_id: 1 } })

        this._isMounted && this.setState({ mtdDataLoading: false })
        this.setState({ apptMtdLoading: false, apptMtdTotal: mtd_appts.length })
        let seven_day_apps = await this.props.mongo.find("all_appointments", {
            dealership_department: { "$ne": "Service" },
            verified: { "$gte": sevenDaysAgo.toISOString() }
        }, { projection: { _id: 1, agent_id: 1 } })
        for (let a in agents) {
            this._isMounted && this.getAgentMTDData(agents[a], mtd_appts, seven_day_apps)
        }
        agents = this._isMounted && this.state.agents.slice().sort((a, b) => {
            if (a.agent_MTD > b.agent_MTD) return -1;
            if (a.agent_MTD < b.agent_MTD) return 1;
            return 0;
        })
        this.setState({ agents })
    }
    async getAgentMTDData(agent, mtd_apps, seven_day_apps) {
        let first = new Date(new Date(new Date().setDate(1)).setHours(0, 0, 0, 0))
        let agentAllApps = mtd_apps.filter((app) => {
            return app.agent_id === agent._id
        })
        seven_day_apps = seven_day_apps.filter((app) => {
            return app.agent_id === agent._id
        })
        agent.agent_MTD = agentAllApps.length


        let daysElapsed = (new Date().getTime() - new Date(first).getTime()) / (1000 * 3600 * 24)
        agent.agent_MTD_Avg = Math.round(10 * agent.agent_MTD / daysElapsed) / 10;


        let sevenDaysAgo = new Date(new Date(new Date().setDate(new Date().getDate() - 7)).setHours(0, 0, 0, 0))
        let sevenElapsed = (new Date().getTime() - new Date(sevenDaysAgo).getTime()) / (1000 * 3600 * 24)
        let sevenDaysTD = seven_day_apps
        agent.seven_day_avg = Math.round(10 * sevenDaysTD.length / (sevenElapsed)) / 10;
        //get mtd high
        let dict = {};
        let max = 0;
        for (let a in agentAllApps) {
            let verified = new Date(agentAllApps[a].verified)
            let key = `${verified.getMonth()}_${verified.getDate()}_${verified.getFullYear()}`
            if (dict[key] === undefined) {
                dict[key] = 0
            }
            dict[key]++;
            if (dict[key] > max) {
                max = dict[key]
            }
        }
        agent.mtdHigh = max;

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
                    <Row style={{ textAlign: "center" }}>
                        <Col md="12" >
                            <img src={logo} alt="react-logo" height="100" style={{ textAlign: "center", display: "block", margin: "auto" }} />
                            <h1 style={{ background: "-webkit-linear-gradient(#1d67a8, #000000)", "WebkitBackgroundClip": "text", "WebkitTextFillColor": "transparent" }}><strong>Sales Department</strong></h1>
                            {/* <h1 style={{ color: "#1d67a8", textAlign: "center" }}><strong>Service Department</strong></h1> */}
                        </Col>
                    </Row>
                    <br />
                    <Row style={{ justifyContent: "center" }}>
                        <Col md="5">
                            <Card className="card-raised card-white text-center" style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                <CardBody>
                                    <h2 style={{ color: "white" }}><strong>Total Calls</strong></h2>
                                    <h3 style={{ color: "white" }}>Today: <strong>{this.state.totalCallCountToday}</strong></h3>
                                    <h3 style={{ color: "white" }}>MTD: <strong>{this.state.totalCallCountMTD}</strong></h3>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md="5">
                            {/* style={{ background: "linear-gradient(45deg, #1d67a8 0%, #ffffff 100%)" }} */}
                            <Card className="card-raised card-white text-center" style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                <CardBody>
                                    <h3 style={{ color: "white" }}><strong>Total Appointments</strong></h3>
                                    <h3 style={{ color: "white" }}>Today: <strong>{this.state.totalApptCountToday}</strong></h3>
                                    <h3 style={{ color: "white" }}>MTD: <strong>{this.state.apptMtdTotal}</strong></h3>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    <Row style={{ justifyContent: "center", textAlign: "center" }}>
                        <Col md="10">
                            <Card className="card-raised card-white text-center" style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                <CardTitle>
                                    <h3 style={{ color: "white" }}><strong>Appointments</strong></h3>
                                </CardTitle>
                                <CardBody>
                                    <CardImg top width="100%" src={this.props.utils.loading} hidden={!this.state.apptMtdLoading} />
                                    <Table striped hidden={this.state.apptMtdLoading}>
                                        <thead>
                                            <tr>
                                                <th style={{ color: "white", borderBottom: "1px solid white" }}>#</th>
                                                <th style={{ color: "white", borderBottom: "1px solid white" }}>Name</th>
                                                <th style={{ color: "white", borderBottom: "1px solid white" }}>Appt Count MTD</th>
                                                <th style={{ color: "white", borderBottom: "1px solid white" }}>MTD Average</th>
                                                <th style={{ color: "white", borderBottom: "1px solid white" }}>7 Day Average</th>
                                                <th style={{ color: "white", borderBottom: "1px solid white" }}>MTD High</th>
                                                <th style={{ color: "white", borderBottom: "1px solid white" }}>Record</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this._isMounted && this.state.agents.map((a, i) => {
                                                // console.log(a.appointments.length, a.personalRecord, a.name)
                                                // if (i > 0) return null
                                                return <tr key={i}>
                                                    <td style={{ borderBottom: "1px solid white" }}><p style={{ color: a.appointments.length >= a.personalRecord ? "yellow" : "white" }}><strong>{i + 1}</strong></p></td>
                                                    <td style={{ borderBottom: "1px solid white" }}><p style={{ color: a.appointments.length >= a.personalRecord ? "yellow" : "white" }}><strong>{a.name}</strong></p></td>
                                                    <td style={{ borderBottom: "1px solid white" }}><p style={{ color: a.appointments.length >= a.personalRecord ? "yellow" : "white" }}><strong>{a.agent_MTD === undefined ? "Loading.." : a.agent_MTD}</strong></p></td>
                                                    <td style={{ borderBottom: "1px solid white" }}><p style={{ color: a.appointments.length >= a.personalRecord ? "yellow" : "white" }}><strong>{a.agent_MTD_Avg === undefined ? "Loading.." : a.agent_MTD_Avg}</strong></p></td>
                                                    <td style={{ borderBottom: "1px solid white" }}><p style={{ color: a.appointments.length >= a.personalRecord ? "yellow" : "white" }}><strong>{a.seven_day_avg === undefined ? "Loading.." : a.seven_day_avg}</strong></p></td>
                                                    <td style={{ borderBottom: "1px solid white" }}><p style={{ color: a.appointments.length >= a.personalRecord ? "yellow" : "white" }}><strong>{a.mtdHigh === undefined ? "Loading.." : a.mtdHigh}</strong></p></td>
                                                    <td style={{ borderBottom: "1px solid white" }}><p style={{ color: a.appointments.length >= a.personalRecord ? "yellow" : "white" }}><strong>{a.personalRecord === undefined ? "Loading.." : a.personalRecord}</strong></p></td>
                                                </tr>
                                            })}
                                        </tbody>
                                    </Table>
                                </CardBody>
                            </Card>

                        </Col>
                    </Row>
                    <Row style={{ justifyContent: "center", textAlign: "center" }}>
                        <Col md="10">
                            <Card className="card-raised card-white text-center" style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                <CardTitle>
                                    <h3 style={{ color: "white" }}><strong>Calls Today</strong></h3>
                                </CardTitle>
                                <CardBody>
                                    <CardImg top width="100%" src={this.props.utils.loading} hidden={!this.state.callsMtdLoading} />
                                    <Table striped hidden={this.state.callsMtdLoading}>
                                        <thead>
                                            <tr>
                                                <th style={{ color: "white", borderBottom: "white 1px solid" }}>#</th>
                                                <th style={{ color: "white", borderBottom: "white 1px solid" }}>Name</th>
                                                <th style={{ color: "white", borderBottom: "white 1px solid" }}>Inbound</th>
                                                <th style={{ color: "white", borderBottom: "white 1px solid" }}>Outbound</th>
                                                <th style={{ color: "white", borderBottom: "white 1px solid" }}>Total</th>
                                                <th style={{ color: "white", borderBottom: "white 1px solid" }}>Last Updated</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this._isMounted && this.state.callSortedAgents.map((a, i) => {
                                                if (i > 9) return null
                                                return (<tr key={i}>
                                                    <td style={{ borderBottom: "white 1px solid" }}><p style={{ color: "white" }}><strong>{i + 1}</strong></p></td>
                                                    <td style={{ borderBottom: "white 1px solid" }}><p style={{ color: "white" }}><strong>{a.name}</strong></p></td>
                                                    <td style={{ borderBottom: "white 1px solid" }}><p style={{ color: "white" }}><strong>{a.inboundToday}</strong></p></td>
                                                    <td style={{ borderBottom: "white 1px solid" }}><p style={{ color: "white" }}><strong>{a.outboundToday}</strong></p></td>
                                                    <td style={{ borderBottom: "white 1px solid" }}><p style={{ color: "white" }}><strong>{a.inboundToday + a.outboundToday}</strong></p></td>
                                                    <td style={{ borderBottom: "white 1px solid" }}><p style={{ color: "white" }}><strong>{new Date(a.callCountLastUpdated).toLocaleTimeString()}</strong></p></td>
                                                </tr>)
                                            })}
                                        </tbody>
                                    </Table>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row style={{ justifyContent: "center", textAlign: "center" }}>
                        <Col md="5">
                            <Card className="card-raised card-white text-center" style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                <CardTitle>
                                    <h3 style={{ color: "white" }}><strong>Calls MTD</strong></h3>
                                </CardTitle>
                                <CardBody>
                                    <CardImg top width="100%" src={this.props.utils.loading} hidden={!this.state.callsMtdLoading} />
                                    <Table striped hidden={this.state.callsMtdLoading}>
                                        <thead>
                                            <tr>
                                                <th style={{ color: "white", borderBottom: "white 1px solid" }}>#</th>
                                                <th style={{ color: "white", borderBottom: "white 1px solid" }}>Name</th>
                                                <th style={{ color: "white", borderBottom: "white 1px solid" }}>Outbound</th>
                                                <th style={{ color: "white", borderBottom: "white 1px solid" }}>Inbound</th>
                                                <th style={{ color: "white", borderBottom: "white 1px solid" }}>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this._isMounted && this.state.callMTDSortedAgents.map((a, i) => {
                                                if (isNaN(a.inboundMTD) || isNaN(a.outboundMTD)) return null
                                                // if (i > 9) return null
                                                return (<tr key={i}>
                                                    <td style={{ borderBottom: "white 1px solid" }}><p style={{ color: "white" }}><strong>{i + 1}</strong></p></td>
                                                    <td style={{ borderBottom: "white 1px solid" }}><p style={{ color: "white" }}><strong>{a.name}</strong></p></td>
                                                    <td style={{ borderBottom: "white 1px solid" }}><p style={{ color: "white" }}><strong>{a.outboundMTD}</strong></p></td>
                                                    <td style={{ borderBottom: "white 1px solid" }}><p style={{ color: "white" }}><strong>{a.inboundMTD}</strong></p></td>
                                                    <td style={{ borderBottom: "white 1px solid" }}><p style={{ color: "white" }}><strong>{a.inboundMTD + a.outboundMTD}</strong></p></td>
                                                </tr>)
                                            })}
                                        </tbody>
                                    </Table>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md="5">
                            <Card className="card-raised card-white text-center" style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                <CardTitle>
                                    <h3 style={{ color: "white" }}><strong>Appointments Today</strong></h3>
                                </CardTitle>
                                <CardBody>
                                    <CardImg top width="100%" src={this.props.utils.loading} hidden={!this.state.apptMtdLoading} />
                                    <Table striped hidden={this.state.apptMtdLoading}>
                                        <thead>
                                            <tr>
                                                <th style={{ color: "white", borderBottom: "1px solid white" }}>#</th>
                                                <th style={{ color: "white", borderBottom: "1px solid white" }}>Name</th>
                                                <th style={{ color: "white", borderBottom: "1px solid white" }}>Appt Count</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this._isMounted && this.state.todayAgents.map((a, i) => {
                                                if (i > 9) return null
                                                return <tr key={i}>
                                                    <td style={{ borderBottom: "1px solid white" }}><p style={{ color: "white" }}><strong>{i + 1}</strong></p></td>
                                                    <td style={{ borderBottom: "1px solid white" }}><p style={{ color: "white" }}><strong>{a.name}</strong></p></td>
                                                    <td style={{ borderBottom: "1px solid white" }}><p style={{ color: "white" }}><strong>{a.count}</strong></p></td>
                                                </tr>
                                            })}
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

export default SalesTVDashboard;
