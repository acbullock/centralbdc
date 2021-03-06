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
import { Col } from "reactstrap";

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
            dealerships: [],
            token: ""
        };

    }
    async componentWillMount() {
        // let dealerships = await this.props.mongo.getCollection("dealerships")
        // let dealers = await dealerships.find({}).toArray().catch((err)=>console.log(err))
        let dealers = await this.props.mongo.find("dealerships")
        await this.setState({ dealerships: dealers })
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
        let appointment_date = new Date(data.appointment.date).toISOString()
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

        let agent = this.props.agent

        let new_app = {
            isPending: true,
            isRejected: false,
            created: new Date().toISOString(),
            appointment_date: appointment.appointment_date,
            customer_firstname: customer_first_name,
            customer_lastname: customer_last_name,
            customer_phone: customer_phone,
            dealership: data.appointment.dealership.value,
            dealership_source: appointment.appointment_source,
            dealership_department: appointment.appointment_department,
            dealership_scenario: appointment.appointment_scenario,
            internal_msg: messages.internal_message,
            customer_msg: messages.customer_message,
            agent_id: agent._id
        }

        //hotfix!!
        await this.acceptAppointment(new_app)


        await this.setState({ loading: false })
        await this.props.history.push("/admin/dashboard")



    }
    makeTitleCase(name) {
        let title = name
        title = title.toLowerCase().split(' ')
        for (var i = 0; i < title.length; i++) {
            if (title[i].length < 1) continue;
            title[i] = title[i][0].toUpperCase() + title[i].slice(1);
        }
        title = title.join(" ")
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
            message += data.appointment.department.label !== "Service" ? `${data.appointment.department.label}` : "Service"
            return message
        }
    }
    generateCustomerMessage(data) {
        if (data.customer === undefined || data.appointment === undefined) return
        else {
            let message = `Hi ${this.makeTitleCase(data.customer.firstname)}, `
            if (data.appointment.department.label === "Service") {
                message += `I scheduled your Service appointment at ${data.appointment.dealership.label} located at ${data.appointment.dealership.address}. `
            }
            else {
                message += `I scheduled your VIP appointment at ${data.appointment.dealership.label} located at ${data.appointment.dealership.address} for `
            }
            let tempDate = new Date(data.appointment.date)
            message += tempDate.toLocaleDateString() + " @ " + tempDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ". "
            message += data.appointment.department.label !== "Service" ? "We are excited to assist you! Please ask for the VIP manager at the receptionist desk." : "We are excited to assist you!"
            return message
        }
    }

    //HOT FIX
    async acceptAppointment(appointment) {
        //update appointment to be ispending false, verified is now
        let dealershipIndex = await this.state.dealerships.findIndex((d) => { return d.value === appointment.dealership })
        let dealership = this.state.dealerships[dealershipIndex]
        this.setState({ loading: true })
        let new_app = appointment;
        new_app.isPending = false;
        new_app.verified = new Date().toISOString()
        // let agents = await this.props.mongo.getCollection("agents")
        // let agent = await agents.findOne({ _id: appointment.agent_id })
        // await agents.findOneAndReplace({ _id: appointment.agent_id }, agent)
        // await this.getPendingAppointments()
        await this.sendText(appointment)
        if (dealership.label !== "West Palm Beach Nissan" && appointment.dealership_scenario.indexOf("Home Delivery") === -1)
            await this.sendCustText(appointment)
        await this.props.mongo.insertOne("all_appointments", new_app)
        this.setState({ loading: false })
    }
    async sendText(appointment) {
        this.setState({ loading: true })
        let dealershipIndex = await this.state.dealerships.findIndex((d) => { return d.value === appointment.dealership })
        let dealership = this.state.dealerships[dealershipIndex]
        let contacts = appointment.dealership_department === "Service" ? dealership.serviceContacts : dealership.contacts
        let textFrom = appointment.dealership_department === "Service" ? dealership.serviceTextFrom : dealership.textFrom
        let arr = []
        let used_arr = []
        let token = await this.props.mongo.getToken()
        let USED_DEALERS = [
            "Acura of Brooklyn",
            "Plaza Honda",
            "Plaza Hyundai",
            "Plaza Kia",
            "Plaza Toyota",
            "Aaaa Test"
        ]
        let USED_CONTACTS = [
            "3474142585",
            "6465490627",
            "5163294629",
            "3475769827",
            // "9548646379"
        ]
        let SERVICE_TO_SALES_CONTACTS = [
            "3472656027",
            // "9548646379"
        ]
        await this.setState({ token: token })
        for (let c in contacts) {
            arr = []
            arr.push(contacts[c])
            this.props.mongo.sendGroupText("1" + textFrom, appointment.internal_msg, arr, token)
        }
        //generate new token?
        if (USED_DEALERS.indexOf(dealership.label) != -1) {
            if (appointment.dealership_scenario.toLowerCase().indexOf("used") != -1) {
                for (let u in USED_CONTACTS) {
                    used_arr = []
                    used_arr.push(USED_CONTACTS[u])
                    this.props.mongo.sendGroupText("1" + textFrom, appointment.internal_msg, used_arr, token)
                }
            }
            if (appointment.dealership_department == "Service to Sales") {
                for (let u in SERVICE_TO_SALES_CONTACTS) {
                    used_arr = []
                    used_arr.push(SERVICE_TO_SALES_CONTACTS[u])
                    this.props.mongo.sendGroupText("1" + textFrom, appointment.internal_msg, used_arr, token)
                }
            }
            else {
                console.log(appointment.dealership_department)
            }
        }

        this.setState({ loading: false })

    }
    async sendCustText(appointment) {
        let dealershipIndex = await this.state.dealerships.findIndex((d) => { return d.value === appointment.dealership })
        let dealership = this.state.dealerships[dealershipIndex]
        if (appointment.dealership === "5deaa83728eac700174a760a" && appointment.dealership_department === "Service to Sales") return;
        this.setState({ loading: true })
        let textFrom = appointment.dealership_department === "Service" ? dealership.serviceTextFrom : dealership.textFrom
        let to = []
        to.push(appointment.customer_phone)
        // let token = await this.props.mongo.getToken()
        this.props.mongo.sendGroupText("1" + textFrom, appointment.customer_msg, to, this.state.token)
        this.setState({ loading: false })
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
                            wizardData={{ mongo: this.props.mongo }}

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
