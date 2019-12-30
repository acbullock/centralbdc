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
    Modal,
    ModalHeader,
    ModalBody,
    Input,
    FormGroup,
    Form
} from "reactstrap";
import Select from 'react-select'
import ReactDateTime from "react-datetime";
class Reports extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            agent: {},
            reports: [],
            selected_report: {},
            fromDate: "",
            toDate: "",
            selected_dealership: { label: "", value: "" },
            reportDone: false,
            appCount: 0
        }
        this._isMounted = false;
        this.appCountReport = this.appCountReport.bind(this);
    }
    async componentWillMount() {
        this._isMounted = true
        this.setState({ loading: true })
        let user = this._isMounted && await this.props.mongo.getActiveUser(this.props.mongo.mongodb);
        let agent = this._isMounted && await this.props.mongo.findOne("dealership_users", { userId: user.userId });
        let dealerships = this._isMounted && await this.props.mongo.find("dealerships");
        dealerships.filter((a) => {
            return a.isActive === true
        })
        dealerships.sort((a, b) => {
            if (a.label > b.label) return 1;
            if (a.label < b.label) return -1;
            return 0;
        })
        let agent_group = this._isMounted && await this.props.mongo.findOne("dealerships", { value: agent.dealership });
        agent_group = agent_group.group;
        dealerships = dealerships.filter((d) => {
            if (agent.access === "store") {
                return d.value === agent.dealership
            }
            if (agent.access === "group") {
                return d.group === agent_group
            }
            return true;
        })
        let reports = ["Appointment Count"];
        let report_options = []
        for (let r in reports) {
            report_options.push({ label: reports[r], value: r })
        }
        this._isMounted && this.setState({ agent, reports: report_options, dealerships })


        this.setState({ loading: false })
    }
    componentDidMount() {
        this._isMounted = true
    }
    componentWillUnmount() {
        this._isMounted = false
    }
    async appCountReport() {
        this.setState({ loading: true })
        let appointments = await this.props.mongo.findOne("appointments", { dealership: this.state.selected_dealership.value });
        appointments = appointments.appointments;
        let agents = await this.props.mongo.find("agents")
        let agent_apps = [];
        for (let a in agents) {
            agent_apps = agent_apps.concat(agents[a].appointments);
        }
        agent_apps = agent_apps.filter((a) => {
            return a.dealership.value === this.state.selected_dealership.value
        })
        appointments = appointments.concat(agent_apps)
        appointments = appointments.filter((a) => {
            return (new Date(a.verified).getTime() >= new Date(this.state.fromDate).getTime() &&
                new Date(a.verified).getTime() <= new Date(this.state.toDate).getTime())
        })

        this.setState({ reportDone: true, appCount: appointments.length, loading: false })
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
                                options={this.state.reports}
                                value={this.state.selected_report}
                                onChange={(e) => { this.setState({ selected_report: e }) }}
                            />
                        </Col>
                    </Row>
                    <br />
                    <br />
                    <Row hidden={this.state.selected_report.label !== "Appointment Count"}>
                        <Col className="ml-auto mr-auto" md="8">
                            <Card className="card-raised card-white">
                                <CardBody>
                                    <legend>{this.state.selected_report.label}</legend>
                                    <Form >
                                        <FormGroup>
                                            <Label>Dealership:</Label>
                                            <Select style={{ width: "50%" }}
                                                options={this.state.dealerships}
                                                value={this.state.selected_dealership}
                                                onChange={(e) => { this.setState({ reportDone: false, selected_dealership: e }) }}
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label>From: </Label>
                                            <ReactDateTime
                                                timeFormat={false}
                                                inputProps={{
                                                    className: "form-control",
                                                    placeholder: "From date/time",
                                                    name: "date",
                                                }}
                                                value={this.state.fromDate}
                                                onChange={(value) => {
                                                    this.setState({ reportDone: false, fromDate: new Date(value) })
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
                                                    placeholder: "To date/time",
                                                    name: "date"
                                                }}
                                                value={this.state.toDate}
                                                onChange={(value) => {
                                                    this.setState({ reportDone: false, toDate: new Date(new Date(value).setHours(23, 59, 59, 999)) })
                                                }
                                                }
                                                className="primary"
                                            />
                                        </FormGroup>
                                        <Button color="primary" disabled={
                                            this.state.selected_dealership.label.length < 1 ||
                                            this.state.fromDate.length < 1 ||
                                            this.state.toDate.length < 1 ||
                                            new Date(this.state.fromDate).getTime() > new Date(this.state.toDate).getTime()
                                        } onClick={() => { console.log(this.state.fromDate, this.state.toDate); this.appCountReport() }}>Generate Report</Button>
                                    </Form>
                                </CardBody>
                            </Card>

                        </Col>
                        <Col className="ml-auto mr-auto" md="12" hidden={this.state.reportDone === false}>
                            <Card className="card-raised text-center card-white">
                                <CardBody>
                                    <Table bordered>
                                        <thead style={{ backgroundColor: "#3469a6" }}>
                                            <tr>
                                                <th><p style={{ color: "white" }}>Dealership</p></th>
                                                <th><p style={{ color: "white" }}>From</p></th>
                                                <th><p style={{ color: "white" }}>To</p></th>
                                                <th><p style={{ color: "white" }}>Appointment Count</p></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>{this.state.selected_dealership.label}</td>
                                                <td>{new Date(this.state.fromDate).toLocaleDateString()}</td>
                                                <td>{new Date(this.state.toDate).toLocaleDateString()}</td>
                                                <td>{this.state.appCount}</td>
                                            </tr>
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

export default Reports;