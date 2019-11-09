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
// react plugin used to create a form with multiple steps
import ReactWizard from "react-bootstrap-wizard";

// reactstrap components
import {
    Col, Row, Card,
    CardHeader,
    CardBody,
    Collapse,
    CardText,
    Input,
    Button

} from "reactstrap";
import { TextField } from '@material-ui/core';

// wizard steps
import Step1 from "../forms/WizardSteps/Step1.jsx";
import Step2 from "../forms/WizardSteps/Step2.jsx";
import Step3 from "../forms/WizardSteps/Step3.jsx";
import axios from 'axios'


class Rejected extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rejectedAppointments: [],
            openedCollapses: [""],
            loading: true
        };

    }
    async componentWillMount() {
        this.setState({ loading: true })
        let currUser = await this.props.mongo.getActiveUser(this.props.mongo.mongodb)
        let agent = await this.props.mongo.getCollection("agents")
        agent = await agent.findOne({ userId: currUser.userId })
        this.setState({ isApprover: agent.isApprover })
        await this.getRejectedAppointments()
        this.setState({ loading: false })
    }
    // with this function we create an array with the opened collapses
    // it is like a toggle function for all collapses from this page
    collapsesToggle = collapse => {

        let openedCollapses = this.state.openedCollapses;
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
    async getRejectedAppointments() {
        this.setState({ loading: true })
        let user = await this.props.mongo.getActiveUser(this.props.mongo.mongodb)
        let agents = await this.props.mongo.getCollection("agents")
        let agent = await agents.findOne({ userId: user.userId })
        let appointments = []
        //loop thru agents

        for (let a in agent.appointments) {

            if (agent.appointments[a].isRejected === false) {
                
                continue;
            }
            appointments.push(agent.appointments[a])
        }

        await appointments.sort((a, b) => {
            if (a.appointment_date > b.appointment_date)
                return 1;
            if (a.appointment_date < b.appointment_date)
                return -1;
            return 0;
        })

        this.setState({ rejectedAppointments: appointments, loading: false })
    }
    resendAppointment(app){
        
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

                            <h1>Rejected Appointments</h1>
                            {
                                this.state.rejectedAppointments.map((app, index) => {
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

                                                        <p>Dealer Name: <strong>{app.dealership_name}</strong></p>
                                                        <p>Appointment Date: <strong>{new Date(app.appointment_date).toLocaleDateString() + " " + new Date(app.appointment_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</strong></p>
                                                        <p>
                                                            Customer Name: {app.customer_firstname + " " + app.customer_lastname}
                                                        </p>
                                                        <p>Created: {new Date(app.created).toLocaleDateString() + " " + new Date(app.created).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                                                        <p>Rejection reason: {app.rejectedReason}</p>
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
                                                                <textarea className="blockquote" style={{ whiteSpace: "pre-wrap", height:300}} defaultValue={app.internal_msg} value={this.state.internalMsg} onChange={(e)=>{this.setState({internalMsg: e.target.value})}}>
                                                                    </textarea>
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
                                                                <Button color="success" className="float-right" disabled={this.state.loading} onClick={() => {
                                                                    this.resendAppointment(app)
                                                                }}>Resubmit for Approval</Button>
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
                            <h2 hidden={this.state.rejectedAppointments.length > 0 || this.state.loading}>None of your pending appointments are rejected.</h2>
                        </div>
                    </Col>
                </div>
            </>
        );
    }
}

export default Rejected;
