import React from "react";
// reactstrap components
import {
    Card,
    CardImg,
    Container,
    CardBody,
    CardTitle,
    Row,
    Col,
    Table,
    Modal,
    ModalHeader,
    ModalBody,

} from "reactstrap";

import gold from "../../assets/img/gold.png"
import silver from "../../assets/img/silver.png"
import bronze from "../../assets/img/bronze.png"
import deathRowLogo from "../../assets/img/deathrow.png"
import newZealandLogo from "../../assets/img/newzealand.png"
import dreamchaserLogo from "../../assets/img/dream-chasers.png"
import trendsetterLogo from "../../assets/img/trendsetters.png"
import immortalsLogo from "../../assets/img/immortals.png"
import defaultLogo from "../../assets/img/default-logo.png"
class TeamStandings extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            teamCounts: [],
            modalOpen: false,
            selected_team: {},
            all_apps: [],
            agents: [],
            modalTeam: []

        }
        this._isMounted = false
        this.refreshPage = this.refreshPage.bind(this)
    }
    async componentWillMount() {
        this._isMounted = true;
        this._isMounted && this.setState({ loading: true })
        let logos = {
            "New Zealand": newZealandLogo,
            "DeathRow": deathRowLogo,
            "The Immortals": immortalsLogo,
            "TrendSetters": trendsetterLogo,
            "DreamChaser": dreamchaserLogo
        }
        let all_apps = this._isMounted && await this.props.mongo.aggregate("all_appointments", [
            {
                "$match": {
                    "dealership_department": {
                        "$ne": "Service"
                    },
                    "verified": {
                        "$gte": new Date(new Date(new Date().setDate(1)).setHours(0,0,0,0)).toISOString()
                    }
                }
            },
            {
                "$group": {
                    "_id": "$agent_id",
                    "count": { "$sum": 1 }
                }
            },
            {
                "$sort": {
                    "count": -1
                }
            }
        ])
        let agents = await this.props.mongo.find("agents", { isActive: true, department: "sales", account_type: "agent" }, { projection: { team: 1, name: 1 } })
        let dict = {}
        for (let app in all_apps) {
            let index = agents.findIndex((age) => {
                return age._id === all_apps[app]._id
            })
            if (index === -1)
                continue

            let current = agents[index]
            if (current.team.label === "Los Angeles Lakers") continue
            if (dict[current.team.label] === undefined) {
                dict[current.team.label] = {
                    count: all_apps[app].count,
                    numAgents: 1
                }
            }
            else {

                dict[current.team.label] = {
                    count: dict[current.team.label].count + all_apps[app].count,
                    numAgents: dict[current.team.label].numAgents + 1
                }
            }
        }
        let teamCounts = []
        for (let i in dict) {
            teamCounts.push({ name: i, count: dict[i].count, numAgents: dict[i].numAgents, logo: logos[i], avg: Math.round(10 * dict[i].count / dict[i].numAgents) / 10 })
        }
        this._isMounted && await teamCounts.sort((a, b) => {
            return b.avg - a.avg
        })

        this._isMounted && this.setState({ loading: false, teamCounts, all_apps, agents })

    }
    componentDidMount() {
        this._isMounted = true
        setInterval(() => {
            this.refreshPage()
        }, 900000);

    }
    componentWillUnmount() {
        this._isMounted = false
    }
    refreshPage() {
        window.location.reload(false);
    }
    getOpenTeam(team) {
        let curTeam = []
        for (let app in this.state.all_apps) {
            let index = this.state.agents.findIndex((agent) => {
                return agent._id === this.state.all_apps[app]._id
            })
            if (index === -1)
                continue

            if (this.state.agents[index].team.label === team.name) {
                curTeam.push({
                    name: this.state.agents[index].name,
                    count: this.state.all_apps[app].count
                })
            }
        }
        this.setState({ modalTeam: curTeam })
    }
    render() {
        if (this.state.loading) {
            return (
                <>
                    <div className="content">
                        <Container>
                            <Col className="ml-auto mr-auto text-center" md="6">
                                <CardImg alt="loading" top width="100%" src={this.props.utils.loading} />
                            </Col>
                        </Container>
                    </div>
                </>
            );
        }
        return (
            <div className="content">
                <Container>
                    <Row >
                        <Col sm="7">
                            <Row style={{ height: "100vh" }}>
                                <Col sm="12" style={{ height: "100%" }}>
                                    <Card onClick={() => { this.getOpenTeam(this.state.teamCounts[0]); this.setState({ modalOpen: true, selected_team: this.state.teamCounts[0] }) }} style={{ backgroundSize: "150px", backgroundPosition: "center", backgroundImage: "url(" + this.state.teamCounts[0].logo + "), linear-gradient(0deg, #000000 0%, #D4AF37 100%)", backgroundRepeat: "no-repeat, repeat", height: "60%", marginBottom: 10, cursor: "pointer" }} >
                                        <CardBody style={{ backgroundColor: "rgba(255,255,255,0.6)", margin: "5%" }}>
                                            <h3 className="text-center" style={{ fontWeight: "bolder", marginBottom: 0 }}>
                                                <img src={gold} width="30px" />
                                                <strong>
                                                    #1: {this.state.teamCounts[0].name}
                                                </strong>
                                            </h3>
                                            <hr />
                                            <h3 className="text-center" style={{ fontWeight: "bolder" }}><strong>MTD Average: {this.state.teamCounts[0].avg}</strong></h3>
                                            <h3 className="text-center" style={{ fontWeight: "bolder" }}><strong>MTD Count: {this.state.teamCounts[0].count}</strong></h3>
                                            <h3 className="text-center" style={{ fontWeight: "bolder" }}><strong>Agents: {this.state.teamCounts[0].numAgents}</strong></h3>
                                        </CardBody>
                                    </Card>
                                    <Card onClick={() => { this.getOpenTeam(this.state.teamCounts[1]); this.setState({ modalOpen: true, selected_team: this.state.teamCounts[1] }) }} style={{ backgroundSize: "150px", backgroundPosition: "center", backgroundImage: "url(" + this.state.teamCounts[1].logo + "), " + "linear-gradient(0deg, #000000 0%, #C0C0C0 100%)", backgroundRepeat: "no-repeat, repeat", height: "40%", marginBottom: 10, cursor: "pointer" }} >
                                        <CardBody style={{ backgroundColor: "rgba(255,255,255,0.6)", margin: "2%" }}>
                                            <h4 className="text-center" style={{ fontWeight: "bolder", marginBottom: 0 }}>
                                                <img src={silver} width="30px" />
                                                <strong>
                                                    #2: {this.state.teamCounts[1].name}
                                                </strong>
                                            </h4>
                                            <hr />
                                            <h4 className="text-center" style={{ fontWeight: "bolder" }}><strong>MTD Average: {this.state.teamCounts[1].avg}</strong></h4>
                                            <h4 className="text-center" style={{ fontWeight: "bolder" }}><strong>MTD Count: {this.state.teamCounts[1].count}</strong></h4>
                                            <h4 className="text-center" style={{ fontWeight: "bolder" }}><strong>Agents: {this.state.teamCounts[1].numAgents}</strong></h4>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                        <Col sm="4">
                            <Row style={{ height: "100vh" }}>
                                <Col sm="12" style={{ height: "100%" }}>
                                    <Card onClick={() => { this.getOpenTeam(this.state.teamCounts[2]); this.setState({ modalOpen: true, selected_team: this.state.teamCounts[2] }) }} style={{ backgroundSize: "75px", backgroundPosition: "center", backgroundImage: "url(" + this.state.teamCounts[2].logo + "), " + "linear-gradient(0deg, #000000 0%, #cd7f32 100%)", backgroundRepeat: "no-repeat, repeat", height: "33%", marginBottom: "1.5%", cursor: "pointer" }} >
                                        <CardBody style={{ backgroundColor: "rgba(255,255,255,0.6)", margin: "2%" }}>
                                            <h5 className="text-center" style={{ fontWeight: "bolder", marginBottom: 0 }}>
                                                <img src={bronze} width="25px" />
                                                <strong>
                                                    #3: {this.state.teamCounts[2].name}
                                                </strong>
                                            </h5>
                                            <hr />
                                            <h5 className="text-center" style={{ fontWeight: "bolder" }}><strong>MTD Average: {this.state.teamCounts[2].avg}</strong></h5>
                                            <h5 className="text-center" style={{ fontWeight: "bolder" }}><strong>MTD Count: {this.state.teamCounts[2].count}</strong></h5>
                                            <h5 className="text-center" style={{ fontWeight: "bolder" }}><strong>Agents: {this.state.teamCounts[2].numAgents}</strong></h5>
                                        </CardBody>
                                    </Card>
                                    <Card onClick={() => { this.getOpenTeam(this.state.teamCounts[3]); this.setState({ modalOpen: true, selected_team: this.state.teamCounts[3] }) }} style={{ backgroundSize: "75px", backgroundPosition: "center", backgroundImage: "url(" + this.state.teamCounts[3].logo + "), " + "linear-gradient(0deg, #000000 0%, #1d67a8 100%)", backgroundRepeat: "no-repeat, repeat", height: "33%", marginBottom: "1.5%", cursor: "pointer" }} >
                                        <CardBody style={{ backgroundColor: "rgba(255,255,255,0.6)", margin: "2%" }}>
                                            <h5 className="text-center" style={{ fontWeight: "bolder", marginBottom: 0 }}>
                                                <strong>
                                                    #4: {this.state.teamCounts[3].name}
                                                </strong>
                                            </h5>
                                            <hr />
                                            <h5 className="text-center" style={{ fontWeight: "bolder" }}><strong>MTD Average: {this.state.teamCounts[3].avg}</strong></h5>
                                            <h5 className="text-center" style={{ fontWeight: "bolder" }}><strong>MTD Count: {this.state.teamCounts[3].count}</strong></h5>
                                            <h5 className="text-center" style={{ fontWeight: "bolder" }}><strong>Agents: {this.state.teamCounts[3].numAgents}</strong></h5>
                                        </CardBody>
                                    </Card>
                                    <Card onClick={() => { this.getOpenTeam(this.state.teamCounts[4]); this.setState({ modalOpen: true, selected_team: this.state.teamCounts[4] }) }} style={{ backgroundSize: "75px", backgroundPosition: "center", backgroundImage: "url(" + this.state.teamCounts[4].logo + "), " + "linear-gradient(0deg, #000000 0%, #1d67a8 100%)", backgroundRepeat: "no-repeat, repeat", height: "33%", marginBottom: 10, cursor: "pointer" }} >
                                        <CardBody style={{ backgroundColor: "rgba(255,255,255,0.6)", margin: "2%" }}>
                                            <h5 className="text-center" style={{ fontWeight: "bolder", marginBottom: 0 }}>
                                                <strong>
                                                    #5: {this.state.teamCounts[4].name}
                                                </strong>
                                            </h5>
                                            <hr />
                                            <h5 className="text-center" style={{ fontWeight: "bolder" }}><strong>MTD Average: {this.state.teamCounts[4].avg}</strong></h5>
                                            <h5 className="text-center" style={{ fontWeight: "bolder" }}><strong>MTD Count: {this.state.teamCounts[4].count}</strong></h5>
                                            <h5 className="text-center" style={{ fontWeight: "bolder" }}><strong>Agents: {this.state.teamCounts[4].numAgents}</strong></h5>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Modal isOpen={this.state.modalOpen} toggle={() => { this.setState({ modalOpen: !this.state.modalOpen }) }} style={{ justifyContent: "center" }}>
                        <ModalHeader toggle={() => { this.setState({ modalOpen: !this.state.modalOpen }) }} style={{ justifyContent: "center" }}>
                            <strong>{this.state.selected_team.name}</strong> <img src={this.state.selected_team.logo} height={"50px"} />
                        </ModalHeader>
                        <ModalBody>
                            <Card style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th style={{ borderBottom: "1px solid white" }}><p className="text-center text-white">Team Ranking</p></th>
                                            <th style={{ borderBottom: "1px solid white" }}><p className="text-center text-white">Name</p></th>
                                            <th style={{ borderBottom: "1px solid white" }}><p className="text-center text-white">MTD Appointment Count</p></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.modalTeam.map((agent, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td style={{ borderBottom: "1px solid white" }}><p className="text-center text-white">{i + 1}</p></td>
                                                    <td style={{ borderBottom: "1px solid white" }}><p className="text-center text-white">{agent.name}</p></td>
                                                    <td style={{ borderBottom: "1px solid white" }}><p className="text-center text-white">{agent.count}</p></td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </Table>
                            </Card>
                        </ModalBody>
                    </Modal>
                </Container>
            </div >
        );
    }
}

export default TeamStandings;