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
    Button,
    Card,
    CardBody,
    CardFooter,
    CardImg,
    CardTitle,
    ListGroupItem,
    ListGroup,
    Progress,
    Input,
    Image,
    Label,
    Form,
    Container,
    Row,
    Col,
    FormGroup
} from "reactstrap";
import Select from "react-select"
import ReactDatetime from "react-datetime";
class AppointmnetSearchNew extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            search_phone: "",
            search_agent: { label: "", value: "" },
            agents: [],
            fromDate: new Date(),
            toDate: new Date(),
            appt_results: [],
            asst_results: [],
            resultsLoading: []
        };
        this.searchForAppt = this.searchForAppt.bind(this)
        this.clearForm = this.clearForm.bind(this)
    }
    _isMounted = false
    async componentDidMount() {
        this._isMounted = true
        this._isMounted && this.setState({ loading: true })
        let agents = this._isMounted && await this.props.mongo.find("agents");
        agents = this._isMounted && agents.map((a) => {
            a.label = a.name;
            a.value = a._id;
            return a;
        })
        this._isMounted && agents.sort((a, b) => {
            if (a.label > b.label) return 1;
            if (a.label < b.label) return -1;
            return 0;
        })
        this._isMounted && this.setState({ loading: false, agents })

    }
    onInputChange(key, value) {
        this.setState({ [key]: value })
    }

    componentWillUnmount() {
        this._isMounted = false

    }
    async searchForAppt() {
        this.setState({ loading: true })
        let total_apps = []
        let total_asst = []
        let agent_apps = []
        let phone_apps = []
        let phone_asst = []
        let today_apps = []
        let today_asst = []
        let agentIndex = -1;

        let total_assistance = []
        for (let a in this.state.agents) {
            total_assistance = total_assistance.concat(this.state.agents[a].assistance);
        }
        //get today appts
        if (this.state.search_agent.label.length > 0) {
            agentIndex = this.state.agents.findIndex((a) => {
                return a.name === this.state.search_agent.label
            })
            today_apps = this.state.agents[agentIndex].appointments
            today_asst = this.state.agents[agentIndex].assistance

        }
        else {
            for (let a in this.state.agents) {
                today_apps = today_apps.concat(this.state.agents[a].appointments)
                today_asst = today_asst.concat(this.state.agents[a].assistance)
            }
        }

        //get phone apps
        if (this.state.search_phone.length === 10) {
            phone_apps = await this.props.mongo.find("all_appointments", { customer_phone: this.state.search_phone });
            console.log(phone_apps)
            let today_phone = phone_apps.concat(today_apps.filter((a) => {
                return a.customer_phone.indexOf(this.state.search_phone) !== -1
            }))
            for (let a in today_phone) {
                if (phone_apps.findIndex(app => { return app.verified === today_phone[a].verified }) === -1) {
                    phone_apps.push(today_phone[a])
                }
            }
            phone_asst = today_asst.filter((a) => {
                return a.customer_phone === this.state.search_phone
            })

        }



        if (this.state.search_phone.length === 10) {
            total_apps = phone_apps
            total_asst = phone_asst
            if (this.state.search_agent.label.length > 0) {
                total_apps = total_apps.filter((a) => { return a.agent_id === this.state.search_agent._id })
                total_asst = total_asst.filter((a) => { return a.agent_email === this.state.search_agent.email })
            }
        }
        else {
            total_apps = today_apps
            total_asst = today_asst
            let all_agent_apps = await this.props.mongo.find("all_appointments", { agent_id: this.state.search_agent.value });
            for (let a in all_agent_apps) {
                if (total_apps.findIndex((app) => { return app.verified === all_agent_apps[a].verified }) === -1) {
                    total_apps.push(all_agent_apps[a])
                }
            }

        }
        total_apps.sort((a, b) => {
            if (new Date(a.created).getTime() > new Date(b.created).getTime()) return -1;
            if (new Date(a.created).getTime() < new Date(b.created).getTime()) return 1;
            return 0;
        })
        total_asst.sort((a, b) => {
            if (new Date(a.created).getTime() > new Date(b.created).getTime()) return -1;
            if (new Date(a.created).getTime() < new Date(b.created).getTime()) return 1;
            return 0;
        })
        let final = []
        for (let a in total_apps) {
            if (final.findIndex(app => { return app.verified === total_apps[a].verified }) === -1) {
                final.push(total_apps[a])
            }
        }
        this.setState({ appt_results: final, asst_results: total_asst, loading: false })
    }
    async clearForm() {
        this.setState({
            search_first_name: "",
            search_last_name: "",
            search_phone: "",
            search_agent: { label: "", value: "" },
            fromDate: new Date(),
            toDate: new Date()
        })
    }
    render() {
        if (this.state.loading) {
            return (
                <>
                    <div className="content">
                        <Container>
                            <Col className="ml-auto mr-auto text-center" md="6" >
                                {/* <Card color="transparent"> */}
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
                    <Container >
                        <Row style={{ justifyContent: "center" }}>
                            <Col className="card-raised ml-auto mr-auto text-center" md="6">

                                <h1 className="title">Appointment/Follow-Up Search</h1>
                                <br />
                            </Col>
                        </Row>
                        <Row style={{ justifyContent: "center" }}>
                            <Col md="12">
                                <Card className="card-raised card-white" style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                    <CardBody>
                                        <Form onSubmit={(e) => {
                                            e.preventDefault()
                                            this.searchForAppt()
                                        }}>
                                            <FormGroup>
                                                <legend style={{ color: "white" }}>Customer Phone</legend>
                                                <Input
                                                    type="number"
                                                    style={{ backgroundColor: "white" }}
                                                    value={this.state.search_phone}
                                                    onChange={(e) => { this.onInputChange("search_phone", e.target.value) }}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <legend style={{ color: "white" }}>Agent</legend>
                                                <Select
                                                    type="number"
                                                    // style={{ backgroundColor: "white" }}
                                                    options={this.state.agents}
                                                    value={this.state.search_agent}
                                                    onChange={(e) => { this.onInputChange("search_agent", e) }}
                                                />
                                            </FormGroup>
                                            <Button

                                                color="warning"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    this.clearForm()
                                                }}>Clear Form</Button>
                                            <Button
                                                type="submit"
                                                disabled={
                                                    (this.state.search_agent.label.length < 1 &&
                                                        this.state.search_phone.length !== 10) ||
                                                    (new Date(this.state.fromDate).getTime() > new Date(this.state.toDate).getTime())

                                                }
                                                color="neutral"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    this.searchForAppt()
                                                }}>Search</Button>
                                        </Form>
                                    </CardBody>
                                </Card>
                                <br />
                            </Col>
                        </Row>
                        <Row style={{ justifyContent: "center" }}>
                            <Col md="6">
                                <legend>Appointments</legend>
                                <Card className="card-raised card-white" style={{ padding: "20px", background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                    <legend style={{ color: "white" }}>{this.state.appt_results.length} Result(s)</legend>
                                    <CardBody>
                                        {this.state.appt_results.map((a, i) => {
                                            return (
                                                <Card color="transparent" className="card-raised card-white" key={i}>
                                                    <CardBody style={{ whiteSpace: "pre-wrap" }}>
                                                        <p style={{ color: "white" }}><strong>{i + 1}.</strong></p>
                                                        <p style={{ color: "white" }}><strong>{a.internal_msg}</strong></p>
                                                        <p style={{ color: "white" }}>Created <strong>{new Date(a.verified).toLocaleString()}</strong></p>
                                                        <p style={{ color: "white" }}>Agent: <strong>{this.state.agents[this.state.agents.findIndex((agent) => { return agent._id === a.agent_id })].name}</strong></p>
                                                    </CardBody>
                                                </Card>
                                            )
                                        })}
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col md="6">
                                <legend>Follow-Ups</legend>
                                <Card className="card-raised card-white" style={{ padding: "20px", background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                    <legend style={{ color: "white" }}>{this.state.asst_results.length} Result(s)</legend>
                                    <CardBody>
                                        {this.state.asst_results.map((a, i) => {
                                            return (
                                                <Card color="transparent" className="card-raised card-white" color="transparent" key={i}>
                                                    <CardBody style={{ whiteSpace: "pre-wrap" }}>
                                                        <p style={{ color: "white" }}><strong>{i + 1}.</strong></p>
                                                        <p style={{ color: "white" }}>Dealership: <strong>{a.dealership.label}</strong></p>
                                                        <p style={{ color: "white" }}>Message: <strong>{a.message}</strong></p>
                                                        <p style={{ color: "white" }}>Customer Name: <strong>{a.customer_firstname} {a.customer_lastname}</strong></p>
                                                        <p style={{ color: "white" }}>Customer Phone: <strong>{a.customer_phone}</strong></p>
                                                        <p style={{ color: "white" }}>Source: <strong>{a.source.label}</strong></p>
                                                        <p style={{ color: "white" }}>Created: <strong>{new Date(a.created).toLocaleString()}</strong></p>
                                                        <p style={{ color: "white" }}>Agent: <strong>{this.state.agents[this.state.agents.findIndex((agent) => { return agent.userId === a.userId })].name}</strong></p>
                                                    </CardBody>
                                                </Card>
                                            )
                                        })}
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </>
        );
    }
}

export default AppointmnetSearchNew;
