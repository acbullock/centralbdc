import React from "react";
// reactstrap components
import {
    Button,
    Label,
    Card,
    CardImg,
    Container,
    CardBody,
    Row,
    Col,
    Table,
    Modal,
    ModalHeader,
    ModalBody,
    Input,
    FormGroup,
    Form,
    Tooltip,
    InputGroup,
    CardTitle,
} from "reactstrap";
import Select from 'react-select'
import ReactDateTime from "react-datetime";
import gold from "../../assets/img/gold.png"
import silver from "../../assets/img/silver.png"
import bronze from "../../assets/img/bronze.png"
import FailedTexts from "./FailedTexts";
class TeamStandings extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            teams: {},
            sortedTeams: []
        }
        this._isMounted = false
        this.refreshPage = this.refreshPage.bind(this)
    }
    async componentWillMount() {
        this._isMounted = true
        this._isMounted && this.setState({ loading: true })
        let agents = this._isMounted && await this.props.mongo.find("agents", { isActive: true, department: "sales", account_type: "agent" }, { projection: { name: 1, team: 1, "appointments.verified": 1 } })
        let mtdApps = this._isMounted && await this.props.mongo.find("all_appointments", {
            dealership_department: {
                "$ne": "Service"
            },
            verified: {
                "$gte": new Date(new Date(new Date().setDate(1)).setHours(0, 0, 0, 0)).toISOString()
            }
        }, { projection: { agent_id: 1, verified: 1 } })


        // let mtdApps = []
        let teams = {
        }
        for (let agent in agents) {
            mtdApps = this._isMounted && mtdApps.concat(agents[agent].appointments)
            if (teams[agents[agent].team.label] === undefined) {
                teams[agents[agent].team.label] = [agents[agent]]
            }
            else {
                teams[agents[agent].team.label].push(agents[agent])
            }
        }
        for (let team in teams) {
            for (let agent in teams[team]) {
                let agentMTDApps = this._isMounted && await mtdApps.filter((a) => { return a.agent_id === teams[team][agent]._id })
                teams[team][agent].mtd = agentMTDApps.length
            }
        }
        let sortedTeams = []
        for (let team in teams) {
            let mtd = 0;
            for (let agent in teams[team]) {
                mtd += teams[team][agent].mtd
            }
            sortedTeams.push({
                name: team,
                mtd,
                mtdAvg: Math.round(10 * mtd / teams[team].length) / 10
            })
        }
        this._isMounted && sortedTeams.sort((a, b) => {
            if (a.mtdAvg > b.mtdAvg) return -1;
            if (a.mtdAvg < b.mtdAvg) return 1;
            return 0;
        })
        for (let t in teams) {
            this._isMounted && teams[t].sort((a, b) => {
                if (a.mtd > b.mtd) return -1;
                if (a.mtd < b.mtd) return 1;
                return 0;
            })
        }
        for (let t in sortedTeams) {
            this._isMounted && await this.setState({ [sortedTeams[t].name]: false })
        }
        this._isMounted && this.setState({ teams, sortedTeams })
        this._isMounted && this.setState({ loading: false })

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
            <div className="content">
                <Container>
                    <Row >
                        <Col sm="8">
                            <Card id="test123" style={{ background: "linear-gradient(0deg, #000000 0%, #D4AF37 100%)", marginBottom: 20, cursor: "pointer", height: "45vh" }}>
                                <CardBody onClick={() => { this.setState({ [this.state.sortedTeams[0].name]: !this.state[this.state.sortedTeams[0].name] }) }}>
                                    <h3 className="text-white text-center" style={{ verticalAlign: "center" }}>
                                        <img src={gold} style={{ width: "50px" }} />
                                        #1: <strong>{this.state.sortedTeams[0].name}</strong>
                                    </h3>
                                    <hr style={{ border: "solid 1px white" }} />
                                    <h4 className="text-white text-center">MTD Count: <strong>{this.state.sortedTeams[0].mtd}</strong></h4>
                                    <h4 className="text-white text-center">Agents: <strong>{this.state.teams[this.state.sortedTeams[0].name].length}</strong></h4>
                                    <h4 className="text-white text-center">MTD Average: <strong>{this.state.sortedTeams[0].mtdAvg}</strong></h4>
                                </CardBody>

                            </Card>
                            <Modal className="modal-primary" hidden={this.state[this.state.sortedTeams[0].name] !== true && this.state[this.state.sortedTeams[0].name] !== false} isOpen={this.state[this.state.sortedTeams[0].name]} toggle={() => { this.setState({ [this.state[this.state.sortedTeams[0].name]]: !this.state[this.state.sortedTeams[0].name] }) }}>
                                <ModalHeader style={{ justifyContent: 'center' }} toggle={() => { this.setState({ [this.state.sortedTeams[0].name]: !this.state[this.state.sortedTeams[0].name] }) }}>
                                    <strong>{this.state.sortedTeams[0].name}</strong>
                                </ModalHeader>
                                <ModalBody>
                                    <Card style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                        <Table className="text-center">
                                            <thead>
                                                <tr>
                                                    <th className="text-white" style={{ borderBottom: "1px solid white" }}>Team Ranking</th>
                                                    <th className="text-white" style={{ borderBottom: "1px solid white" }}>Agent Name</th>
                                                    <th className="text-white" style={{ borderBottom: "1px solid white" }}>MTD Appointment Count</th>
                                                </tr>

                                            </thead>
                                            <tbody>
                                                {this._isMounted && this.state.teams[this.state.sortedTeams[0].name].map((agent, j) => {
                                                    return (
                                                        <tr key={j}>
                                                            <td style={{ borderBottom: "1px solid white" }}><p className="text-white">{j + 1}</p></td>
                                                            <td style={{ borderBottom: "1px solid white" }}><p className="text-white">{agent.name}</p></td>
                                                            <td style={{ borderBottom: "1px solid white" }}><p className="text-white">{agent.mtd}</p></td>
                                                        </tr>

                                                    )
                                                })}
                                            </tbody>

                                        </Table>
                                    </Card>
                                </ModalBody>
                            </Modal>
                            <Card style={{ background: "linear-gradient(0deg, #000000 0%, #C0C0C0 100%)", marginBottom: 0, cursor: "pointer", height: "30vh" }}>
                                <CardBody onClick={() => { this.setState({ [this.state.sortedTeams[1].name]: !this.state[this.state.sortedTeams[1].name] }) }}>
                                    <h4 className="text-white text-center" style={{ verticalAlign: "center" }}>
                                        <img src={silver} style={{ width: "30px" }} />
                                        #2: <strong>{this.state.sortedTeams[1].name}</strong>
                                    </h4>
                                    <hr style={{ border: "solid 1px white" }} />
                                    <h5 className="text-white text-center">MTD Count: <strong>{this.state.sortedTeams[1].mtd}</strong></h5>
                                    <h5 className="text-white text-center">Agents: <strong>{this.state.teams[this.state.sortedTeams[1].name].length}</strong></h5>
                                    <h5 className="text-white text-center">MTD Average: <strong>{this.state.sortedTeams[1].mtdAvg}</strong></h5>
                                </CardBody>
                            </Card>
                            <Modal className="modal-primary" hidden={this.state[this.state.sortedTeams[1].name] !== true && this.state[this.state.sortedTeams[1].name] !== false} isOpen={this.state[this.state.sortedTeams[1].name]} toggle={() => { this.setState({ [this.state[this.state.sortedTeams[1].name]]: !this.state[this.state.sortedTeams[1].name] }) }}>
                                <ModalHeader style={{ justifyContent: 'center' }} toggle={() => { this.setState({ [this.state.sortedTeams[1].name]: !this.state[this.state.sortedTeams[1].name] }) }}>
                                    <strong>{this.state.sortedTeams[1].name}</strong>
                                </ModalHeader>
                                <ModalBody>
                                    <Card style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                        <Table className="text-center">
                                            <thead>
                                                <tr>
                                                    <th className="text-white" style={{ borderBottom: "1px solid white" }}>Team Ranking</th>
                                                    <th className="text-white" style={{ borderBottom: "1px solid white" }}>Agent Name</th>
                                                    <th className="text-white" style={{ borderBottom: "1px solid white" }}>MTD Appointment Count</th>
                                                </tr>

                                            </thead>
                                            <tbody>
                                                {this._isMounted && this.state.teams[this.state.sortedTeams[1].name].map((agent, j) => {
                                                    return (
                                                        <tr key={j}>
                                                            <td style={{ borderBottom: "1px solid white" }}><p className="text-white">{j + 1}</p></td>
                                                            <td style={{ borderBottom: "1px solid white" }}><p className="text-white">{agent.name}</p></td>
                                                            <td style={{ borderBottom: "1px solid white" }}><p className="text-white">{agent.mtd}</p></td>
                                                        </tr>

                                                    )
                                                })}
                                            </tbody>

                                        </Table>
                                    </Card>
                                </ModalBody>
                            </Modal>

                        </Col>
                        <Col sm="4">
                            {this._isMounted && this.state.sortedTeams.map((team, i) => {
                                if (team.name === "Los Angeles Lakers" || i === 0 || i === 1) return null
                                return (<div key={i} id={team.name + "Tooltip"}>

                                    <Card style={{ whiteSpace: "pre-wrap", background: i === 2 ? "linear-gradient(0deg, #000000 0%, #cd7f32 100%)" : "linear-gradient(0deg, #000000 0%, #1d67a8 100%)", marginBottom: 10, cursor: "pointer", height: i === 2 ? "27vh" : "24vh" }}>
                                        <CardBody onClick={() => { this.setState({ [team.name]: !this.state[team.name] }) }}>
                                            <p className="text-white text-center" style={{ verticalAlign: "center" }}>
                                                <img hidden={i !== 2} src={bronze} style={{ width: "25px" }} />
                                                #{i + 1}: <strong>{team.name}</strong>
                                            </p>
                                            <hr style={{ border: "solid 1px white" }} />
                                            <p className="text-white text-center">MTD Count: <strong>{team.mtd}</strong></p>
                                            <p className="text-white text-center">Agents: <strong>{this.state.teams[team.name].length}</strong></p>
                                            <p className="text-white text-center">MTD Average: <strong>{team.mtdAvg}</strong></p>
                                        </CardBody>
                                        <Modal className="modal-primary" hidden={this.state[team.name] !== true && this.state[team.name] !== false} isOpen={this.state[team.name]} toggle={() => { this.setState({ [team.name]: !this.state[team.name] }) }}>
                                            <ModalHeader style={{ justifyContent: 'center' }} toggle={() => { this.setState({ [team.name]: !this.state[team.name] }) }}>
                                                <strong>{team.name}</strong>
                                            </ModalHeader>
                                            <ModalBody>
                                                <Card style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                                    <Table className="text-center">
                                                        <thead>
                                                            <tr>
                                                                <th className="text-white" style={{ borderBottom: "1px solid white" }}>Team Ranking</th>
                                                                <th className="text-white" style={{ borderBottom: "1px solid white" }}>Agent Name</th>
                                                                <th className="text-white" style={{ borderBottom: "1px solid white" }}>MTD Appointment Count</th>
                                                            </tr>

                                                        </thead>
                                                        <tbody>
                                                            {this._isMounted && this.state.teams[team.name].map((agent, j) => {
                                                                return (
                                                                    <tr key={j}>
                                                                        <td style={{ borderBottom: "1px solid white" }}><p className="text-white">{j + 1}</p></td>
                                                                        <td style={{ borderBottom: "1px solid white" }}><p className="text-white">{agent.name}</p></td>
                                                                        <td style={{ borderBottom: "1px solid white" }}><p className="text-white">{agent.mtd}</p></td>
                                                                    </tr>

                                                                )
                                                            })}
                                                        </tbody>

                                                    </Table>
                                                </Card>
                                            </ModalBody>
                                        </Modal>
                                    </Card>
                                </div>)
                            })}
                        </Col>
                    </Row>
                </Container>
            </div >
        );
    }
}

export default TeamStandings;