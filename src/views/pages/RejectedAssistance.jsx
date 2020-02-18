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
// import ReactWizard from "react-bootstrap-wizard";

// reactstrap components
import {
    Col, Row, Card,
    CardHeader,
    CardBody,
    Collapse,
    Label,
    // CardText,
    Input,
    Button,
    Container, CardImg,


} from "reactstrap";
import Select from "react-select";
class RejectedAssistance extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rejectedAssistance: [],
            openedCollapses: [""],
            loading: true,
            agent_name: "",
            index: 0,
            fixed_customer_first_name: "",
            fixed_customer_last_name: "",
            fixed_customer_phone: "",
            feedback: "Loading..",
            agents: {},
            agent: {},
            dealerships: [],
            sources: [],
            fixed_dealership: { label: "", value:"", address:"", contacts: []},
            fixed_source: { label: "", value:""},
            fixed_message: ""
        };
        this._isMounted = false
    }
    async componentWillMount() {
        this._isMounted = true
        this._isMounted && this.setState({ loading: true })
        let currUser = this._isMounted && await this.props.mongo.getActiveUser(this.props.mongo.mongodb)
        // let agent = await this.props.mongo.getCollection("agents")
        // let dealerships = await this.props.mongo.getCollection("dealerships")
        // let sources = await this.props.mongo.getCollection("sources")
        let dealerships = this._isMounted && await this.props.mongo.find("dealerships")
        let sources = this._isMounted && await this.props.mongo.find("sources")
        // sources = await sources.find().toArray()
        // dealerships = await dealerships.find().toArray()
        this._isMounted && dealerships.sort((a,b)=>{
            if(a.label < b.label){
              return -1
            }
            if (a.label > b.label){
              return 1
            }
            return 0
        })
        this._isMounted && sources.sort((a,b)=>{
        if(a.label < b.label){
            return -1
        }
        if (a.label > b.label){
            return 1
        }
        return 0
        })
        this._isMounted && await this.setState({ dealerships, sources })
        // agent = await agent.findOne({ userId: currUser.userId })
        let agent = this._isMounted && await this.props.mongo.findOne("agents", {userId: currUser.userId})
        this._isMounted && await this.setState({ agent })
        this._isMounted && await this.getRejectedAssistance()
        this._isMounted && await this.setState({ loading: false, agent })
    }
    componentWillUnmount(){
        this._isMounted = false;
    }
    // with this function we create an array with the opened collapses
    // it is like a toggle function for all collapses from this page
    collapsesToggle = async (collapse, app) => {


        let openedCollapses = this.state.openedCollapses;
        if (openedCollapses.includes(collapse)) {
            this._isMounted && await this.setState({
                openedCollapses: [],
                index: -1,
                fixed_customer_first_name: "",
                fixed_customer_last_name: "",
                fixed_customer_phone: "",
                fixed_dealership: {label:"", value:"", address:"", contacts: []},
                fixed_department: {label:"", value:""},
                fixed_scenario: {label:"", value:""},
                fixed_source: {label:"", value:""},
                fixed_message: ""
            });
        } else {
            console.log(app)

            this._isMounted && await this.setState({
                openedCollapses: [collapse],
                index: parseInt(collapse[collapse.length - 1]),
                fixed_customer_first_name: app.customer_firstname,
                fixed_customer_last_name: app.customer_lastname,
                fixed_customer_phone: app.customer_phone,
                fixed_dealership: app.dealership,
                fixed_source: app.source,
                fixed_message: app.message
            });
        }

    };
    async getRejectedAssistance() {
        this._isMounted && this.setState({ loading: true, feedback: "Getting assistance requests.." })
        let assistance = []
        //loop thru agents

        for (let a in this.state.agent.assistance) {

            if (this.state.agent.assistance[a].isRejected === false) {

                continue;
            }
            assistance.push(this.state.agent.assistance[a])
        }
        this._isMounted && this.setState({ feedback: "Sorting assistance by date.." })
        this._isMounted && await assistance.sort((a, b) => {
            if (a.created > b.created)
                return 1;
            if (a.created < b.created)
                return -1;
            return 0;
        })

        this._isMounted && this.setState({ rejectedAssistance: assistance, loading: false, feedback: "Loading.." })
    }
    async resendAssistance() {
        this._isMounted && this.setState({ loading: true })
        let text = "CUSTOMER NEEDS ASSISTANCE\n"
        text += `${this.state.fixed_dealership.label}\n${this.state.fixed_customer_first_name} ${this.state.fixed_customer_last_name}\n`
        text += `${this.state.fixed_customer_phone}\n${this.state.fixed_message}\n`
        text += `Source: ${this.state.fixed_source.label}`
        let old = JSON.parse(JSON.stringify(this.state.rejectedAssistance[this.state.index]))
        // console.log(old)
        let new_app = {
            customer_firstname: this.state.fixed_customer_first_name,
            customer_lastname: this.state.fixed_customer_last_name,
            customer_phone: this.state.fixed_customer_phone,
            dealership_source: this.state.fixed_source.label,
            dealership: this.state.fixed_dealership,
            isRejected: false,
            isPending: true,
            rejectedReason: "",
            created: new Date(),
            text

        }

        //find current agent's appointment that needs to be updated
        let x = this._isMounted && this.state.agent.assistance.filter((a) => {
            return new Date(a.created).getTime() !== new Date(old.created).getTime()

        })
        new_app = Object.assign(old, new_app)
        
        x.push(new_app)
        let a = this.state.agent
        a.assistance = x
        // console.log(a)
        // await this.state.agents.findOneAndUpdate({ email: this.state.agent.email }, a)
        this._isMounted && await this.props.mongo.findOneAndUpdate("agents", {email: this.state.agent.email}, {
            assistance: a.assistance
        })
        this._isMounted && await this.getRejectedAssistance()
        
        this._isMounted && this.setState({ loading: false,openedCollapses: [] })
        

    }

    render() {
        if (this.state.loading) {
            return (
                <>
                    <div className="content">
                        <Container>
                            <Col className="ml-auto mr-auto text-center" md="6">
                                <Card color="transparent">
                                    <CardImg top width="100%" src={this.props.utils.loading} />
                                </Card>
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
                            // className="card-collapse card-info"
                            className="card-info"
                            id="accordion"
                            role="tablist"
                        >

                            <h1>Rejected Assistance Requests</h1>
                            {
                                this._isMounted && this.state.rejectedAssistance.map((app, index) => {
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
                                                        onClick={(e) => { e.preventDefault(); this.collapsesToggle(app.agent_name + "_" + index, app) }}
                                                    >
                                                        <p>
                                                            Agent Name: <strong>{app.agent_name}</strong>
                                                        </p>
                                                        <p>
                                                            Agent Team: <strong>{app.agent_team}</strong>
                                                        </p>
                                                        <p>Dealer Name: <strong>{app.dealership.label}</strong></p>
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
                                                        <h3>Revise Assistance Info:</h3><br />
                                                        <Row>

                                                            <Col sm="6">
                                                                <Label  >Customer First Name</Label>
                                                                <Input placeholder="Customer First Name" value={this.state.fixed_customer_first_name} onChange={(e) => { this._isMounted && this.setState({ fixed_customer_first_name: e.target.value }) }}></Input>
                                                                <br />
                                                                <Label  >Cutomer Last Name: </Label>
                                                                <Input placeholder="Customer Last Name" value={this.state.fixed_customer_last_name} onChange={(e) => { this._isMounted && this.setState({ fixed_customer_last_name: e.target.value }) }}></Input>
                                                                <br />

                                                                <Label  >Cutomer Phone: </Label>
                                                                <Input type="tel" placeholder="Customer Phone" value={this.state.fixed_customer_phone} onChange={(e) => { this._isMounted && this.setState({ fixed_customer_phone: e.target.value }) }}></Input>
                                                                <br />
                                                                
                                                            </Col>
                                                            <Col sm="6">
                                                                <Label>Dealership Name</Label>
                                                                <Select
                                                                    className="react-select primary"
                                                                    // className={classnames(this.state.firstnameState) primary}
                                                                    classNamePrefix="react-select"
                                                                    name="dealership"
                                                                    value={this.state.fixed_dealership}
                                                                    onChange={value => { this._isMounted && this.setState({ fixed_dealership: value }) }}
                                                                    options={this.state.dealerships}
                                                                    placeholder="Dealership"
                                                                /><br />

                                                                
                                                                <Label>Source</Label>
                                                                <Select
                                                                    className="react-select primary"
                                                                    classNamePrefix="react-select"
                                                                    name="source"
                                                                    value={this.state.fixed_source}
                                                                    onChange={value => this._isMounted && this.setState({ fixed_source: value })}
                                                                    options={this.state.sources}
                                                                    placeholder="Source (optional)"
                                                                />
                                                                
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col sm="12">
                                                            <Label for="message">Message</Label>
                                                                <Input 
                                                                    placeholder="Message/notes"
                                                                    type="textarea"
                                                                    name="text"
                                                                    id="message"
                                                                    style={{height: "500px", whiteSpace: "pre-wrap"}}
                                                                    value={this.state.fixed_message}
                                                                    onChange={async (e)=> {this._isMounted && await this.setState({fixed_message: e.target.value}); }}
                                                                />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col sm="12">
                                                                <Button color="success" className="float-right" disabled={
                                                                    this.state.loading ||
                                                                    this.state.fixed_customer_first_name.length === 0 ||
                                                                    this.state.fixed_customer_last_name.length === 0 ||
                                                                    this.state.fixed_customer_phone.length !== 10 ||
                                                                    isNaN(this.state.fixed_customer_phone)} onClick={() => {
                                                                        this.resendAssistance()
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
                            <h2 hidden={!this.state.loading}>{this.state.feedback}</h2>
                            <h2 hidden={this.state.rejectedAssistance.length > 0 || this.state.loading}>None of your pending assistance requests are rejected.</h2>
                        </div>
                    </Col>
                </div>
            </>
        );
    }
}

export default RejectedAssistance;
