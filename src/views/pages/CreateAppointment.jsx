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

    finished = async (data) => {
        let internal_message = this.generateInternalMessage(data)
        let customer_message = this.generateCustomerMessage(data)
        let messages = {
            internal_message,
            customer_message
        }
        let customer_first_name = data.customer.firstname
        let customer_last_name = data.customer.lastname
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
        let agents = await this.props.mongo.getCollection("agents")
        let agent = await agents.findOne({userId: user.userId})
        
        let agentAppts = [];
        agent.appointments != undefined ? agentAppts = agent.appointments : agentAppts = []
        console.log(agentAppts)
        let new_app = {
            isPending: true,
            isRejected: false,
            created: new Date(),
            appointment_date: appointment.appointment_date,
            customer_firstname: customer_first_name,
            customer_lastname: customer_last_name,
            customer_phone: customer_phone,
            dealership_name: appointment.appointment_dealership,
            //fix this later to come from db
            dealership_phone: "9548646379",
            internal_msg: messages.internal_message,
            customer_msg: messages.customer_message
        }
        agentAppts.push(new_app)
        agent.appointments = agentAppts
        console.log("***********")
        await agents.findOneAndUpdate({userId: user.userId}, agent)
        
        console.log("***********")

    }
    generateInternalMessage(data) {
        if (data.customer == undefined || data.appointment == undefined) return
        else {
            let message = `${data.appointment.dealership.label}\n`
            message += `${data.customer.firstname} ${data.customer.lastname}\n`
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
            let message = `Hi ${data.customer.firstname}, `
            message += `I scheduled your VIP appointment at ${data.appointment.dealership.label} for `
            let tempDate = new Date(data.appointment.date)
            message += tempDate.toLocaleDateString() + " @ " + tempDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ". "
            message += "We are excited to assist you! Please ask for the VIP manager at the receptionist desk."
            return message
        }
    }
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
                            finishButtonClasses="btn-wd btn-info"
                            nextButtonClasses="btn-wd btn-info"
                            previousButtonClasses="btn-wd"
                            progressbar
                            color="primary"
                            finishButtonClick={(e) => this.finished(e)}

                        />
                    </Col>
                </div>
            </>
        );
    }
}

export default CreateAppointment;
