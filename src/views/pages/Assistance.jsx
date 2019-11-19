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
    // Collapse,
    Form,
    // FormGroup,
    // CardText,
    Button,
    Input,
    Label,

} from "reactstrap";
import Select from "react-select"
// wizard steps
import axios from 'axios'


class Assistance extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            phone: "",
            dealership: {
                label: ""
            },
            source: {
                label: ""
            },
            message: "",
            dealerships: [],
            sources: [],
            text: "",
            loading: false
        };
        this.makeAssistanceMessage = this.makeAssistanceMessage.bind(this)
        this.addToPending = this.addToPending.bind(this)
    }
    async componentWillMount(){
        let d = await this.props.mongo.getCollection("dealerships")
        let s = await this.props.mongo.getCollection("sources")
        d = await d.find({}).toArray()
        s = await  s.find({}).toArray()
        d.sort((a,b)=>{
            if(a.label < b.label) return -1;
            if(a.label > b.label) return 1;
            return 0
        })
        s.sort((a,b)=>{
            if(a.label < b.label) return -1;
            if(a.label > b.label) return 1;
            return 0
        })
        this.setState({dealerships: d, sources: s})
    }
    async addToPending(e){
        e.preventDefault()
        this.setState({loading: true})
        //get active user..
        let user = await this.props.mongo.getActiveUser(this.props.mongo.mongodb)
        let agents = await this.props.mongo.getCollection("agents");
        let activeAgent = await agents.findOne({userId: user.userId})
        let newAssistanceArray = activeAgent.assistance
        
        let newAssistanceObject = {
            isPending: true,
            isRejected: false,
            userId: user.userId,
            customer_firstname: this.state.firstName,
            customer_lastname: this.state.lastName,
            customer_phone: this.state.phone,
            dealership: this.state.dealership,
            source: this.state.source,
            message: this.state.message,
            text: this.state.text,
            created: new Date()
        }
        newAssistanceArray.push(newAssistanceObject)
        activeAgent.assistance = newAssistanceArray
        await agents.findOneAndUpdate({userId: user.userId}, activeAgent)

        await this.setState({
            loading: false,
            firstName: "",
            lastName: "",
            phone: "",
            dealership: {},
            source: {},
            message: "",
            text: ""})

        //get their assistance array..
        //build new assistance object
        //add it to their assistance array
        //inset updated record to db 
    }
    async makeAssistanceMessage(){
        let message = "CUSTOMER NEEDS ASSISTANCE\n"
        message += `${this.state.dealership.label}\n${this.state.firstName} ${this.state.lastName}\n`
        message += `${this.state.phone}\n${this.state.message}\n`
        message += `Source: ${this.state.source.label}`
        
        this.setState({text: message})
    }
    async sendText(appointment) {
        this.setState({ loading: true })
        let data = new FormData();
        // await this.setState({loading: true})
        let contacts = appointment.dealership.contacts
        let token = await axios.post("https://webhooks.mongodb-stitch.com/api/client/v2.0/app/centralbdc-bwpmi/service/RingCentral/incoming_webhook/gettoken", {}, {})
        token = token.data
        for (let i = 0; i < contacts.length; i++) {
            let x = await axios.post(`https://webhooks.mongodb-stitch.com/api/client/v2.0/app/centralbdc-bwpmi/service/RingCentral/incoming_webhook/sendsms?toNumber=1${contacts[i]}&fromNumber=1${appointment.dealership.textFrom}&token=${token}`, {
                text: appointment.internal_msg
            }, {
                headers: {
                    "Content-Type": "application/json",
                }
            })
        }

        this.setState({ loading: false })

    }
    render() {
        return (
            <>
                <div className="content">
                    <Col className="mr-auto ml-auto" md="10">
                        <Card className="card-info">
                            <CardHeader>
                                <h1>Customer Needs Assistance</h1>
                            </CardHeader>
                            <CardBody>

                                <Form>
                                <Label>
                                        Dealership
                                    </Label>
                                    <Select
                                        placeholder="Dealership"
                                        options={this.state.dealerships}
                                        onChange={async (e)=>{ await this.setState({dealership: e}); this.makeAssistanceMessage()}}
                                    /><br/>
                                    <Label>
                                        Customer First Name
                                    </Label>
                                    <Input
                                        placeholder="Customer First Name"
                                        value = {this.state.firstName}
                                        onChange={async (e)=>{await this.setState({firstName: e.target.value}); this.makeAssistanceMessage()}}
                                    />
                                    <Label>
                                        Customer Last Name
                                    </Label>
                                    <Input
                                        placeholder="Customer Last Name"
                                        value = {this.state.lastName}
                                        onChange={async (e)=>{await this.setState({lastName: e.target.value}); this.makeAssistanceMessage()}}
                                    />
                                    <Label>
                                        Customer Phone Number
                                    </Label>
                                    <Input
                                        placeholder="Customer Phone Number"
                                        value = {this.state.phone}
                                        onChange={async (e)=>{await this.setState({phone: e.target.value}); this.makeAssistanceMessage()}}
                                    />
                                     
                                    <Label>
                                        Source
                                    </Label>
                                    <Select
                                        placeholder="Source"
                                        options={this.state.sources}
                                        onChange={async (e)=>{ await this.setState({source: e}); this.makeAssistanceMessage()}}
                                    /><br/>
                                    <Label for="message">Message</Label>
                                    <Input 
                                        placeholder="Message/notes"
                                        type="textarea"
                                        name="text"
                                        id="message"
                                        style={{height: "500px", whiteSpace: "pre-wrap"}}
                                        value={this.state.message}
                                        onChange={async (e)=> {await this.setState({message: e.target.value}); this.makeAssistanceMessage()}}
                                    />
                                    <hr/>
                                    <Card lg="6">
                                        <CardHeader>Review Message:</CardHeader>
                                        <CardBody style={{whiteSpace: "pre-wrap"}}>
                                            
                                            {this.state.text}
                                        </CardBody>
                                    </Card>
                                    <Button
                                        disabled={
                                            this.state.loading ||
                                            this.state.firstName.length == 0 ||
                                            this.state.lastName.length == 0 ||
                                            this.state.phone.length != 10 ||
                                            isNaN(this.state.phone) ||
                                            this.state.dealership.label.length == 0 ||
                                            this.state.source.label.length == 0 ||
                                            this.state.message.length == 0
                                        }
                                        onClick={this.addToPending}
                                    >
                                        Send Message to Dealership
                                    </Button>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </div>
            </>
        );
    }
}

export default Assistance;
