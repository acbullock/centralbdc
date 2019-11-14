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
    FormGroup,


} from "reactstrap";
import Select from "react-select";
import ReactDatetime from "react-datetime";
class Rejected extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rejectedAppointments: [],
            openedCollapses: [""],
            loading: true,
            agent_name: "",
            index: 0,
            fixed_customer_first_name: "",
            fixed_customer_last_name: "",
            fixed_customer_phone: "",
            fixed_date: new Date(),
            feedback: "Loading..",
            agents: {},
            agent: {},
            dealerships: [],
            sources: [],
            scenarios: [
                {
                    value: "50", isDisabled: true, label: "Data-Mining"
                },
                {
                    value: "51", label: "High Interest"
                },
                {
                    value: "52", label: "Easy Lease Upgrade"
                },
                {
                    value: "53", label: "Buy Back Offer"
                },
                {
                    value: "54", isDisabled: true, label: "Sales"
                },
                {
                    value: "55", label: "NEW - Coming in to take advantage of employee pricing sales event"
                },
                {
                    value: "56", label: "USED - Coming in to view pre-owned inventory for VIP appointment"
                },
                {
                    value: "57", label: "Coming in for bank interview with finance manager"
                },
                {
                    value: "58", isDisabled: true, label: "Service to Sales"
                },
                {
                    value: "59", label: "Meeting with VIP manager to hear buy back offer on current vehicle"
                },
                
            ],
            fixed_dealership: "",
            fixed_department: "",
            fixed_scenario: "",
            fixed_source: "",
            departments: [
                { value: "47", label: "Sales" },
                { value: "48", label: "Data-Mining" },
                { value: "49", label: "Service to Sales" }
            ]
        };

    }
    isValidDate (current) {

        let x = new Date(current);
        let now = new Date()
        let nowAnd3Days = new Date(now.getTime() + (4* 24*60*60*1000))
        
        if(x.getTime() > nowAnd3Days.getTime()){
            return false;
        }
        if (x.getTime() < now.getTime()){
            return false
        }
        
        let open = new Date(x)
        open.setHours(9,30)
    
        let close = new Date(x)
        close.setHours(18,30)
        if(x.getTime() < open.getTime()){
            return false
        }
        if(x > close){
            return false
        }
        return true
      }
    async componentWillMount() {
        this.setState({ loading: true })
        let currUser = await this.props.mongo.getActiveUser(this.props.mongo.mongodb)
        let agent = await this.props.mongo.getCollection("agents")
        let dealerships = await this.props.mongo.getCollection("dealerships")
        let sources = await this.props.mongo.getCollection("sources")
        sources = await sources.find().toArray()
        dealerships = await dealerships.find().toArray()
        dealerships.sort((a,b)=>{
            if(a.label < b.label){
              return -1
            }
            if (a.label > b.label){
              return 1
            }
            return 0
          })
          sources.sort((a,b)=>{
            if(a.label < b.label){
              return -1
            }
            if (a.label > b.label){
              return 1
            }
            return 0
          })
        await this.setState({ agents: agent, dealerships, sources })
        agent = await agent.findOne({ userId: currUser.userId })
        await this.setState({ agent })
        await this.getRejectedAppointments()
        await this.setState({ loading: false, agent })
    }
    // with this function we create an array with the opened collapses
    // it is like a toggle function for all collapses from this page
    collapsesToggle = async (collapse, app) => {


        let openedCollapses = this.state.openedCollapses;
        if (openedCollapses.includes(collapse)) {
            await this.setState({
                openedCollapses: [],
                index: -1,
                fixed_customer_first_name: "",
                fixed_customer_last_name: "",
                fixed_customer_phone: "",
                fixed_date: "",
                fixed_dealership: "",
                fixed_department: "",
                fixed_scenario: "",
                fixed_source: ""
            });
        } else {


            await this.setState({
                openedCollapses: [collapse],
                index: parseInt(collapse[collapse.length - 1]),
                fixed_customer_first_name: app.customer_firstname,
                fixed_customer_last_name: app.customer_lastname,
                fixed_customer_phone: app.customer_phone,
                fixed_date: app.appointment_date,
                fixed_dealership: {label: app.dealership_name, value:""},
                fixed_department: {label: app.dealership_department, value:""},
                fixed_scenario: {label: app.dealership_scenario, value:""},
                fixed_source: {label: app.dealership_source, value:""}
            });
        }

    };
    currentRejection = () => { }
    async getRejectedAppointments() {
        this.setState({ loading: true, feedback: "Getting appointments.." })
        let appointments = []
        //loop thru agents

        for (let a in this.state.agent.appointments) {

            if (this.state.agent.appointments[a].isRejected === false) {

                continue;
            }
            appointments.push(this.state.agent.appointments[a])
        }
        this.setState({ feedback: "Sorting appointments by date.." })
        await appointments.sort((a, b) => {
            if (a.appointment_date > b.appointment_date)
                return 1;
            if (a.appointment_date < b.appointment_date)
                return -1;
            return 0;
        })

        this.setState({ rejectedAppointments: appointments, loading: false, feedback: "Loading.." })
    }
    generateInternalMessage(app) {

        let message = `${app.dealership_name}\n`
        message += `${app.customer_firstname} ${app.customer_lastname}\n`
        message += `(${app.customer_phone.substring(0, 3)}) ${app.customer_phone.substring(3, 6)} - ${app.customer_phone.substring(6, 10)}\n`
        let tempDate = new Date(app.appointment_date)
        message += tempDate.toLocaleDateString() + " " + tempDate.toLocaleString([], { hour: '2-digit', minute: '2-digit' }) + "\n"
        message += app.dealership_scenario + "\n"
        message += app.dealership_source != null && app.dealership_source.length > 0 && app.dealership_source !== "None" ? `Source: ${app.dealership_source}\n` : ""
        message += `${app.dealership_department}`
        return message

    }
    generateCustomerMessage(app) {

        let message = `Hi ${app.customer_firstname}, `
        message += `I scheduled your VIP appointment at ${app.dealership_name} for `
        let tempDate = new Date(app.appointment_date)
        message += tempDate.toLocaleDateString() + " @ " + tempDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ". "
        message += "We are excited to assist you! Please ask for the VIP manager at the receptionist desk."
        return message

    }
    async resendAppointment() {
        this.setState({ loading: true })

        let old = JSON.parse(JSON.stringify(this.state.rejectedAppointments[this.state.index]))
        // console.log(old)
        let new_app = {
            customer_firstname: this.state.fixed_customer_first_name,
            customer_lastname: this.state.fixed_customer_last_name,
            customer_phone: this.state.fixed_customer_phone,
            appointment_date: this.state.fixed_date,
            dealership_name: this.state.fixed_dealership.label,
            dealership_department: this.state.fixed_department.label,
            dealership_scenario: this.state.fixed_scenario.label,
            dealership_source: this.state.fixed_source.label,
            isRejected: false,
            isPending: true,
            rejectedReason: "",
            created: new Date(),

        }

        //find current agent's appointment that needs to be updated
        let x = this.state.agent.appointments.filter((a) => {
            return new Date(a.created).getTime() != new Date(old.created).getTime()

        })
        new_app = Object.assign(old, new_app)
        new_app.internal_msg = this.generateInternalMessage(new_app)
        new_app.customer_msg = this.generateCustomerMessage(new_app)
        this.setState({ fixed_internal_msg: new_app.internal_msg, fixed_customer_msg: new_app.customer_msg })
        x.push(new_app)
        let a = this.state.agent
        a.appointments = x
        // console.log(a)
        let asdf = await this.state.agents.findOneAndUpdate({ email: this.state.agent.email }, a)
        await this.getRejectedAppointments()
        this.setState({ loading: false })
        //    console.log("done!")
        //    console.log(asdf)

    }

    render() {
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
                                                        onClick={(e) => { e.preventDefault(); this.collapsesToggle(app.agent_name + "_" + index, app) }}
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
                                                        <h3>Revise Appointment Info:</h3><br />
                                                        <Row>

                                                            <Col sm="6">
                                                                <Label  >Customer First Name</Label>
                                                                <Input placeholder="Customer First Name" value={this.state.fixed_customer_first_name} onChange={(e) => { this.setState({ fixed_customer_first_name: e.target.value }) }}></Input>
                                                                <br />
                                                                <Label  >Cutomer Last Name: </Label>
                                                                <Input placeholder="Customer Last Name" value={this.state.fixed_customer_last_name} onChange={(e) => { this.setState({ fixed_customer_last_name: e.target.value }) }}></Input>
                                                                <br />

                                                                <Label  >Cutomer Phone: </Label>
                                                                <Input type="tel" placeholder="Customer Phone" value={this.state.fixed_customer_phone} onChange={(e) => { this.setState({ fixed_customer_phone: e.target.value }) }}></Input>
                                                                <br />

                                                                <Label  >Appointment Date/Time: </Label>

                                                                <ReactDatetime
                                                                    isValidDate = {(current) => {
                                                                        let x = new Date(current);
                                                                        let now = new Date()
                                                                        let nowAnd3Days = new Date(now.getTime() + (4* 24*60*60*1000))
                                                                        return x < nowAnd3Days && x > now 
                                                                      }}
                                                                      timeConstraints={{ hours: { min: 9, max: 18, step: 1 }, minutes: { step: 15 } }}
                                                                    inputProps={{
                                                                        className: "form-control primary",
                                                                        placeholder: "Appointment date/time",
                                                                        name: "date"
                                                                    }}
                                                                    value={this.state.fixed_date}
                                                                    onChange={(value) => {
                                                                        this.setState({ fixed_date: new Date(value) })
                                                                    }
                                                                    }
                                                                    className="primary"
                                                                />
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
                                                                    onChange={value => { this.setState({ fixed_dealership: value }) }}
                                                                    options={this.state.dealerships}
                                                                    placeholder="Dealership"
                                                                /><br />

                                                                <Label>Department</Label>

                                                                <Select
                                                                    className="react-select primary"
                                                                    // className={classnames(this.state.firstnameState) primary}
                                                                    classNamePrefix="react-select"
                                                                    name="dealership"
                                                                    value={this.state.fixed_department}
                                                                    onChange={value => {  this.setState({ fixed_department: value }) }}
                                                                    options={this.state.departments}
                                                                    placeholder="Department"
                                                                /><br />
                                                                <Label>Scenario</Label>
                                                                <Select
                                                                    className="react-select primary"
                                                                    classNamePrefix="react-select"
                                                                    name="scenarios"
                                                                    value={this.state.fixed_scenario}
                                                                    onChange={value => this.setState({ fixed_scenario: value })}
                                                                    options={this.state.scenarios}
                                                                    placeholder="Scenario"
                                                                /><br />
                                                                <Label>Source</Label>
                                                                <Select
                                                                    className="react-select primary"
                                                                    classNamePrefix="react-select"
                                                                    name="source"
                                                                    value={this.state.fixed_source}
                                                                    onChange={value => this.setState({ fixed_source: value })}
                                                                    options={this.state.sources}
                                                                    placeholder="Source (optional)"
                                                                />

                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col sm="12">
                                                                <Button color="success" className="float-right" disabled={
                                                                    !this.isValidDate(this.state.fixed_date) ||
                                                                    this.state.loading ||
                                                                    this.state.fixed_customer_first_name.length === 0 ||
                                                                    this.state.fixed_customer_last_name.length === 0 ||
                                                                    this.state.fixed_customer_phone.length != 10 ||
                                                                    isNaN(this.state.fixed_customer_phone) ||
                                                                    this.state.fixed_dealership.length === 0 ||
                                                                    this.state.fixed_department.length === 0 ||
                                                                    this.state.fixed_scenario.length === 0 ||
                                                                    this.state.fixed_date.length == 0} onClick={() => {
                                                                        this.resendAppointment()
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
                            <h2 hidden={this.state.rejectedAppointments.length > 0 || this.state.loading}>None of your pending appointments are rejected.</h2>
                        </div>
                    </Col>
                </div>
            </>
        );
    }
}

export default Rejected;
