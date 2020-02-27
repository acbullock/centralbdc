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
    CardImg,
    Input,
    Form,
    Container,
    Row,
    Col,
    FormGroup
} from "reactstrap";
import Select from "react-select"
import ReactDatetime from "react-datetime";
class ApptSearch extends React.Component {
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
    componentWillMount() {
        if (this.props.agent.account_type !== "admin") {
            this.props.history.push("/admin/dashboard");
            return
        }
    }
    async componentDidMount() {
        this._isMounted = true
        this._isMounted && this.setState({ loading: true })
        let agents = await this.props.mongo.aggregate("agents", [
            {
                "$group": {
                    _id: "$_id",
                    label: { "$first": "$name" },
                    name: { "$first": "$name" },
                    value: { "$first": "$_id" },
                    assistance: { "$first": "$assistance" },
                    userId: { "$first": "$userId" }
                }
            },
            {
                "$sort": {
                    label: 1
                }
            },
            {
                "$project": {
                    _id: 1,
                    label: 1,
                    value: 1,
                    userId: 1,
                    name: 1,
                    "assistance.dealership.label": 1,
                    "assistance.message": 1,
                    "assistance.customer_firstname": 1,
                    "assistance.customer_lastname": 1,
                    "assistance.customer_phone": 1,
                    "assistance.source.label": 1,
                    "assistance.created": 1,
                    "assistance.userId": 1
                }
            }
        ])
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
        let fromDate = new Date(new Date(this.state.fromDate).setHours(0, 0, 0, 0)).toISOString()
        let toDate = new Date(new Date(this.state.toDate).setHours(23, 59, 59, 999)).toISOString()
        let userId;
        if (this.state.search_agent.label.length > 0) {
            let age = await this.props.mongo.findOne("agents", { _id: this.state.search_agent.value }, { projection: { userId: 1 } })
            userId = age.userId
        }
        let verifiedMatch = {
            "$gte": fromDate,
            "$lte": toDate
        }
        let total_asst = []
        for (let ag in this.state.agents) {
            total_asst = this._isMounted && await total_asst.concat(this.state.agents[ag].assistance)
        }
        //if theres just a  phone..
        let match;
        if (this.state.search_phone.length === 10 && this.state.search_agent.label.length === 0) {
            match =
            {
                "$match": {
                    "customer_phone": this.state.search_phone,
                    "verified": verifiedMatch
                }
            }
            total_asst = total_asst.filter((a) => {
                return a.customer_phone === this.state.search_phone &&
                    new Date(a.created).toISOString() >= fromDate &&
                    new Date(a.created).toISOString() <= toDate
            })
        }
        //if theres just an agent
        else if (this.state.search_phone.length !== 10 && this.state.search_agent.label.length > 0) {
            match = {
                "$match": {
                    "agent_id": this.state.search_agent.value,
                    "verified": verifiedMatch
                }
            }
            total_asst = total_asst.filter((a) => {
                return a.userId === userId &&
                    a.created >= fromDate &&
                    a.created <= toDate
            })
        }
        //if theres both
        else if (this.state.search_phone.length === 10 && this.state.search_agent.label.length > 0) {
            match = {
                "$match": {
                    "customer_phone": this.state.search_phone,
                    "agent_id": this.state.search_agent.value,
                    "verified": verifiedMatch
                }
            }
            total_asst = total_asst.filter((a) => {
                return a.customer_phone === this.state.search_phone && a.userId === userId &&
                    new Date(a.created).toISOString() >= fromDate &&
                    new Date(a.created).toISOString() <= toDate
            })
        }
        let results = await this.props.mongo.aggregate("all_appointments", [
            match
        ])







        this.setState({ loading: false, appt_results: results, asst_results: total_asst })
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
                                            <FormGroup>
                                                <legend style={{ color: "white" }}>From</legend>
                                                <Card>
                                                    <ReactDatetime
                                                        timeFormat={false}
                                                        value={this.state.fromDate}
                                                        onChange={(e) => { this.setState({ fromDate: e }) }}
                                                    />
                                                </Card>
                                            </FormGroup>
                                            <FormGroup>
                                                <legend style={{ color: "white" }}>To</legend>
                                                <Card>
                                                    <ReactDatetime
                                                        timeFormat={false}
                                                        value={this.state.toDate}
                                                        onChange={(e) => { this.setState({ toDate: e }) }}
                                                    />
                                                </Card>
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
                                                    (new Date(this.state.fromDate).getTime() > new Date(this.state.toDate).getTime()) ||
                                                    isNaN(new Date(this.state.fromDate).getTime()) ||
                                                    isNaN(new Date(this.state.toDate).getTime())

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
                                                <Card color="transparent" className="card-raised card-white" key={i}>
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

export default ApptSearch;
