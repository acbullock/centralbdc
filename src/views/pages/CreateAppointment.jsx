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
import { Col} from "reactstrap";

// wizard steps
import Step1 from "../forms/WizardSteps/Step1.jsx";
import Step2 from "../forms/WizardSteps/Step2.jsx";
import Step3 from "../forms/WizardSteps/Step3.jsx";
import axios from 'axios'
var steps = [
    {
        stepName: "customer",
        stepIcon: "tim-icons icon-single-02",
        component: Step1
    },
    {
        stepName: "appointment",
        stepIcon: "tim-icons icon-settings-gear-63",
        component: Step2
    },
    {
        stepName: "review",
        stepIcon: "tim-icons icon-check-2",
        component: Step3
    }
];

class CreateAppointment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            dealerships: []
        };

    }
    async componentWillMount(){
        // let dealerships = await this.props.mongo.getCollection("dealerships")
        // let dealers = await dealerships.find({}).toArray().catch((err)=>console.log(err))
        let dealers = await this.props.mongo.find("dealerships")
        await this.setState({dealerships: dealers})
    }
    finished = async (data) => {
        this.setState({ loading: true })
        

        let internal_message = this.generateInternalMessage(data)
        let customer_message = this.generateCustomerMessage(data)
        let messages = {
            internal_message,
            customer_message
        }
        let customer_first_name = this.makeTitleCase(data.customer.firstname)
        let customer_last_name = this.makeTitleCase(data.customer.lastname)
        let customer_phone = data.customer.phone
        let customer = {
            customer_first_name,
            customer_last_name,
            customer_phone
        }
        let appointment_date = data.appointment.date
        let appointment_dealership = data.appointment.dealership.label
        let appointment_department = data.appointment.department.label
        let appointment_scenario = data.appointment.scenario.label
        let appointment_source = data.appointment.source ? data.appointment.source.label : "None"
        let appointment = {
            appointment_date,
            appointment_dealership,
            appointment_department,
            appointment_scenario,
            appointment_source
        }

        let user = await this.props.mongo.getActiveUser(this.props.mongo.mongodb)
        // let agents = await this.props.mongo.getCollection("agents")
        // let agent = await agents.findOne({ userId: user.userId })
        let agent = await this.props.mongo.findOne("agents", {userId: user.userId})

        let agentAppts = [];
        agent.appointments != undefined ? agentAppts = agent.appointments : agentAppts = []
        let new_app = {
            isPending: true,
            isRejected: false,
            created: new Date(),
            appointment_date: appointment.appointment_date,
            customer_firstname: customer_first_name,
            customer_lastname: customer_last_name,
            customer_phone: customer_phone,
            dealership: data.appointment.dealership,
            dealership_source: appointment.appointment_source,
            dealership_department: appointment.appointment_department,
            dealership_scenario: appointment.appointment_scenario,
            internal_msg: messages.internal_message,
            customer_msg: messages.customer_message,
            agent_id: agent._id
        }
        agentAppts.push(new_app)
        agent.appointments = agentAppts
        // await agents.findOneAndUpdate({ userId: user.userId }, agent)
        await this.props.mongo.findOneAndUpdate("agents", {userId: user.userId}, {appointments: agent.appointments})
        
        //hotfix!!
        await this.acceptAppointment(new_app)


        await this.setState({ loading: false })
        await this.props.history.push("/admin/dashboard")



    }
    makeTitleCase(name){
        let title = name
        title = title.toLowerCase().split(' ')
        for(var i = 0; i< title.length; i++){
            if(title[i].length < 1) continue;
            title[i] = title[i][0].toUpperCase() + title[i].slice(1);
         }
         title  = title.join(" ")
         return title
    }
    generateInternalMessage(data) {
        if (data.customer == undefined || data.appointment == undefined) return
        else {
            let message = `${data.appointment.dealership.label}\n`
            message += `${this.makeTitleCase(data.customer.firstname)} ${this.makeTitleCase(data.customer.lastname)}\n`
            message += `(${data.customer.phone.substring(0, 3)}) ${data.customer.phone.substring(3, 6)} - ${data.customer.phone.substring(6, 10)}\n`
            let tempDate = new Date(data.appointment.date)
            message += tempDate.toLocaleDateString() + " " + tempDate.toLocaleString([], { hour: '2-digit', minute: '2-digit' }) + "\n"
            message += data.appointment.scenario.label + "\n"
            message += data.appointment.source != null && data.appointment.source.label.length > 0 && data.appointment.source.label !== "None" ? `Source: ${data.appointment.source.label}\n` : ""
            message += `${data.appointment.department.label}`
            return message
        }
    }
    generateCustomerMessage(data) {
        if (data.customer === undefined || data.appointment === undefined) return
        else {
            let message = `Hi ${this.makeTitleCase(data.customer.firstname)}, `
            message += `I scheduled your VIP appointment at ${data.appointment.dealership.label} located at ${data.appointment.dealership.address} for `
            let tempDate = new Date(data.appointment.date)
            message += tempDate.toLocaleDateString() + " @ " + tempDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ". "
            message += "We are excited to assist you! Please ask for the VIP manager at the receptionist desk."
            return message
        }
    }

    //HOT FIX
    async acceptAppointment(appointment) {
        //update appointment to be ispending false, verified is now
        this.setState({ loading: true })
        let new_app = appointment;
        new_app.isPending = false;
        new_app.verified = new Date()
        // let agents = await this.props.mongo.getCollection("agents")
        // let agent = await agents.findOne({ _id: appointment.agent_id })
        let agent = await this.props.mongo.findOne("agents", {_id: appointment.agent_id})

        let apps = await agent.appointments.filter((a) => {
            return new Date(a.created).getTime() !== new Date(appointment.created).getTime();

        })

        agent.appointments = apps
        // agent.appointments = x
        agent.appointments.push(new_app)
        // await agents.findOneAndReplace({ _id: appointment.agent_id }, agent)
        await this.props.mongo.findOneAndUpdate("agents", {_id: appointment.agent_id}, {appointments: agent.appointments})
        // await this.getPendingAppointments()
        await this.sendText(appointment)
        if(appointment.dealership.label !== "West Palm Beach Nissan")
            await this.sendCustText(appointment)
        this.setState({ loading: false })
    }
    async sendText(appointment) {
        this.setState({loading: true})
        let contacts = appointment.dealership.contacts
        for(let c in contacts){
            contacts[c] = "1" + contacts[c]
        }
        this.props.mongo.sendGroupText("1"+appointment.dealership.textFrom, appointment.internal_msg, contacts)
        
        this.setState({loading: false})
        
    }
    async sendCustText(appointment) {
        this.setState({loading: true})
        let to = []
        to.push("1"+appointment.customer_phone)
        this.props.mongo.sendGroupText("1"+appointment.dealership.textFrom, appointment.customer_msg, to)
        this.setState({loading:false})
    }
    //HOT FIX



    render() {
        return (
            <>
                <div className="content">
                    <Col className="mr-auto ml-auto" md="10">
                        <ReactWizard
                            
                            steps={steps}
                            navSteps
                            validate
                            title="Create New Appointment"
                            description="All new appointments require approval"
                            headerTextCenter
                            finishButtonClasses={this.state.loading ? "btn-wd btn-info disabled" : "btn-wd btn-info"}
                            nextButtonClasses="btn-wd btn-info"
                            previousButtonClasses={this.state.loading ? "btn-wd disabled" : "btn-wd"}
                            progressbar
                            color="primary"
                            finishButtonClick={(e) => this.finished(e)}
                            wizardData={{mongo: this.props.mongo}}

                        />
                    </Col>
                    <Col className="mr-auto ml-auto" md="10">
                    </Col>
                </div>
            </>
        );
    }
}

export default CreateAppointment;
