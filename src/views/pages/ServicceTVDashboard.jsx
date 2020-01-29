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
class ServiceTVDashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {},
            agent: {},
            agents: [],
            totalCallCountToday: 0,
            totalApptCountToday: 0,
            callSortedAgents: [],
            apptMtdLoading: false,
            callsMtdLoading: false,
            apptMtdTotal: 0,
            totalCallCountMTD: 0
        };
        this.getDepartmentCallCount = this.getDepartmentCallCount.bind(this)
        this.getDepartmentApptCount = this.getDepartmentApptCount.bind(this)
        this.getApptsMTD = this.getApptsMTD.bind(this)
        this.getDepartmentCallCountMTD = this.getDepartmentCallCountMTD.bind(this)
    }
    _isMounted = false;
    async componentDidMount() {
        this._isMounted = true
        document.body.classList.toggle("sidebar-mini");
        setInterval(() => {
            this.refreshPage()
        }, 300000);
        this._isMounted && this.setState({ loading: true })
        let user = this._isMounted && await this.props.mongo.getActiveUser(this.props.mongo.mongodb)
        if (user.userId == undefined) {
            this.props.history.push("/auth/login");
            return;
        }

        let agent = this._isMounted && await this.props.mongo.findOne("agents", { "userId": user.userId })
        let agents = this._isMounted && await this.props.mongo.find("agents", { "department": "service", isActive: true, account_type: "agent" })
        this._isMounted && agents.sort((a, b) => {
            if (a.appointments.length > b.appointments.length) return -1;
            if (a.appointments.length < b.appointments.length) return 1;
            return 0
        })
        let callSortedAgents = this._isMounted && await this.props.mongo.find("agents", { "department": "service", isActive: true, account_type: "agent" });
        this._isMounted && callSortedAgents.sort((a, b) => {
            if ((a.inboundToday + a.outboundToday) > (b.inboundToday + b.outboundToday)) return -1;
            if ((a.inboundToday + a.outboundToday) < (b.inboundToday + b.outboundToday)) return 1;
            return 0;
        })
        this._isMounted && this.setState({ agent, user, agents, callSortedAgents })
        this._isMounted && await this.getDepartmentCallCount()
        this._isMounted && await this.getDepartmentApptCount()
        this._isMounted && await this.getApptsMTD()
        this._isMounted && await this.getDepartmentCallCountMTD()
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
    }
    async getDepartmentCallCountMTD() {
        let { agents } = this.state;
        let totalCallCountMTD = 0;
        for (let a in agents) {
            if (agents[a].inboundMTD == undefined || agents[a].outboundMTD == undefined) { continue }
            totalCallCountMTD += agents[a].inboundMTD + agents[a].outboundMTD
        }
        this._isMounted && await this.setState({ totalCallCountMTD })
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
        let { agents } = this.state
        let thisMonth = new Date();
        thisMonth = new Date(thisMonth.setDate(1))
        thisMonth = new Date(thisMonth.setHours(0, 0, 0, 0))
        let apptMtdTotal = 0;
        for (let a in agents) {
            let query = { agent_id: agents[a]._id.toString() }
            let agent_apps = this._isMounted && await this.props.mongo.find("all_appointments", query)
            agent_apps = this._isMounted && agent_apps.filter((a) => {
                return new Date(a.verified).getTime() >= thisMonth.getTime()
            })
            apptMtdTotal += agent_apps.length
        }
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
            let count = this._isMounted && appointments.filter((a) => {
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
                            <h1 style={{ background: "-webkit-linear-gradient(#1d67a8, #000000)", "WebkitBackgroundClip": "text", "WebkitTextFillColor": "transparent" }}><strong>Service Department</strong></h1>
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
                    <Col md="5">
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
                                            <th style={{ color: "white", borderBottom: "white 1px solid" }}>Outbound</th>
                                            <th style={{ color: "white", borderBottom: "white 1px solid" }}>Inbound</th>
                                            <th style={{ color: "white", borderBottom: "white 1px solid" }}>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this._isMounted && this.state.callSortedAgents.map((a, i) => {
                                            if (i > 9) return null
                                            return (<tr key={i}>
                                                <td style={{ borderBottom: "white 1px solid" }}><p style={{ color: "white" }}><strong>{i + 1}</strong></p></td>
                                                <td style={{ borderBottom: "white 1px solid" }}><p style={{ color: "white" }}><strong>{a.name}</strong></p></td>
                                                <td style={{ borderBottom: "white 1px solid" }}><p style={{ color: "white" }}><strong>{a.outboundToday}</strong></p></td>
                                                <td style={{ borderBottom: "white 1px solid" }}><p style={{ color: "white" }}><strong>{a.inboundToday}</strong></p></td>
                                                <td style={{ borderBottom: "white 1px solid" }}><p style={{ color: "white" }}><strong>{a.inboundToday + a.outboundToday}</strong></p></td>
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
                                        {this._isMounted && this.state.agents.map((a, i) => {
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
                <Row style={{ justifyContent: "center", textAlign: "center" }}>
                    <Col md="5">

                    </Col>
                </Row>
            </div>
            </>
        );
    }
}

export default ServiceTVDashboard;
