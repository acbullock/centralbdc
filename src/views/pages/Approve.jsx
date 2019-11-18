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
    Col, Row, Card,
    CardHeader,
    CardBody,
    Collapse,
    // CardText,
    Button,
    Input

} from "reactstrap";

// wizard steps
import axios from 'axios'


class Approve extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pendingAppointments: [],
            openedCollapses: [],
            isApprover: false,
            loading: true,
            rejected_reason: "",
            twil: {}
        };

    }
    async componentWillMount() {
        this.setState({ loading: true })
        let twil = await this.props.mongo.getCollection("utils")
        twil = await twil.find().toArray()
        await this.setState({ twil: twil[0].twilio })
        let currUser = await this.props.mongo.getActiveUser(this.props.mongo.mongodb)
        let agent = await this.props.mongo.getCollection("agents")
        agent = await agent.findOne({ userId: currUser.userId })
        this.setState({ isApprover: agent.isApprover })
        if (agent.isApprover === true) {

            await this.getPendingAppointments()
        }
        this.setState({ loading: false })
    }
    // with this function we create an array with the opened collapses
    // it is like a toggle function for all collapses from this page
    collapsesToggle = collapse => {

        let openedCollapses = this.state.openedCollapses;
        this.setState({ rejected_reason: "" })
        if (openedCollapses.includes(collapse)) {
            this.setState({
                openedCollapses: []
            });
        } else {
            this.setState({
                openedCollapses: [collapse]
            });
        }
    };
    async getPendingAppointments() {
        this.setState({ loading: true })
        let agents = await this.props.mongo.getCollection("agents")
        agents = await agents.find().toArray()
        let appointments = []
        //loop thru agents
        for (let agent in agents) {
            
            let agent_name = agents[agent].name
            let agent_email = agents[agent].email
            let agent_team = agents[agent].team.label
            for (let a in agents[agent].appointments) {
                if (agents[agent].appointments[a].isPending === false) {
                    continue;
                }
                let newApp = { agent_name, agent_email, agent_team }
                newApp = Object.assign(newApp, agents[agent].appointments[a])
                appointments.push(newApp)
            }
        }
        await appointments.sort((a, b) => {
            if (a.appointment_date > b.appointment_date)
                return 1;
            if (a.appointment_date < b.appointment_date)
                return -1;
            return 0;
        })
        this.setState({ pendingAppointments: appointments, loading: false })
    }
    async acceptAppointment(appointment) {
        //update appointment to be ispending false, verified is now
        this.setState({ loading: true })
        let new_app = appointment;
        new_app.isPending = false;
        new_app.verified = new Date()
        let agents = await this.props.mongo.getCollection("agents")
        let agent = await agents.findOne({ email: appointment.agent_email })

        let apps = await agent.appointments.filter((a) => {
            return a.created.getTime() !== appointment.created.getTime();

        })

        agent.appointments = apps
        // agent.appointments = x
        agent.appointments.push(new_app)
        await agents.findOneAndReplace({ email: appointment.agent_email }, agent)
        await this.getPendingAppointments()
        await this.sendText(appointment)
        await this.sendCustText(appointment)
        this.setState({ loading: false })
    }
    async rejectAppointment(appointment) {

        this.setState({ loading: true })
        //update appointment to be ispending false, verified is now
        let new_app = appointment;
        new_app.isPending = false;
        new_app.isRejected = true;
        new_app.rejectedReason = this.state.rejected_reason
        let agents = await this.props.mongo.getCollection("agents")
        let agent = await agents.findOne({ email: appointment.agent_email })

        let apps = await agent.appointments.filter((a) => {
            return a.created.getTime() !== appointment.created.getTime();

        })

        agent.appointments = apps
        // agent.appointments = x
        agent.appointments.push(new_app)

        await agents.findOneAndReplace({ email: appointment.agent_email }, agent)
        await this.getPendingAppointments()
        this.setState({ loading: false })
    }
    async sendText(appointment) {
        let data = new FormData();
        // await this.setState({loading: true})
        let contacts = appointment.dealership.contacts
        
        for (let i = 0; i < contacts.length; i++) {
            
            
            let x = await axios.post(`https://webhooks.mongodb-stitch.com/api/client/v2.0/app/centralbdc-bwpmi/service/RingCentral/incoming_webhook/sendsms?toNumber=1${contacts[i]}&fromNumber=14243162268`, {
                text: appointment.internal_msg
            }, {
                headers: {
                    "Content-Type": "application/json",
                }
            })
            console.log(x)


        }

        
    }
    async sendCustText(appointment) {

        let data = new FormData();
        // await this.setState({loading: true})
        

        let x = await axios.post(`https://webhooks.mongodb-stitch.com/api/client/v2.0/app/centralbdc-bwpmi/service/RingCentral/incoming_webhook/sendsms?toNumber=1${appointment.customer_phone}&fromNumber=14243162268`, {
                text: appointment.customer_msg
            }, {
                headers: {
                    "Content-Type": "application/json",
                }
            })
            console.log(x)
    }
    render() {
        return (
            <>
                <div className="content">
                    <Col className="mr-auto ml-auto" md="10">
                        <div
                            aria-multiselectable={true}
                            className="card-collapse"
                            id="accordion"
                            role="tablist"
                        >

                            <h1>Approve/Reject Pending Appointments</h1>
                            {
                                this.state.pendingAppointments.map((app, index) => {
                                    return (
                                        <div key={app.agent_name + "_" + index}>

                                            <Card className="card" >
                                                <CardHeader role="tab">
                                                    <a
                                                        aria-expanded={this.state.openedCollapses.includes(
                                                            index
                                                        )}
                                                        href="#pablo"
                                                        data-parent="#accordion"
                                                        data-toggle="collapse"
                                                        onClick={(e) => { e.preventDefault(); this.collapsesToggle(app.agent_name + "_" + index) }}
                                                    >
                                                        <p>
                                                            Agent Name: <strong>{app.agent_name}</strong>
                                                        </p>
                                                        <p>
                                                            Team Name: <strong>{app.agent_team}</strong>
                                                        </p>
                                                        <p>Dealer Name: <strong>{app.dealership? app.dealership.label:"" }</strong></p>
                                                        <p>Appointment Date: <strong>{new Date(app.appointment_date).toLocaleDateString() + " " + new Date(app.appointment_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</strong></p>
                                                        <p>
                                                            Customer Name: {app.customer_firstname + " " + app.customer_lastname}
                                                        </p>
                                                        <p>Created: {new Date(app.created).toLocaleDateString() + " " + new Date(app.created).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                                                        <i className="tim-icons icon-minimal-down" />
                                                    </a>
                                                </CardHeader>
                                                <Collapse
                                                    role="tabpanel"
                                                    isOpen={this.state.openedCollapses.includes(app.agent_name + "_" + index)}

                                                >
                                                    <CardBody>
                                                        <Row>

                                                            <Col sm="6">
                                                                <h3>Internal Message</h3>
                                                                <blockquote className="blockquote" style={{ whiteSpace: "pre-wrap" }}>
                                                                    <p >{app.internal_msg}</p></blockquote>
                                                            </Col>
                                                            <Col sm="6">
                                                                <h3>Customer Message</h3>
                                                                <blockquote className="blockquote" style={{ whiteSpace: "pre-wrap" }}>
                                                                    <p style={{ whiteSpace: "pre-wrap" }}>{app.customer_msg}</p></blockquote>
                                                            </Col>
                                                            <Col sm="6">
                                                                <br />

                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col sm="12">
                                                                <Button color="success" className="float-righ" disabled={this.state.loading} onClick={() => {
                                                                    this.acceptAppointment(app)
                                                                }}>Accept</Button>
                                                                <Button color="danger" className="float-right" disabled={this.state.loading} onClick={() => {
                                                                    this.rejectAppointment(app)
                                                                }}>Reject</Button>
                                                                <Input placeholder="Rejected Reason" value={this.state.rejected_reason} onChange={(e) => this.setState({ rejected_reason: e.target.value })}></Input>
                                                            </Col>
                                                        </Row>
                                                        {/* <p>Internal Message</p>
                                                        <p style={{whiteSpace: "pre-wrap"}}>{app.internal_msg}</p>
                                                        <p>Customer Message</p>
                                                        <p style={{whiteSpace: "pre-wrap"}}>{app.customer_msg}</p> */}

                                                    </CardBody>
                                                </Collapse>

                                            </Card>
                                            <br />

                                        </div>
                                    );
                                })

                            }
                            <h2 hidden={!this.state.loading}>Loading..</h2>
                            <h2 hidden={this.state.isApprover || this.state.loading}><strong>Unauthorized</strong>: Must be an Approver to approve/reject pending appointments</h2>
                            <h2 hidden={!this.state.isApprover || this.state.pendingAppointments.length > 0 || this.state.loading}>No appointments pending approval</h2>
                        </div>
                    </Col>
                </div>
            </>
        );
    }
}

export default Approve;
