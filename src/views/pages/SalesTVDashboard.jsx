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

// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
// reactstrap components
import {
    Button,
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
import logo from "../../assets/img/logo.png";
class SalesTVDashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {},
            agent: {},
            agents: [],
            dealerships: [],
            totalCallCountToday: 0,
            totalApptCountToday: 0,
            callSortedAgents: [],
            callMTDSortedAgents: [],
            apptMtdLoading: false,
            callsMtdLoading: false,
            apptMtdTotal: 0,
            totalCallCountMTD: 0,
            mtdDataLoading: false,
            mtdApps: []
        };
        this.getDepartmentCallCount = this.getDepartmentCallCount.bind(this)
        this.getDepartmentApptCount = this.getDepartmentApptCount.bind(this)
        this.getApptsMTD = this.getApptsMTD.bind(this)
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
        let user = this._isMounted && await this.props.mongo.getActiveUser(this.props.mongo.mongodb)
        if (user.userId == undefined) {
            this.props.history.push("/auth/login");
            return;
        }

        let agent = this._isMounted && await this.props.mongo.findOne("agents", { "userId": user.userId })
        let agents = this._isMounted && await this.props.mongo.find("agents", { "department": "sales", isActive: true, account_type: "agent" })
        agents = agents.sort((a, b) => {
            if (a.appointments.length > b.appointments.length) return -1;
            if (a.appointments.length < b.appointments.length) return 1;
            return 0
        })
        this._isMounted && this.setState({ agent, user, agents });
        this._isMounted && this.getMTDData();
        this._isMounted && this.getDepartmentCallCount()
        this._isMounted && this.getDepartmentApptCount()
        this._isMounted && this.getApptsMTD()
        this._isMounted && this.getDepartmentCallCountMTD()
        this._isMounted && await this.setState({ loading: false })

    }
    componentWillUnmount() {
        this._isMounted = false
        document.body.classList.toggle("sidebar-mini");
    }
    async getDepartmentCallCount() {
        let { agents } = this.state;
        let totalCallCountToday = 0;
        for (let a in agents) {
            totalCallCountToday += agents[a].inboundToday + agents[a].outboundToday;
        }
        this._isMounted && await this.setState({ totalCallCountToday })
        let callSortedAgents = agents.slice().sort((a, b) => {
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
            if (agents[a].inboundMTD == undefined || agents[a].outboundMTD == undefined) { continue }
            totalCallCountMTD += agents[a].inboundMTD + agents[a].outboundMTD
        }
        this._isMounted && await this.setState({ totalCallCountMTD })
        let callMTDSortedAgents = agents.slice().sort((a, b) => {
            if ((a.inboundMTD + a.outboundMTD) > (b.inboundMTD + b.outboundMTD)) return -1;
            if ((a.inboundMTD + a.outboundMTD) < (b.inboundMTD + b.outboundMTD)) return 1;
            return 0;
        })
        this._isMounted && await this.setState({ callMTDSortedAgents })
    }
    async getDepartmentApptCount() {
        let { agents } = this.state;
        let totalApptCountToday = 0;
        for (let a in agents) {
            totalApptCountToday += agents[a].appointments.length
        }
        this._isMounted && await this.setState({ totalApptCountToday })
    }
    async getApptsMTD() {
        this._isMounted && this.setState({ apptMtdLoading: true })
        let apptMtdTotal = await this.props.mongo.findOne("admin_dashboard", { label: "centralbdc_metrics" })
        apptMtdTotal = apptMtdTotal.total_mtd;
        this._isMounted && this.setState({ apptMtdLoading: false, apptMtdTotal })
    }
    refreshPage() {
        window.location.reload(false);
    }
    getBreakDown(agent) {
        let appointments = agent.appointments
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
            let count = appointments.filter((a) => {
                return new Date(a.verified).getTime() >= start.getTime() && new Date(a.verified).getTime() < end.getTime()
            })
            if (count.length == 2) {
                color = "yellow"
            }
            if (count.length > 2) {
                color = "green"
            }
            counts[i + 7] = { count: count.length, color }
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
    async getMTDData() {
        this.setState({ mtdDataLoading: true })
        let dealerships = await this.props.mongo.find("dealerships", { isSales: true, isActive: true })
        this.setState({ dealerships })
        let agents = this.state.agents
        this.setState({ mtdDataLoading: false })
        for (let a in agents) {
            this.getAgentMTDData(agents[a])
        }
    }
    async getAgentMTDData(agent) {
        let { agents, dealerships } = this.state
        let agentIndex = agents.findIndex((a) => {
            return a.email === agent.email
        })
        let apps = agents[agentIndex].appointments;
        let all_apps = await this.props.mongo.find("all_appointments", { agent_id: agent._id })
        apps = apps.concat(all_apps)
        apps = apps.filter((a) => {
            if (a.dealership_department === "Service") return false
            if (a.dealership == undefined) { console.log(Object.keys(a)) }
            let found = false;
            for (let d in dealerships) {

                if (dealerships[d].value === a.dealership.value) {
                    found = true;
                    break;
                }
            }
            return found;
        })
        let first = new Date(new Date().setDate(1))
        first = new Date(first.setHours(0, 0, 0, 0))
        apps = apps.filter((a) => {
            return new Date(a.verified).getTime() >= first.getTime()
        })

        let agent_MTD = apps.filter((a) => {
            // console.log(a.agent_id, agent._id)
            return a.agent_id == agent._id
        })
        agent.agent_MTD = agent_MTD.length;
        first = new Date().setDate(1)
        first = new Date(first).setHours(1, 1, 1, 1)
        let daysElapsed = (new Date().getTime() - new Date(first).getTime()) / (1000 * 3600 * 24)
        agent.agent_MTD_Avg = Math.round(10 * agent.agent_MTD / daysElapsed) / 10;

        let sevenDaysAgo = new Date(new Date().setDate(new Date().getDate() - 7)).setHours(0, 0, 0, 0)
        let sevenElapsed = (new Date().getTime() - new Date(sevenDaysAgo).getTime()) / (1000 * 3600 * 24)

        let sevenDaysTD = agent_MTD.filter((a) => {
            return new Date(a.verified).getTime() >= new Date(sevenDaysAgo).getTime()
        })
        agent.seven_day_avg = Math.round(10 * sevenDaysTD.length / sevenElapsed) / 10;

        //get mtd high
        let dayMs = 1000 * 60 * 60 * 24;
        let dict = {};
        let max = 0;
        for (let a in agent_MTD) {
            let verified = new Date(agent_MTD[a].verified)
            let key = `${verified.getMonth()}_${verified.getDate()}_${verified.getFullYear()}`
            if (dict[key] === undefined) {
                dict[key] = 0
            }
            dict[key]++;
            if (dict[key] > max) {
                max = dict[key]
            }
        }
        // console.log(dict, "max:", max)
        agent.mtdHigh = max;
        for (let a in agents) {
            if (agents[a].name === agent.name) {
                agents[a] = agent;
                break;
            }
        }
        agents.sort((a, b) => {
            return b.agent_MTD - a.agent_MTD
        })
        this.setState({ agents })
        // console.log(agents)
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
                                    {/* <h3 style={{ color: "white" }}>Close Ratio Today: <strong>{Math.round(1000 * this.state.totalApptCountToday / this.state.totalCallCountToday) / 10}%</strong></h3>
                                    <h3 style={{ color: "white" }}>Close Ratio MTD: <strong>{Math.round(1000 * this.state.apptMtdTotal / this.state.totalCallCountMTD) / 10}%</strong></h3> */}
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
                                            {this.state.callSortedAgents.map((a, i) => {
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
                                            {this.state.agents.map((a, i) => {
                                                // if (i > 0) return null
                                                return <tr key={i}>
                                                    <td style={{ borderBottom: "1px solid white" }}><p style={{ color: "white" }}><strong>{i + 1}</strong></p></td>
                                                    <td style={{ borderBottom: "1px solid white" }}><p style={{ color: "white" }}><strong>{a.name}</strong></p></td>
                                                    <td style={{ borderBottom: "1px solid white" }}><p style={{ color: "white" }}><strong>{a.agent_MTD || "Loading.."}</strong></p></td>
                                                    <td style={{ borderBottom: "1px solid white" }}><p style={{ color: "white" }}><strong>{a.agent_MTD_Avg || "Loading.."}</strong></p></td>
                                                    <td style={{ borderBottom: "1px solid white" }}><p style={{ color: "white" }}><strong>{a.seven_day_avg || "Loading.."}</strong></p></td>
                                                    <td style={{ borderBottom: "1px solid white" }}><p style={{ color: "white" }}><strong>{a.mtdHigh || "Loading.."}</strong></p></td>
                                                    <td style={{ borderBottom: "1px solid white" }}><p style={{ color: "white" }}><strong>{a.personalRecord || "Loading.."}</strong></p></td>
                                                </tr>
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
                                            {this.state.callMTDSortedAgents.map((a, i) => {
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
                                            {this.state.agents.map((a, i) => {
                                                if (i > 9) return null
                                                return <tr key={i}>
                                                    <td style={{ borderBottom: "1px solid white" }}><p style={{ color: "white" }}><strong>{i + 1}</strong></p></td>
                                                    <td style={{ borderBottom: "1px solid white" }}><p style={{ color: "white" }}><strong>{a.name}</strong></p></td>
                                                    <td style={{ borderBottom: "1px solid white" }}><p style={{ color: "white" }}><strong>{a.appointments.length}</strong></p></td>
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
