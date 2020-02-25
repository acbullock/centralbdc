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
    FormGroup,
    Form,
    CardHeader
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
            appCount: 0,
            clicked: false,
            appointments: []
        }
        this._isMounted = false;
        this.appCountReport = this.appCountReport.bind(this);
    }
    async componentWillMount() {
        this._isMounted = true
        this._isMounted && this.setState({ loading: true })
        let user = this._isMounted && await this.props.mongo.getActiveUser(this.props.mongo.mongodb);
        let agent = this._isMounted && await this.props.mongo.findOne("dealership_users", { userId: user.userId });
        let dealerships = this._isMounted && await this.props.mongo.find("dealerships");
        this._isMounted && dealerships.filter((a) => {
            return a.isActive === true
        })
        this._isMounted && dealerships.sort((a, b) => {
            if (a.label > b.label) return 1;
            if (a.label < b.label) return -1;
            return 0;
        })
        let agent_group = this._isMounted && await this.props.mongo.findOne("dealerships", { value: agent.dealership });
        agent_group = agent_group.group;
        dealerships = this._isMounted && dealerships.filter((d) => {
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


        this._isMounted && this.setState({ loading: false })
    }
    componentDidMount() {
        this._isMounted = true
    }
    componentWillUnmount() {
        this._isMounted = false
    }
    async appCountReport() {
        this._isMounted && this.setState({ loading: true, clicked: false })
        let appointments = this._isMounted && await this.props.mongo.find("all_appointments", {
            "dealership": this.state.selected_dealership.value,
            verified: {
                "$gte": new Date(this.state.fromDate).toISOString(),
                "$lt": new Date(this.state.toDate).toISOString()
            }
        });
        // appointments = appointments.appointments;
        // appointments = appointments.concat(agent_apps)
        this._isMounted && appointments.sort((a, b) => {
            if (new Date(a.verified).getTime() > new Date(b.verified).getTime()) return 1;
            if (new Date(a.verified).getTime() < new Date(b.verified).getTime()) return -1;
            return 0;

        })
        this._isMounted && this.setState({ reportDone: true, appCount: appointments.length, appointments, loading: false })
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
                                onChange={(e) => { this._isMounted && this.setState({ selected_report: e }) }}
                            />
                        </Col>
                    </Row>
                    <br />
                    <br />
                    <Row hidden={this.state.selected_report.label !== "Appointment Count"}>
                        <Col className="ml-auto mr-auto" md="8">
                            <Card className="card-raised card-white" style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                <CardBody>
                                    <legend style={{ color: "white" }}>{this.state.selected_report.label}</legend>
                                    <Form >
                                        <FormGroup>
                                            <Label style={{ color: "white" }}>Dealership:</Label>
                                            <Select style={{ width: "50%" }}
                                                options={this.state.dealerships}
                                                value={this.state.selected_dealership}
                                                onChange={(e) => { this._isMounted && this.setState({ clicked: false, reportDone: false, selected_dealership: e }) }}
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label style={{ color: "white" }}>From: </Label>
                                            <Card>
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
                                            </Card>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label style={{ color: "white" }}>To: </Label>
                                            <Card >
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
                                                /></Card>
                                        </FormGroup>
                                        <Button color="neutral" disabled={
                                            this.state.selected_dealership.label.length < 1 ||
                                            this.state.fromDate.length < 1 ||
                                            this.state.toDate.length < 1 ||
                                            new Date(this.state.fromDate).getTime() > new Date(this.state.toDate).getTime()
                                        } onClick={() => { console.log(this.state.fromDate, this.state.toDate); this.appCountReport() }}>Generate Report</Button>
                                    </Form>
                                </CardBody>
                            </Card>

                        </Col>
                        <Col className="ml-auto mr-auto" md="8" hidden={this.state.reportDone === false}>
                            <Card className="card-raised text-center card-white" style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                <CardBody>
                                    <Table responsive>
                                        <thead>
                                            <tr >
                                                <th style={{ borderBottom: "1px solid white" }}><p style={{ color: "white" }} >Dealership</p></th>
                                                <th style={{ borderBottom: "1px solid white" }}><p style={{ color: "white" }}>From</p></th>
                                                <th style={{ borderBottom: "1px solid white" }}><p style={{ color: "white" }}>To</p></th>
                                                <th style={{ borderBottom: "1px solid white" }}><p style={{ color: "white" }}>Appointment Count</p></th>
                                                <th style={{ borderBottom: "1px solid white" }}></th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td style={{ borderBottom: "1px solid white" }}><p style={{ color: "white" }}>{this.state.selected_dealership.label}</p></td>
                                                <td style={{ borderBottom: "1px solid white" }}><p style={{ color: "white" }}>{new Date(this.state.fromDate).toLocaleDateString()}</p></td>
                                                <td style={{ borderBottom: "1px solid white" }}><p style={{ color: "white" }}>{new Date(this.state.toDate).toLocaleDateString()}</p></td>
                                                <td style={{ borderBottom: "1px solid white" }}><p style={{ color: "white" }}> {this.state.appCount}</p></td>
                                                <td style={{ borderBottom: "1px solid white" }}><p style={{ cursor: "pointer", color: "#ff8d72" }} onClick={() => {
                                                    this._isMounted && this.setState({ clicked: true })
                                                }}> Show</p></td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </CardBody>
                            </Card>
                            <Card className="card-raised card-white" hidden={!this.state.clicked} style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                <CardHeader><strong>{this.state.appointments.length} Results</strong></CardHeader>
                                <CardBody>
                                    {this._isMounted && this.state.appointments.map((a, i) => {
                                        return (
                                            <Card key={i} color="transparent" className="card-raised card-white">

                                                <CardBody style={{ whiteSpace: "pre-wrap" }}>
                                                    <p style={{ color: "white" }}><strong>{i + 1}.</strong></p>
                                                    <p style={{ color: "white" }}><strong>{a.internal_msg}</strong></p>
                                                    <p style={{ color: "white" }}>Created: <strong>{new Date(a.verified).toLocaleString()}</strong></p>
                                                </CardBody>
                                            </Card>
                                        );
                                    })}
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