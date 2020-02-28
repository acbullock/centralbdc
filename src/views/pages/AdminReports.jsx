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
import { Bar } from "react-chartjs-2";
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
            agentCount: 0,
            officeCounts: []
        }
        this._isMounted = false;
        this.getGoalForRange = this.getGoalForRange.bind(this)
        this.getGoalForRangeFull = this.getGoalForRangeFull.bind(this)
        this.getAppCountFull = this.getAppCountFull.bind(this)
        this.getAppCount = this.getAppCount.bind(this)
        this.clearForm = this.clearForm.bind(this)
        this.getOfficeHistory = this.getOfficeHistory.bind(this)
    }
    async componentWillMount() {
        this._isMounted = true
        this._isMounted && this.setState({ loading: true })
        let agent = this.props.agent
        if (this.props.agent.account_type !== "admin") {
            this.props.history.push("/admin/dashboard")
            return;
        }
        let dealerships = this._isMounted && await this.props.mongo.aggregate("dealerships", [
            {
                "$match": {
                    isActive: true
                }
            },
            {
                "$group": {
                    "_id": "$value",
                    "label": { "$first": "$label" },
                    "goal": { "$first": "$goal" },
                    "value": { "$first": "$value" }
                }
            },
            {
                "$sort": {
                    "label": 1
                }
            }
        ])

        let agents = this._isMounted && await this.props.mongo.aggregate("agents", [
            {
                "$match": {
                    isActive: true
                }
            },
            {
                "$group": {
                    "_id": "$_id",
                    "name": { "$first": "$name" },
                    "label": { "$first": "$name" },
                    "value": { "$first": "$_id" }
                }
            },
            {
                "$sort": {
                    "label": 1
                }
            }
        ])

        let reports = ["Dealership Goals", "Appointment Count", "Office History"];
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
    async getOfficeHistory() {
        this.setState({ loading: true })
        //day high
        let grouped = this._isMounted && await this.props.mongo.aggregate("all_appointments", [
            {
                "$match": {
                    "dealership_department": {
                        "$ne": "Service"
                    }
                }
            },
            {
                "$project": {
                    "_id": 1,
                    "parts": {
                        "$dateToParts": {
                            "date": {
                                "$dateFromString": {
                                    "dateString": "$verified"
                                }
                            }
                        }
                    },
                    "day": {
                        "$dayOfWeek": {
                            "$dateFromString": {
                                "dateString": "$verified"
                            }
                        }
                    }
                }
            },
            {
                "$group": {
                    "_id": { "year": "$parts.year", "month": "$parts.month", "day": "$parts.day" },
                    "dayOfWeek": { "$first": "$day" },
                    "count": {
                        "$sum": 1
                    }
                }
            },
            {
                "$group": {
                    "_id": "$dayOfWeek",
                    "high": {
                        "$max": "$count"
                    },
                    "avg": {
                        "$avg": "$count"
                    },
                    "parts": { "$first": "$_id" }
                }
            },
            {
                "$sort": {
                    "_id": 1
                }
            }
        ])
        let labels = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        let counts = []
        for (let i in grouped) {
            let dayOfWeek = i
            counts.push({ high: grouped[i].high, avg: grouped[i].avg })
        }
        console.log(counts)
        this.setState({ loading: false, officeCounts: counts })
        //day avg
    }
    async getGoalForRange() {
        this._isMounted && this.setState({ loading: true })
        let apps = this._isMounted && await this.props.mongo.aggregate("all_appointments", [
            {
                "$match": {
                    dealership_department: { "$ne": "Service" },
                    dealership: this.state.selected_dealership.value,
                    verified: {
                        "$gte": new Date(this.state.fromDate).toISOString(),
                        "$lte": new Date(this.state.toDate).toISOString()
                    }
                }
            },
            {
                "$group": {
                    "_id": "$_id"
                }
            }
        ])
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
            allDealers: false,
            full_results: []
        })
    }
    async getGoalForRangeFull() {
        this._isMounted && this.setState({ loading: true })
        let grouped = this._isMounted && await this.props.mongo.aggregate("all_appointments", [
            {
                "$match": {
                    dealership_department: {
                        "$ne": "Service"
                    },
                    verified: {
                        "$gte": new Date(this.state.fromDate).toISOString(),
                        "$lte": new Date(this.state.toDate).toISOString()
                    }
                }
            },
            {
                "$group": {
                    "_id": "$dealership",
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
        ]);
        let full_results = []
        for (let a in grouped) {
            let curr_apps = grouped[a].count;
            let currDealer = {}
            let index = this.state.dealerships.findIndex((d) => {
                return d.value === grouped[a]._id
            })
            if (index === -1) continue
            currDealer = this.state.dealerships[index]
            let range = new Date(this.state.toDate).getTime() - new Date(this.state.fromDate).getTime()
            range = range / (1000 * 60 * 60 * 24);
            range = Math.round(range);
            let goal = (currDealer.goal) * range;
            let progressValue = curr_apps / goal * 100;
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
                appCount: curr_apps,
                progressValue,
                progressColor
            })
        }

        this._isMounted && full_results.sort((a, b) => {
            if (parseInt(a.progressValue) > parseInt(b.progressValue)) return -1;
            if (parseInt(a.progressValue) < parseInt(b.progressValue)) return 1;
            return 0;

        })
        console.log(full_results)
        this._isMounted && this.setState({ loading: false, full_results, reportDone: true });
    }
    async getAppCount() {
        this._isMounted && this.setState({ loading: true });

        let count = this._isMounted && await this.props.mongo.count("all_appointments", {
            dealership_department: {
                "$ne": "Service"
            },
            agent_id: this.state.selected_agent.value,
            verified: {
                "$gte": new Date(this.state.fromDate).toISOString(),
                "$lte": new Date(this.state.toDate).toISOString()
            }
        })


        this._isMounted && this.setState({ loading: false, agentCount: count.count, reportDone: true });
    }
    async getAppCountFull() {
        this._isMounted && this.setState({ loading: true });
        let full_results = []
        let grouped = this._isMounted && await this.props.mongo.aggregate("all_appointments", [
            {
                "$match": {
                    dealership_department: {
                        "$ne": "Service"
                    },
                    verified: {
                        "$gte": new Date(this.state.fromDate).toISOString(),
                        "$lte": new Date(this.state.toDate).toISOString()
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
                    count: -1
                }
            }
        ])


        let agents = this.state.agents

        for (let a in grouped) {
            let index = await agents.findIndex((ag) => {
                return ag._id === grouped[a]._id
            })
            if (index === -1)
                continue

            let curAgent = agents[index]
            full_results.push({
                name: curAgent.name,
                appCount: grouped[a].count
            })
        }
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
                                                    this._isMounted && this.setState({ reportDone: false, fromDate: new Date(new Date(value).setHours(0, 0, 0, 0)) })
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
                                                    this._isMounted && this.setState({ reportDone: false, fromDate: new Date(new Date(value).setHours(0, 0, 0, 0)) })
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
                    <Row hidden={this.state.selected_report.label !== "Office History"}>
                        <Col className="ml-auto mr-auto" md="12">
                            <Card className="card-raised card-white">
                                <CardBody>
                                    <legend>{this.state.selected_report.label}</legend>
                                    <Button color="success" onClick={() => { this.getOfficeHistory() }}>Get History</Button>

                                    <hr />
                                    <div style={{ display: this.state.officeCounts.length === 0? "none": "block"}}>
                                        <Bar
                                            data={{
                                                labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                                                datasets: [{ label: "Total Sales Appts", backgroundColor: '#1d67a8', borderColor: '#1d67a8', data: this.state.officeCounts.map((a) => { return a.high }) }]
                                            }}
                                            options={
                                                {
                                                    title: {
                                                        display: true,
                                                        text: "Record Day Each Day",
                                                        fontSize: 24,
                                                    },

                                                }
                                            }
                                        />
                                        <hr />
                                        <Bar
                                            hidden={this.state.officeCounts.length < 1}
                                            data={{
                                                labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                                                datasets: [{ label: "Average Sales Appts", backgroundColor: '#1d67a8', borderColor: '#1d67a8', data: this.state.officeCounts.map((a) => { return Math.round(10 * a.avg) / 10 }) }]
                                            }}
                                            options={
                                                {
                                                    title: {
                                                        display: true,
                                                        text: "Average Count Each Day",
                                                        fontSize: 24,
                                                    },

                                                }
                                            }
                                        />
                                    </div>
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