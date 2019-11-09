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
    Button

} from "reactstrap";

// wizard steps
import Step1 from "../forms/WizardSteps/Step1.jsx";
import Step2 from "../forms/WizardSteps/Step2.jsx";
import Step3 from "../forms/WizardSteps/Step3.jsx";



class Approve extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pendingAppointments: [],
            openedCollapses: ["Alexander Bullock"]
        };
        console.log(this.props.mongo)
    }
    componentWillMount() {
        this.getPendingAppointments()
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
    async getPendingAppointments() {
        let agents = await this.props.mongo.getCollection("agents")
        agents = await agents.find().toArray()
        let appointments = []
        //loop thru agents
        for (let agent in agents) {
            let agent_name = agents[agent].name
            let agent_email  = agents[agent].email
            for (let a in agents[agent].appointments) {
                if (agents[agent].appointments[a].isPending === false) {
                    continue;
                }
                let newApp = { agent_name, agent_email }
                newApp = Object.assign(newApp, agents[agent].appointments[a])

                appointments.push(newApp)
            }
        }
        appointments.sort((a, b) => {
            if (a.appointment_date > b.appointment_date)
                return 1;
            if (a.appointment_date < b.appointment_date)
                return -1;
            return 0;
        })
        this.setState({ pendingAppointments: appointments })
    }
    async acceptAppointment(appointment){
        //update appointment to be ispending false, verified is now
        let new_app = appointment;
        new_app.isPending = false;
        new_app.verified = new Date()
        let agents = await this.props.mongo.getCollection("agents")
        let agent = await agents.findOne({email: appointment.agent_email})

        let apps = agent.appointments.filter((a)=>{
            return a.created.getTime() !== appointment.created.getTime();

        })
        
        agent.appointments = apps
        // agent.appointments = x
        agent.appointments.push(new_app)
        
        await agents.findOneAndReplace({email: appointment.agent_email}, agent)
        await this.getPendingAppointments()
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
                                                            Agent Name: <strong>{app.agent_name}</strong></p>
                                                        <p>Dealer Name: <strong>{app.dealership_name}</strong></p>
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
                                                                <blockquote className="blockquote" sylte={{ whiteSpace: "pre-wrap" }}>
                                                                    <p style={{ whiteSpace: "pre-wrap" }}>{app.internal_msg}</p></blockquote>
                                                            </Col>
                                                            <Col sm="6">
                                                                <h3>Customer Message</h3>
                                                                <blockquote className="blockquote" sylte={{ whiteSpace: "pre-wrap" }}>
                                                                    <p style={{ whiteSpace: "pre-wrap" }}>{app.customer_msg}</p></blockquote>
                                                            </Col>
                                                            <Col sm="6">
                                                                <br />

                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col sm="12">
                                                                <Button color="success" className="float-right" onClick={()=>{
                                                                    this.acceptAppointment(app)
                                                                }}>Accept</Button>
                                                                <Button color="danger" className="float-right" onClick={()=>{
                                                                    alert(JSON.stringify(app.agent_email))
                                                                }}>Reject</Button>

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
                        </div>
                    </Col>
                </div>
            </>
        );
    }
}

export default Approve;
