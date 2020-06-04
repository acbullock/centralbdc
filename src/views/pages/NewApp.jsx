import React from "react";
import ReactWizard from 'react-bootstrap-wizard';
import "../../assets/css/wizard.css"
// reactstrap components
import {
    Button,
    Card,
    CardImg,
    Container,
    CardBody,
    CardHeader,
    Row,
    Col,
    Table,
    Modal,
    ModalHeader,
    ModalBody,
    Form,
    Input

} from "reactstrap";
// wizard steps
import NewStep1 from "../forms/WizardSteps/NewStep1.jsx";
import NewStep2 from "../forms/WizardSteps/NewStep2.jsx";
import NewStep3 from "../forms/WizardSteps/NewStep3.jsx";
import NewStep4 from "../forms/WizardSteps/NewStep4.jsx";



import Select from 'react-select'

class NewApp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            selected_sales_agent: null,
            departments: [],
            buckets: [],
            rooftops: {},
            rooftop_history: {},
            open_roofs: [], //for override,
            selected_change: null, //for override,
            changeRooftopModal: false,//for override,
            selected_new_rooftop: null, //for  override,
            internal_message: "",
            customer_message: "",
            steps: [{
                stepName: "customer",
                stepIcon: "tim-icons icon-single-02",
                // stepIcon: "",
                component: NewStep1
            },
            {
                stepName: "appointment",
                stepIcon: "tim-icons icon-settings-gear-63",
                // stepIcon: "",
                component: NewStep2
            }]

        }
        this._isMounted = false
    }
    async componentWillMount() {
        this._isMounted = true
    }

    async componentDidMount() {
        this._isMounted && await this.setState({ loading: true })
        let steps = this.state.steps

        if (this.props.agent.department === "sales") {
            steps.push({
                stepName: "additional info",
                stepIcon: "tim-icons icon-single-copy-04",
                // stepIcon: "",
                component: NewStep3
            })
        }
        steps.push({
            stepName: "review",
            stepIcon: "tim-icons icon-check-2",
            component: NewStep4
        })


        this._isMounted && await this.setState({ loading: false, steps })
    }
    async finished(data) {
        this.setState({ loading: true })
        //get used dealers.
        let USED_DEALERS = [
            "Acura of Brooklyn",
            "Plaza Honda",
            "Plaza Hyundai",
            "Plaza Kia",
            "Plaza Toyota",
            "Admin"
        ];
        //get used contacts.
        let USED_CONTACTS = [
            "3474142585",
            "6465490627",
            "5163294629",
            "3475769827",
            // "9548646379"
        ]
        //get s2s contacts.
        let SERVICE_TO_SALES_CONTACTS = [
            "3472656027",
            // "9548646379"
        ]
        //get data based on dept
        let contacts = data.appointment.selected_department.label === "Service" ? data.appointment.selected_dealership.serviceContacts : data.appointment.selected_dealership.contacts
        let textFrom = data.appointment.selected_department.label === "Service" ? `1${data.appointment.selected_dealership.serviceTextFrom}` : `1${data.appointment.selected_dealership.textFrom}`
        //send internal text to each contact..
        for (let number in contacts) {
            let token = await data.mongo.getToken()
            data.mongo.sendGroupText(textFrom, this.generateInternalMessage(data), contacts[number], token)
        }
        //if its a used dealer,
        if (USED_DEALERS.indexOf(data.appointment.selected_dealership.label) !== -1) {
            // if it is as used scenario..,
            if (data.appointment.selected_scenario.label.toLowerCase().indexOf("used") !== -1) {
                //send to used contacts..
                for (let number in USED_CONTACTS) {
                    let token = await data.mongo.getToken()
                    data.mongo.sendGroupText(textFrom, this.generateInternalMessage(data), USED_CONTACTS[number], token)
                }
            }
            //if its a service to sales department,
            if (data.appointment.selected_department.label === "Service to Sales") {
                //send to s2s contacts
                for (let number in SERVICE_TO_SALES_CONTACTS) {
                    let token = await data.mongo.getToken()
                    data.mongo.sendGroupText(textFrom, this.generateInternalMessage(data), SERVICE_TO_SALES_CONTACTS[number], token)
                }
            }

        }
        let sendCust = true;
        //make sure not WPB Nissan ,    or home delivery, or (paragonhonda && s2s)
        if (data.appointment.selected_dealership.label === "West Palm Beach Nissan" || data.appointment.selected_dealership.label === "Plaza Hyundai" || data.appointment.selected_dealership.label === "Plaza Kia" || data.appointment.selected_dealership.label === "Plaza Toyota" || data.appointment.selected_dealership.label === "Plaza Honda") {
            sendCust = false;
        }
        if (data.appointment.selected_dealership.label === "Major World Chevrolet" || data.appointment.selected_dealership.label === "Major World Chrysler Dodge Jeep Ram" || data.appointment.selected_dealership.label === "Major World Used Superstore" ){
            sendCust = false
        }
        if (data.appointment.selected_scenario.label.toLowerCase().indexOf("home delivery") !== -1) {
            sendCust = false;
        }
        if (data.appointment.selected_dealership.label === "Paragon Honda" && data.appointment.selected_department.label === "Service to Sales") {
            sendCust = false;
        }
        //send cust text.
        if (sendCust === true) {
            let token = await data.mongo.getToken()
            if (data.review.convertLanguage === "Spanish")
                data.mongo.sendGroupText(textFrom, this.generateCustomerMessage(data), data.customer.phone, token)
            else
                data.mongo.sendGroupText(textFrom, this.generateSpanishMessage(data), data.customer.phone, token)
        }
        let createdTime = new Date().toISOString()
        //add to all_apps
        let new_appointment = {
            isPending: false,
            isRejected: false,
            created: createdTime,
            appointment_date: new Date(data.appointment.appointment_date).toISOString(),
            customer_firstname: data.customer.firstname,
            customer_lastname: data.customer.lastname,
            customer_phone: data.customer.phone,
            dealership: data.appointment.selected_dealership.value,
            dealership_source: !data.appointment.selected_source ? "None" : data.appointment.selected_source.label,
            dealership_department: data.appointment.selected_department.label,
            dealership_scenario: data.appointment.selected_scenario.label,
            internal_msg: this.generateInternalMessage(data),
            customer_msg: this.generateCustomerMessage(data),
            agent_id: this.props.agent._id,
            verified: createdTime

        }
        await data.mongo.insertOne("all_appointments", new_appointment)



        //go to dashboard..
        await this.setState({ loading: false })
        this._isMounted = false
        await this.props.history.push("/admin/dashboard")
    }
    formatPhoneNumber(number) {
        let ret = `(${number.toString().substring(0, 3)}) ${number.toString().substring(3, 6)} - ${number.toString().substring(6, 10)} `
        return ret;
    }
    generateInternalMessage(data) {
        if (!data) return ""
        if (!data.customer || !data.appointment) return "";
        if (data.agent.department === "sales" && !data["additional info"]) return ""
        let internal_message = `${data.appointment.selected_dealership.label} \n`;
        internal_message += `${data.utils.toTitleCase(data.customer.firstname)} ${data.utils.toTitleCase(data.customer.lastname)} \n${data.formatPhoneNumber(data.customer.phone)} \n`
        internal_message += `${new Date(data.appointment.appointment_date).toLocaleDateString()} ${new Date(data.appointment.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} \n`
        internal_message += `${data.appointment.selected_scenario.label} \n`
        internal_message += `${data.appointment.selected_department.label} \n`
        if (data.appointment.selected_source) {
            internal_message += `Source: ${data.appointment.selected_source.label} \n\n`
        }
        if (data.agent.department === "service") {
            return internal_message
        }
        internal_message += `Customer Interest -  ${data.utils.toTitleCase(data["additional info"].condition)} `
        internal_message += `${data["additional info"].selected_year.label} ${data["additional info"].selected_make.label} ${data["additional info"].selected_model.label} `
        internal_message += `with ${data["additional info"].exterior.toLowerCase()} exterior and ${data["additional info"].interior.toLowerCase()} interior.\n\n`
        if (data["additional info"].tradeInfo === "none") {
            internal_message += "Trade-In - NONE\n"
        }
        else if (data["additional info"].tradeInfo === "tradeYmm") {
            internal_message += `Trade-In - ${data["additional info"].selected_trade_year.label} ${data["additional info"].selected_trade_make.label} ${data["additional info"].selected_trade_model.label} with ${data["additional info"].trade_mileage} miles.\n\n`
        }
        internal_message += `Payment Method - ${data.utils.toTitleCase(data["additional info"].financeMethod)} \n`
        return internal_message

    }
    generateCustomerMessage(data) {
        if (!data) return
        if (!data.customer || !data.appointment) return "";
        let customer_message = `Hi ${data.utils.toTitleCase(data.customer.firstname)}, I scheduled your ${data.agent.department === "service" ? "Service" : "VIP"} appointment at ${data.appointment.selected_dealership.label} located at ${data.appointment.selected_dealership.address} `;
        customer_message += `for ${new Date(data.appointment.appointment_date).toLocaleDateString()} ${new Date(data.appointment.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. We are excited to assist you!`
        if (data.agent.department !== "service") {
            customer_message += ' Please ask for the VIP manager at the receptionist desk.'
        }
        return customer_message
    }
    generateSpanishMessage(data) {
        if (!data) return
        if (!data.customer || !data.appointment) return "";
        let customer_message = `Hola ${data.utils.toTitleCase(data.customer.firstname)}, programé tu cita ${data.agent.department === "service" ? "de servicio" : "VIP"} en ${data.appointment.selected_dealership.label} ubicado en ${data.appointment.selected_dealership.address} `;
        customer_message += `para ${new Date(data.appointment.appointment_date).toLocaleDateString()} ${new Date(data.appointment.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Estamos encantados de ayudarte!`
        if (data.agent.department !== "service") {
            customer_message += ' Solicite el gerente VIP en el mostrador de recepción.'
        }
        return customer_message
    }
    componentWillUnmount() {
        this._isMounted = false
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
            <div className="content">
                <Container>
                    <Row>
                        <Col className="ml-auto mr-auto text-center" md="12">
                            <Card style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                {/* <Card color="primary"> */}
                                {/* <CardHeader>
                                    <h1 style={{ marginBottom: 0, textDecoration: "underline" }} className="text-white text-center">Create Appointment</h1>
                                </CardHeader> */}
                                <CardBody  >
                                    <ReactWizard
                                        steps={this.state.steps}
                                        navSteps
                                        validate
                                        title=""
                                        isValidated={true}
                                        headerTextCenter
                                        finishButtonClasses={this.state.loading ? "btn-wd btn-success disabled" : "btn-wd btn-lg btn-success"}
                                        nextButtonClasses="btn-wd btn-lg btn-primary"
                                        previousButtonClasses={this.state.loading ? "btn-wd disabled" : "btn-wd btn-lg btn-warning"}
                                        color="primary"
                                        finishButtonClick={(e) => this.finished(e)}
                                        wizardData={{
                                            agent: this.props.agent,
                                            mongo: this.props.mongo,
                                            utils: this.props.utils,
                                            internal_message: this.state.internal_message,
                                            customer_message: this.state.customer_message,
                                            convertLanguage: "Spanish",
                                            generateInternalMessage: this.generateInternalMessage,
                                            formatPhoneNumber: this.formatPhoneNumber,
                                            generateCustomerMessage: this.generateCustomerMessage,
                                            generateSpanishMessage: this.generateSpanishMessage
                                        }}
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div >
        );
    }
}

export default NewApp;