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


class ApproveAssistance extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pendingAssistance: [],
            openedCollapses: [],
            isApprover: false,
            loading: true,
            rejected_reason: "",
            twil: {},
            feedback: "Loading.."
        };

    }
    async componentWillMount() {
        this.setState({ loading: true })
        let currUser = await this.props.mongo.getActiveUser(this.props.mongo.mongodb)
        let agent = await this.props.mongo.getCollection("agents")
        agent = await agent.findOne({ userId: currUser.userId })
        this.setState({ isApprover: agent.isApprover })
        if (agent.isApprover === true) {

            await this.getPendingAssistance()
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
    async getPendingAssistance() {
        this.setState({ loading: true })
        let agents = await this.props.mongo.getCollection("agents")
        agents = await agents.find().toArray()
        let assistance = []
        //loop thru agents
        for (let agent in agents) {
            
            let agent_name = agents[agent].name
            let agent_email = agents[agent].email
            let agent_team = agents[agent].team.label
            for (let a in agents[agent].assistance) {
                if (agents[agent].assistance[a].isPending === false) {
                    continue;
                }
                let newApp = { agent_name, agent_email, agent_team }
                newApp = Object.assign(newApp, agents[agent].assistance[a])
                assistance.push(newApp)
            }
        }
        await assistance.sort((a, b) => {
            if (a.created.getTime() > b.created.getTime())
                return 1;
            if (a.created.getTime() < b.created.getTime())
                return -1;
            return 0;
        })
        this.setState({ pendingAssistance: assistance, loading: false })
    }
    async acceptAssistance(assistance) {
        this.setState({loading: true})
       //find user that has that assistance record
       //update that record to be isRejected = false, isPending=false
       let newAssistance = assistance
       newAssistance.isPending = false
       newAssistance.isRejected = false
       let agents = await this.props.mongo.getCollection("agents")
       let owner = await agents.findOne({userId: newAssistance.userId})
       console.log(owner)
       let ownerAssistance = await owner.assistance.filter((a)=>{
           return a.text == assistance.text
       })
       console.log(assistance.text)
       let index = owner.assistance.indexOf(ownerAssistance[0])
       if (index !== -1) {
           owner.assistance[index] = newAssistance
        }
       await agents.findOneAndReplace({userId: newAssistance.userId}, owner)
       await this.setState({feedback: "Sending texts to dealers"})
       await this.sendText(newAssistance)

       await this.getPendingAssistance()
       this.setState({loading: false, feedback: "Loading.."})
    }
    async rejectAssistance(assistance) {

        this.setState({loading: true})
       //find user that has that assistance record
       //update that record to be isRejected = true, isPending=false
       let newAssistance = assistance
       newAssistance.isPending = false
       newAssistance.isRejected = true
       newAssistance.rejectedReason = this.state.rejected_reason
       let agents = await this.props.mongo.getCollection("agents")
       let owner = await agents.findOne({userId: newAssistance.userId})
       let ownerAssistance = await owner.assistance.filter((a)=>{
           return a.text == assistance.text
       })
       let index = owner.assistance.indexOf(ownerAssistance[0])
       if (index !== -1) {
           owner.assistance[index] = newAssistance
        }
       await agents.findOneAndReplace({userId: newAssistance.userId}, owner)
       await this.getPendingAssistance()
       this.setState({loading: false})
    }
    async sendText(assistance) {
        this.setState({loading: true})
        // await this.setState({loading: true})
        let contacts = assistance.dealership.contacts
        let token = await axios.post("https://webhooks.mongodb-stitch.com/api/client/v2.0/app/centralbdc-bwpmi/service/RingCentral/incoming_webhook/gettoken", {}, {})
        token = token.data
        for (let i = 0; i < contacts.length; i++) {
            await axios.post(`https://webhooks.mongodb-stitch.com/api/client/v2.0/app/centralbdc-bwpmi/service/RingCentral/incoming_webhook/sendsms?toNumber=1${contacts[i]}&fromNumber=1${assistance.dealership.textFrom}&token=${token}`, {
                text: assistance.text
            }, {
                headers: {
                    "Content-Type": "application/json",
                }
            })
        }
        
        this.setState({loading: false})
        
    }
    async sendCustText(assistance) {
        this.setState({loading: true})
        let token = await axios.post("https://webhooks.mongodb-stitch.com/api/client/v2.0/app/centralbdc-bwpmi/service/RingCentral/incoming_webhook/gettoken", {}, {})
        token = token.data

        await axios.post(`https://webhooks.mongodb-stitch.com/api/client/v2.0/app/centralbdc-bwpmi/service/RingCentral/incoming_webhook/sendsms?toNumber=1${assistance.customer_phone}&fromNumber=1${assistance.dealership.textFrom}&token=${token}`, {
                text: assistance.customer_msg
            }, {
                headers: {
                    "Content-Type": "application/json",
                }
            })
        this.setState({loading:false})
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

                            <h1>Approve/Reject Pending Assistance Requests</h1>
                            {
                                this.state.pendingAssistance.map((app, index) => {
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
                                                        <p>Created: <strong>{new Date(app.created).toLocaleDateString() + " " + new Date(app.created).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</strong></p>
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

                                                            <Col sm="12">
                                                                <h3>Assistance Message</h3>
                                                                <blockquote className="blockquote" style={{ whiteSpace: "pre-wrap" }}>
                                                                    <p >{app.text}</p></blockquote>
                                                            </Col>
                                                            
                                                            <Col sm="6">
                                                                <br />

                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col sm="12">
                                                                <Button color="success" className="float-righ" disabled={this.state.loading} onClick={() => {
                                                                    this.acceptAssistance(app)
                                                                }}>Accept</Button>
                                                                <Button color="danger" className="float-right" disabled={this.state.loading} onClick={() => {
                                                                    this.rejectAssistance(app)
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
                            <h2 hidden={!this.state.loading}>{this.state.feedback}</h2>
                            <h2 hidden={this.state.isApprover || this.state.loading}><strong>Unauthorized</strong>: Must be an Approver to approve/reject pending assistance requests</h2>
                            <h2 hidden={!this.state.isApprover || this.state.pendingAssistance.length > 0 || this.state.loading}>No assistance requests pending approval</h2>
                        </div>
                    </Col>
                </div>
            </>
        );
    }
}

export default ApproveAssistance;
