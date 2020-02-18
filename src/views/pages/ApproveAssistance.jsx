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
    Input,
    CardImg, Container,

} from "reactstrap";



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
            feedback: "Loading..",
            texts: []
        };
        this._isMounted = false;
    }
    async componentWillMount() {
        this._isMounted = true;
        this._isMounted && this.setState({ loading: true })
        let currUser = this._isMounted && await this.props.mongo.getActiveUser(this.props.mongo.mongodb)
        // let agent = await this.props.mongo.getCollection("agents")
        // agent = await agent.findOne({ userId: currUser.userId })
        let agent = this._isMounted && await this.props.mongo.findOne("agents", { userId: currUser.userId })
        this._isMounted && this.setState({ isApprover: agent.isApprover })
        if (agent.isApprover === true) {

            this._isMounted && await this.getPendingAssistance()
        }
        this._isMounted && this.setState({ loading: false })
    }
    componentWillUnmount(){
        this._isMounted = false
    }
    // with this function we create an array with the opened collapses
    // it is like a toggle function for all collapses from this page
    collapsesToggle = collapse => {

        let openedCollapses = this.state.openedCollapses;
        this._isMounted && this.setState({ rejected_reason: "" })
        if (openedCollapses.includes(collapse)) {
            this._isMounted && this.setState({
                openedCollapses: []
            });
        } else {
            this._isMounted && this.setState({
                openedCollapses: [collapse]
            });
        }
    };
    async getPendingAssistance() {
        this._isMounted && this.setState({ loading: true })
        // let agents = await this.props.mongo.getCollection("agents")
        // agents = await agents.find().toArray()
        let agents = this._isMounted && await this.props.mongo.find("agents")
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
        this._isMounted && await assistance.sort((a, b) => {
            if (new Date(a.created).getTime() > new Date(b.created).getTime())
                return 1;
            if (new Date(a.created).getTime() < new Date(b.created).getTime())
                return -1;
            return 0;
        })
        let texts = []
        for (let a in assistance) {
            texts.push(assistance[a].text)
        }
        this._isMounted && this.setState({ pendingAssistance: assistance, loading: false, texts })
    }
    async acceptAssistance(assistance, i) {
        this._isMounted && this.setState({ loading: true })
        //find user that has that assistance record
        //update that record to be isRejected = false, isPending=false
        let newAssistance = {}
        for (let a in assistance) {
            newAssistance[a] = assistance[a]
        }
        // let newAssistance = assistance
        newAssistance.isPending = false
        newAssistance.isRejected = false
        newAssistance.text = this.state.texts[i]
        //    let agents = await this.props.mongo.getCollection("agents")
        //    let owner = await agents.findOne({userId: newAssistance.userId})
        let owner = this._isMounted && await this.props.mongo.findOne("agents", { userId: newAssistance.userId })
        let ownerAssistance = this._isMounted && await owner.assistance.filter((a) => {
            return a.text === assistance.text
        })
        console.log(assistance.isPending)
        console.log(newAssistance.text)
        let index = owner.assistance.indexOf(ownerAssistance[0])
        if (index !== -1) {
            owner.assistance[index] = newAssistance
        }
        //    await agents.findOneAndReplace({userId: newAssistance.userId}, owner)
        this._isMounted && await this.props.mongo.findOneAndUpdate("agents", { userId: newAssistance.userId }, {
            assistance: owner.assistance,
            isPending: false,
            isRejected: false
        })
        this._isMounted && await this.setState({ feedback: "Sending texts to dealers" })
        this._isMounted && await this.sendText(newAssistance)

        this._isMounted && await this.getPendingAssistance()
        this._isMounted && this.setState({ loading: false, feedback: "Loading.." })
    }
    async rejectAssistance(assistance) {

        this._isMounted && this.setState({ loading: true })
        //find user that has that assistance record
        //update that record to be isRejected = true, isPending=false
        let newAssistance = assistance
        newAssistance.isPending = false
        newAssistance.isRejected = true
        newAssistance.rejectedReason = this.state.rejected_reason
        //    let agents = await this.props.mongo.getCollection("agents")
        //    let owner = await agents.findOne({userId: newAssistance.userId})
        let owner = this._isMounted && await this.props.mongo.findOne("agents", { userId: newAssistance.userId })
        let ownerAssistance = this._isMounted && await owner.assistance.filter((a) => {
            return a.text === assistance.text
        })
        let index = owner.assistance.indexOf(ownerAssistance[0])
        if (index !== -1) {
            owner.assistance[index] = newAssistance
        }
        //    await agents.findOneAndReplace({userId: newAssistance.userId}, owner)
        this._isMounted && await this.props.mongo.findOneAndUpdate("agents", { userId: newAssistance.userId }, {
            assistance: owner.assistance,
            isPending: false,
            isRejected: true,
            rejectedReason: this.state.rejected_reason
        })
        this._isMounted && await this.getPendingAssistance()
        this._isMounted && this.setState({ loading: false })
    }
    async sendText(assistance) {
        this._isMounted && this.setState({ loading: true })
        // await this.setState({loading: true})
        let contacts = assistance.dealership.contacts
        let token = this._isMounted && await this.props.mongo.getToken()
        let arr = []
        for (let c in contacts) {
            contacts[c] = "1" + contacts[c]
            arr = []
            arr.push(contacts[c])

            this.props.mongo.sendGroupText("1" + assistance.dealership.textFrom, assistance.text, arr, token)
        }


        this._isMounted && this.setState({ loading: false })

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
                                this._isMounted && this.state.pendingAssistance.map((app, index) => {
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
                                                        <p>Dealer Name: <strong>{app.dealership ? app.dealership.label : ""}</strong></p>
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
                                                                    <p >{app.text}</p>
                                                                </blockquote>
                                                                <h3>Edit: </h3>
                                                                <textarea id="edit" value={this.state.texts[index]} onChange={(e) => {
                                                                    let t = this.state.texts
                                                                    t[index] = e.target.value;
                                                                    this._isMounted && this.setState({ texts: t })
                                                                }} rows={16} cols={48}></textarea>
                                                            </Col>
                                                            <Col sm="6">
                                                                <br />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col sm="12">
                                                                <p style={{ "color": "red" }} hidden={this.state.texts[index].length <= 1000}>Message too long.</p>
                                                                <Button color="success" className="float-righ" disabled={this.state.texts[index].length > 1000 || this.state.loading} onClick={() => {
                                                                    this.acceptAssistance(app, index)
                                                                }}>Accept</Button>
                                                                <Button color="danger" className="float-right" disabled={this.state.loading} onClick={() => {
                                                                    this.rejectAssistance(app)
                                                                }}>Reject</Button>
                                                                <Input placeholder="Rejected Reason" value={this.state.rejected_reason} onChange={(e) => this.setState({ rejected_reason: e.target.value })}></Input>
                                                            </Col>
                                                        </Row>
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
