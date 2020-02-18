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
    Progress,
    Input,
    FormGroup,
    Form
} from "reactstrap";
import Select from 'react-select'
import ReactDateTime from "react-datetime";
class AdminReports extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            agent: {},
            reports: [],
            dealerships: [],
            agents: [],
            selected_report: {},
            fromDate: "",
            toDate: "",
            selected_dealership: { label: "", value: "" },
            selected_agent: { label: "", value: "" },
            reportDone: false,
            appCount: 0,
            goal: 0,
            progressColor: "",
            progressValue: "",
            full_results: [],
            allDealers: false,
            allAgents: false,
            agentCount: 0
        }
        this._isMounted = false;
        this.getGoalForRange = this.getGoalForRange.bind(this)
        this.getGoalForRangeFull = this.getGoalForRangeFull.bind(this)
        this.getAppCountFull = this.getAppCountFull.bind(this)
        this.getAppCount = this.getAppCount.bind(this)
        this.clearForm = this.clearForm.bind(this)
    }
    async componentWillMount() {
        this._isMounted = true
        this._isMounted && this.setState({ loading: true })
        let user = this._isMounted && await this.props.mongo.getActiveUser(this.props.mongo.mongodb);
        let agent = this._isMounted && await this.props.mongo.findOne("agents", { userId: user.userId });
        let dealerships = this._isMounted && await this.props.mongo.find("dealerships");
        let agents = this._isMounted && await this.props.mongo.find("agents");
        dealerships = this._isMounted && dealerships.filter((a) => {
            return a.isActive === true
        })
        agents = this._isMounted && agents.filter((a) => {
            return a.isActive === true
        })
        agents = this._isMounted && agents.map((a) => {
            return Object.assign(a, { label: a.name, value: a._id })
        })
        this._isMounted && dealerships.sort((a, b) => {
            if (a.label > b.label) return 1;
            if (a.label < b.label) return -1;
            return 0;
        })
        this._isMounted && agents.sort((a, b) => {
            if (a.label > b.label) return 1;
            if (a.label < b.label) return -1;
            return 0;
        })
        let reports = ["Dealership Goals", "Appointment Count"];
        this._isMounted && reports.sort((a, b) => {
            if (a > b) return 1;
            if (a < b) return -1;
            return 0;
        })
        let report_options = []
        for (let r in reports) {
            report_options.push({ label: reports[r], value: r })
        }
        this._isMounted && this.setState({ agent, reports: report_options, dealerships, agents })


        this._isMounted && this.setState({ loading: false })
    }
    componentDidMount() {
        this._isMounted = true
    }
    componentWillUnmount() {
        this._isMounted = false
    }
    async getGoalForRange() {
        this._isMounted && this.setState({ loading: true })

        let apps = this._isMounted && await this.props.mongo.findOne("appointments", { dealership: this.state.selected_dealership.value })
        apps = apps.appointments;

        //find all apps in given range..
        apps = this._isMounted && apps.filter((a) => {
            return a.dealership_department !== "Service" && new Date(a.verified).getTime() >= new Date(this.state.fromDate).getTime() && new Date(a.verified).getTime() <= new Date(this.state.toDate).getTime()
        })
        let range = new Date(this.state.toDate).getTime() - new Date(this.state.fromDate).getTime()
        range = range / (1000 * 60 * 60 * 24);
        range = Math.round(range);
        let goal = this.state.selected_dealership.goal * range;
        let progressValue = apps.length / goal * 100;
        let progressColor = "red";
        if (progressValue > 33) {
            progressColor = "yellow"
        }
        if (progressValue >= 100) {
            progressColor = "green"
        }


        this._isMounted && this.setState({ loading: false, goal, reportDone: true, appCount: apps.length, progressValue, progressColor })
    }
    clearForm() {
        this._isMounted && this.setState({
            toDate: "",
            fromDate: "",
            selected_agent: { label: "", value: "" },
            selected_dealership: { label: "", value: "" },
            allAgents: false,
            allDealers: false
        })
    }
    async getGoalForRangeFull() {
        this._isMounted && this.setState({ loading: true })
        let apps = this._isMounted && await this.props.mongo.find("appointments")
        let full_results = []
        for (let a in apps) {
            let curr_apps = apps[a].appointments;
            let currDealer = {}
            for (let d in this.state.dealerships) {
                if (this.state.dealerships[d].value === apps[a].dealership) {
                    currDealer = this.state.dealerships[d];
                    break;
                }
            }
            if (!currDealer.isActive) {
                continue;
            }
            curr_apps = this._isMounted && curr_apps.filter((a) => {
                return a.dealership_department !== "Service" && new Date(a.verified).getTime() >= new Date(this.state.fromDate).getTime() && new Date(a.verified).getTime() <= new Date(this.state.toDate).getTime()
            });
            let range = new Date(this.state.toDate).getTime() - new Date(this.state.fromDate).getTime()
            range = range / (1000 * 60 * 60 * 24);
            range = Math.round(range);
            let goal = (currDealer.goal) * range;
            let progressValue = curr_apps.length / goal * 100;
            let progressColor = "red";
            if (progressValue > 33) {
                progressColor = "yellow";
            }
            if (progressValue >= 100) {
                progressColor = "green";
            }
            full_results.push({
                dealership: currDealer,
                goal,
                appCount: curr_apps.length,
                progressValue,
                progressColor
            })
        }
        this._isMounted && full_results.sort((a, b) => {
            if (parseInt(a.goal) > parseInt(b.goal)) return -1;
            if (parseInt(a.goal) < parseInt(b.goal)) return 1;
            return 0;

        })
        this._isMounted && this.setState({ loading: false, full_results, reportDone: true });
    }
    async getAppCount() {
        this._isMounted && this.setState({ loading: true });
        let appointments = this._isMounted && await this.props.mongo.find("all_appointments", { agent_id: this.state.selected_agent._id });
        let allApps = appointments.concat(this.state.selected_agent.appointments)
        // for (let a in appointments) {
        //     allApps = allApps.concat(appointments[a].appointments)
        // }
        allApps = this._isMounted && allApps.filter((a) => {
            return a.agent_id === this.state.selected_agent._id
        })
        allApps = this._isMounted && allApps.filter((a) => {
            return new Date(a.verified).getTime() >= new Date(this.state.fromDate).getTime() &&
                new Date(a.verified).getTime() <= new Date(this.state.toDate).getTime() && a.dealership_department !== "Service"
        })

        this._isMounted && this.setState({ loading: false, agentCount: allApps.length, reportDone: true });
    }
    async getAppCountFull() {
        this._isMounted && this.setState({ loading: true });
        let full_results = []
        let appointments = await this.props.mongo.find("appointments");
        let agents = await this.props.mongo.find("agents", { isActive: true, department: "sales" })
        let allApps = [];
        for (let a in appointments) {
            allApps = allApps.concat(appointments[a].appointments);
        }
        for (let a in agents) {
            let currApps = this._isMounted && allApps.filter((app) => {
                return (app.agent_id === agents[a]._id &&
                    new Date(app.verified) >= new Date(this.state.fromDate) &&
                    new Date(app.verified) <= new Date(this.state.toDate)) && app.dealership_department !== "Service"
            });
            full_results.push({
                name: agents[a].name,
                appCount: currApps.length
            })
        }
        this._isMounted && full_results.sort((a, b) => {
            return b.appCount - a.appCount
        })
        this._isMounted && this.setState({ loading: false, full_results, reportDone: true });
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
                    <Row>
                        <Col className="ml-auto mr-auto text-center" md="8">
                            <legend>Select Report:</legend>
                            <Select
                                isDisabled={this.state.loading}
                                options={this.state.reports}
                                value={this.state.selected_report}
                                onChange={(e) => { this.clearForm(); this._isMounted && this.setState({ selected_report: e, reportDone: false }) }}
                            />
                        </Col>
                    </Row>
                    <br />
                    <br />
                    <Row hidden={this.state.selected_report.label !== "Dealership Goals"}>
                        <Col className="ml-auto mr-auto" md="8">
                            <Card className="card-raised card-white">
                                <CardBody>
                                    <legend>{this.state.selected_report.label}</legend>
                                    <Form >
                                        <FormGroup>
                                            <Label>Dealership:</Label>
                                            <Select
                                                isDisabled={this.state.allDealers === true}
                                                style={{ width: "50%" }}
                                                options={this.state.dealerships}
                                                value={this.state.selected_dealership}
                                                onChange={(e) => { this._isMounted && this.setState({ reportDone: false, selected_dealership: e }) }}
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label>From: </Label>
                                            <ReactDateTime
                                                timeFormat={false}
                                                inputProps={{
                                                    className: "form-control",
                                                    placeholder: "From Date",
                                                    name: "date",
                                                }}
                                                value={this.state.fromDate}
                                                onChange={(value) => {
                                                    this._isMounted && this.setState({ reportDone: false, fromDate: new Date(value) })
                                                }
                                                }
                                                className="primary"
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label>To: </Label>
                                            <ReactDateTime
                                                timeFormat={false}
                                                inputProps={{
                                                    className: "form-control",
                                                    placeholder: "To Date",
                                                    name: "date"
                                                }}
                                                value={this.state.toDate}
                                                onChange={(value) => {
                                                    this._isMounted && this.setState({ reportDone: false, toDate: new Date(new Date(value).setHours(23, 59, 59, 999)) })
                                                }
                                                }
                                                className="primary"
                                            />
                                        </FormGroup>
                                        <Col>
                                            <FormGroup tag="fieldset">
                                                <Label check>

                                                    <Input type="checkbox" checked={this.state.allDealers} onChange={(e) => { this._isMounted && this.setState({ reportDone: false, allDealers: !this.state.allDealers }) }} />
                                                    All Dealerships
                                            </Label>
                                            </FormGroup>
                                        </Col>

                                        <Button color="primary" disabled={

                                            (this.state.allDealers === false && this.state.selected_dealership.label.length < 1) ||
                                            this.state.fromDate.length < 1 ||
                                            this.state.toDate.length < 1 ||
                                            new Date(this.state.fromDate).getTime() > new Date(this.state.toDate).getTime()
                                        } onClick={() => { this.state.allDealers === true ? this.getGoalForRangeFull() : this.getGoalForRange() }}>Generate Report</Button>
                                    </Form>
                                </CardBody>
                            </Card>

                        </Col>
                        <Col className="ml-auto mr-auto" md="12" hidden={this.state.reportDone === false || this.state.selected_report.label !== "Dealership Goals"}>
                            <Card className="card-raised text-center card-white">
                                <CardBody>
                                    <Table bordered responsive>
                                        <thead style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                            <tr>
                                                <th><p style={{ color: "white" }}>Progress</p></th>
                                                <th><p style={{ color: "white" }}>Dealership</p></th>
                                                <th><p style={{ color: "white" }}>From</p></th>
                                                <th><p style={{ color: "white" }}>To</p></th>
                                                <th><p style={{ color: "white" }}>Appointment Count</p></th>
                                                <th><p style={{ color: "white" }}>Goal</p></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr hidden={this.state.allDealers === true}>
                                                <td><Progress value={this.state.progressValue} color={this.state.progressColor} /></td>
                                                <td>{this.state.selected_dealership.label}</td>
                                                <td>{new Date(this.state.fromDate).toLocaleDateString()}</td>
                                                <td>{new Date(this.state.toDate).toLocaleDateString()}</td>
                                                <td>{this.state.appCount}</td>
                                                <td>{this.state.goal}</td>
                                            </tr>
                                            {this._isMounted && this.state.full_results.map((r, i) => {
                                                if (this.state.allDealers === false) {
                                                    return null;
                                                }
                                                return (
                                                    <tr key={i}>
                                                        <td><Progress value={r.progressValue} color={r.progressColor} /></td>
                                                        <td>{r.dealership.label}</td>
                                                        <td>{new Date(this.state.fromDate).toLocaleDateString()}</td>
                                                        <td>{new Date(this.state.toDate).toLocaleDateString()}</td>
                                                        <td>{r.appCount}</td>
                                                        <td>{r.goal}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </Table>
                                </CardBody>
                            </Card>

                        </Col>
                    </Row>
                    <Row hidden={this.state.selected_report.label !== "Appointment Count"}>
                        <Col className="ml-auto mr-auto" md="8">
                            <Card className="card-raised card-white">
                                <CardBody>
                                    <legend>{this.state.selected_report.label}</legend>
                                    <Form>
                                        <FormGroup>
                                            <Label>Agent:</Label>
                                            <Select
                                                isDisabled={this.state.allAgents === true}
                                                style={{ width: "50%" }}
                                                options={this.state.agents}
                                                value={this.state.selected_agent}
                                                onChange={(e) => { this._isMounted && this.setState({ reportDone: false, selected_agent: e }) }}
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label>From: </Label>
                                            <ReactDateTime
                                                timeFormat={false}
                                                inputProps={{
                                                    className: "form-control",
                                                    placeholder: "From Date",
                                                    name: "date",
                                                }}
                                                value={this.state.fromDate}
                                                onChange={(value) => {
                                                    this._isMounted && this.setState({ reportDone: false, fromDate: new Date(value) })
                                                }
                                                }
                                                className="primary"
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label>To: </Label>
                                            <ReactDateTime
                                                timeFormat={false}
                                                inputProps={{
                                                    className: "form-control",
                                                    placeholder: "To Date",
                                                    name: "date"
                                                }}
                                                value={this.state.toDate}
                                                onChange={(value) => {
                                                    this._isMounted && this.setState({ reportDone: false, toDate: new Date(new Date(value).setHours(23, 59, 59, 999)) })
                                                }
                                                }
                                                className="primary"
                                            />
                                        </FormGroup>
                                        <Col>
                                            <FormGroup tag="fieldset">
                                                <Label check>

                                                    <Input type="checkbox" checked={this.state.allAgents} onChange={(e) => { console.log(this.state.allAgents); this._isMounted && this.setState({ reportDone: false, allAgents: !this.state.allAgents }) }} />
                                                    All Agents
                                            </Label>
                                            </FormGroup>
                                        </Col>
                                        <Button color="primary" disabled={

                                            (this.state.allAgents === false && this.state.selected_agent.label.length < 1) ||
                                            this.state.fromDate.length < 1 ||
                                            this.state.toDate.length < 1 ||
                                            new Date(this.state.fromDate).getTime() > new Date(this.state.toDate).getTime()
                                        } onClick={() => { this.state.allAgents === true ? this.getAppCountFull() : this.getAppCount() }}>Generate Report</Button>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col className="ml-auto mr-auto" md="12" hidden={this.state.reportDone === false || this.state.selected_report.label !== "Appointment Count"}>
                            <Card className="card-raised text-center card-white">
                                <CardBody>
                                    <Table bordered responsive>
                                        <thead style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                            <tr>
                                                <th><p style={{ color: "white" }}>Agent Name</p></th>
                                                <th><p style={{ color: "white" }}>From</p></th>
                                                <th><p style={{ color: "white" }}>To</p></th>
                                                <th><p style={{ color: "white" }}>Appointment Count</p></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr hidden={this.state.allAgents === true} >
                                                <td>{this.state.selected_agent.name}</td>
                                                <td>{new Date(this.state.fromDate).toLocaleDateString()}</td>
                                                <td>{new Date(this.state.toDate).toLocaleDateString()}</td>
                                                <td>{this.state.agentCount}</td>
                                            </tr>
                                            {this._isMounted && this.state.full_results.map((r, i) => {
                                                if (this.state.allAgents === false) {
                                                    return null;
                                                }
                                                return (
                                                    <tr key={i}>
                                                        <td>{r.name}</td>
                                                        <td>{new Date(this.state.fromDate).toLocaleDateString()}</td>
                                                        <td>{new Date(this.state.toDate).toLocaleDateString()}</td>
                                                        <td>{r.appCount}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </Table>
                                </CardBody>
                            </Card>

                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default AdminReports;