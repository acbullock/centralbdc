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
import ReactDatetime from "react-datetime";
// reactstrap components
import {
    Input,
    Form,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Row,
    Col,
    Container,
    FormGroup,
    CardImg,

} from "reactstrap";
import Select from "react-select"
class NewApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errorText: "",
            loading: false,
            dealerships: [],
            departments: [],
            scenarios: [],
            sources: [],
            selected_dealership: null,
            selected_department: null,
            selected_scenario: null,
            selected_source: null,
            appointment_date: new Date().setHours(new Date().getHours() + 1, 0, 0, 0)
        };
        this._isMounted = false
    }
    componentDidMount = async () => {
        this._isMounted = true
        this._isMounted && await this.setState({ loading: true })
        this._isMounted && await this.getDealerships()
        this._isMounted && await this.getDepartments()
        this._isMounted && await this.getSources()

        await this.props.wizardData.generateInternalMessage()
        await this.props.wizardData.generateCustomerMessage()

        this._isMounted && await this.setState({ loading: false })
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    updateErrorText = () => {
        let err = ""
        let apptTime = new Date(this.state.appointment_date).getTime()
        let apptDay = (new Date(this.state.appointment_date).getDay() + 6) % 7
        let hours = []
        let minDate = new Date(new Date()).setHours(new Date().getHours() - 3, new Date().getMinutes(), 0, 0)
        let maxDate = new Date(minDate).setDate(new Date(minDate).getDate() + 4)
        let apptDayWord = new Date(this.state.appointment_date).toLocaleDateString([], { weekday: 'long' })
        if (!this.state.selected_dealership) {
            err += `\nDealership is required.`
            this.setState({ errorText: err })
            return;
        }
        if (this.props.wizardData.agent.department === "sales") {
            hours = this.state.selected_dealership.salesHours
        }
        else if (this.props.wizardData.agent.department === "service") {
            hours = this.state.selected_dealership.serviceHours
        }

        if (!this.state.selected_department) {
            err += `\nDepartment is required.`
        }
        if (!this.state.selected_scenario) {
            err += `\nScenario is required.`
        }
        //see if it's closed that day..
        if (hours[apptDay].isClosed === true) {
            err += `\nDealership is closed on ${apptDayWord}s`
        }
        //see if it's in the past..
        if (new Date(this.state.appointment_date).getTime() < new Date(minDate).getTime()) {
            err += `\nAppointment can be no earlier than ${new Date(minDate).toLocaleString([], { weekday: "long", year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`
        }
        //see if appt is too far in future
        if (this.props.wizardData.agent.department === "sales") {
            if (new Date(this.state.appointment_date).getTime() > new Date(maxDate)) {
                err += `\nAppointment is too far in the future.`
            }
        }
        //see if appt not in biz hours
        let openhelp = hours[apptDay].open
        let open = new Date(apptTime).setHours(new Date(openhelp).getHours(), new Date(openhelp).getMinutes(), 0, 0)
        let closehelp = hours[apptDay].close
        let close = new Date(apptTime).setHours(new Date(closehelp).getHours(), new Date(closehelp).getMinutes() - 15, 0, 0)
        if (new Date(apptTime).getTime() < new Date(open).getTime() || new Date(apptTime).getTime() > new Date(close).getTime()) {
            err += `\nAppointment Time not within business hours for ${apptDayWord}`
        }
        this.setState({ errorText: err })
    }

    isValidated = () => {
        this._isMounted && this.updateErrorText()
        let err = ""
        let apptTime = new Date(this.state.appointment_date).getTime()
        let apptDay = (new Date(this.state.appointment_date).getDay() + 6) % 7
        let hours = []
        let minDate = new Date(new Date()).setHours(new Date().getHours() - 3, new Date().getMinutes(), 0, 0)
        let maxDate = new Date(minDate).setDate(new Date(minDate).getDate() + 4)
        let apptDayWord = new Date(this.state.appointment_date).toLocaleDateString([], { weekday: 'long' })
        if (!this.state.selected_dealership) {
            return false;
        }
        if (this.props.wizardData.agent.department === "sales") {
            hours = this.state.selected_dealership.salesHours
        }
        else if (this.props.wizardData.agent.department === "service") {
            hours = this.state.selected_dealership.serviceHours
        }
        if (!this.state.selected_department) {
            return false;
        }
        if (!this.state.selected_scenario) {
            return false;
        }
        //see if it's closed that day..
        if (hours[apptDay].isClosed === true) {
            return false
        }
        //see if it's in the past..
        if (new Date(this.state.appointment_date).getTime() < new Date(minDate).getTime()) {
            return false
        }
        //see if appt is too far in future
        if (this.props.wizardData.agent.department === "sales") {
            if (new Date(this.state.appointment_date).getTime() > new Date(maxDate)) {
                return false
            }
        }
        //see if appt not in biz hours
        let openhelp = hours[apptDay].open
        let open = new Date(apptTime).setHours(new Date(openhelp).getHours(), new Date(openhelp).getMinutes(), 0, 0)
        let closehelp = hours[apptDay].close
        let close = new Date(apptTime).setHours(new Date(closehelp).getHours(), new Date(closehelp).getMinutes() - 15, 0, 0)
        if (new Date(apptTime).getTime() < new Date(open).getTime() || new Date(apptTime).getTime() > new Date(close).getTime()) {
            return false
        }
        return true

    };
    getDealerships = async () => {
        let { mongo, agent } = this.props.wizardData
        let salesPipeline = [
            {
                "$match": {
                    isActive: true,
                    isSales: true
                }
            },
            {
                "$sort": {
                    "label": 1
                }
            }
        ]
        let servicePipeline = [
            {
                "$match": {
                    isActive: true,
                    isService: true
                }
            },
            {
                "$sort": {
                    "label": 1
                }
            }
        ]

        let dealerships;
        if (agent.department === "sales") {
            dealerships = this._isMounted && await mongo.aggregate("dealerships", salesPipeline)
        }
        else if (agent.department === "service") {
            dealerships = this._isMounted && await mongo.aggregate("dealerships", servicePipeline)

        }
        this._isMounted && await this.setState({ dealerships })
    }
    getDepartments = async () => {
        let agent = this.props.wizardData.agent
        let query;
        if (agent.department === "sales") {
            query = {
                label: {
                    "$ne": "Service"
                }
            }
        }
        else if (agent.department === "service") {
            query = {
                label: "Service"
            }
        }
        let departments = this._isMounted && await this.props.wizardData.mongo.find("departments", query)
        this._isMounted && this.setState({ departments })
    }
    getScenarios = async (type) => {
        let scenarios = this._isMounted && await this.props.wizardData.mongo.aggregate("scenarios", [
            {
                "$match": {
                    type
                }
            },
            {
                "$sort": {
                    label: 1
                }
            }
        ])
        this._isMounted && this.setState({ scenarios })
    }
    getSources = async () => {
        let sources = this._isMounted && await this.props.wizardData.mongo.aggregate("sources", [
            { "$sort": { label: 1 } }
        ])
        this._isMounted && this.setState({ sources })
    }
    render() {
        if (this.state.loading) {
            return (
                <>
                    <div className="content">
                        <Container>
                            <Col className="ml-auto mr-auto text-center" md="6">
                                <CardImg top width="100%" src={this.props.wizardData.utils.loading} />
                            </Col>
                        </Container>
                    </div>
                </>
            );
        }
        return (
            <>
                <Container>
                    <Row style={{ justifyContent: "center" }}>
                        <Col md="3" style={{ border: "1px solid #1d67a8", padding: 10, margin: 10 }} hidden={!this.state.selected_dealership}>
                            <h1 className="text-primary">{!this.state.selected_dealership ? null : this.state.selected_dealership.label}</h1>
                            {(() => {
                                if (!this.state.selected_dealership) { return null }
                                if (this.props.wizardData.agent.department === "sales") {
                                    let selected_day = new Date(this.state.appointment_date).getDay()
                                    return this.state.selected_dealership.salesHours.map((sales_hrs, i) => {
                                        let bold = false
                                        if (parseInt(selected_day) === ((parseInt(i) + 1)) % 7) {
                                            bold = true
                                        }
                                        if (sales_hrs.isClosed) {
                                            return <p key={i} className="text-primary" style={bold ? { fontWeight: "bolder", fontSize: 18, textDecoration: "underline" } : null}>{sales_hrs.day}: Closed</p>
                                        }
                                        return (
                                            <p key={i} className="text-primary" style={bold ? { fontWeight: "bolder", fontSize: 18, textDecoration: "underline" } : null}>
                                                {sales_hrs.day}: {new Date(sales_hrs.open).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(sales_hrs.close).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>)
                                    })
                                }
                                else if (this.props.wizardData.agent.department === "service") {
                                    return this.state.selected_dealership.serviceHours.map((serv, i) => {
                                        if (serv.isClosed) {
                                            return <p key={i} className="text-primary">{serv.day}: Closed</p>
                                        }
                                        return <p key={i} className="text-primary">{serv.day}: {new Date(serv.open).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(serv.close).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    })
                                }
                            })()}
                        </Col>
                        <Col md="7" style={{ border: "1px solid #1d67a8", padding: 10, margin: 10 }}>
                            <h1 className="text-primary">Appointment Details</h1>
                            <Form>
                                <FormGroup >
                                    <p className="text-left text-primary"><strong>Dealership</strong></p>
                                    <Select
                                        options={this.state.dealerships}
                                        value={this.state.selected_dealership}
                                        onChange={async (e) => { await this.setState({ selected_dealership: e }); await this.updateErrorText() }}
                                    />
                                </FormGroup>
                                <FormGroup >
                                    <p className="text-left text-primary"><strong>Appointment Date</strong></p>
                                    <ReactDatetime
                                        timeConstraints={{ minutes: { step: 15 } }}
                                        inputProps={{ disabled: !this.state.selected_dealership }}
                                        isValidDate={(e) => {

                                            let apptDay = (new Date(e).getDay() + 6) % 7
                                            //if it's service, just make sure it's not further than 3 hrs in past..and not closed..
                                            if (this.props.wizardData.agent.department === "service") {
                                                if (
                                                    !this.state.selected_dealership ||
                                                    !this.state.selected_dealership.serviceHours ||
                                                    isNaN(new Date(e).getTime()) === true
                                                ) {
                                                    return false
                                                }
                                                if (this.state.selected_dealership.serviceHours[apptDay].isClosed === true) {
                                                    return false;
                                                }
                                                if (new Date(e).getTime() < new Date(new Date().setHours(0, 0, 0, 0)).getTime()) { return false }
                                            }
                                            else if (this.props.wizardData.agent.department === "sales") {
                                                if (
                                                    !this.state.selected_dealership ||
                                                    !this.state.selected_dealership.salesHours ||
                                                    isNaN(new Date(e).getTime()) === true
                                                ) {
                                                    return false
                                                }
                                                if (this.state.selected_dealership.salesHours[apptDay].isClosed === true) {
                                                    return false;
                                                }
                                                if (new Date(e).getTime() < new Date(new Date().setHours(0, 0, 0, 0)).getTime()) { return false; }

                                                // also check appointment not too far in future..
                                                if (new Date(e).getTime() >= new Date(new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 4)).setHours(0, 0, 0, 0)).getTime()) { return false }

                                            }
                                            return true;
                                        }}
                                        value={this.state.appointment_date}
                                        onChange={async (e) => { await this.setState({ appointment_date: e }); await this.updateErrorText() }}
                                    />
                                </FormGroup>
                                <FormGroup >
                                    <p className="text-left text-primary"><strong>Department</strong></p>
                                    <Select
                                        options={this.state.departments}
                                        value={this.state.selected_department}
                                        onChange={async (e) => { await this.getScenarios(e.label); await this.setState({ selected_department: e }); await this.updateErrorText() }}
                                    />
                                </FormGroup>
                                <FormGroup >
                                    <p className="text-left text-primary"><strong>Scenario</strong></p>
                                    <Select
                                        isDisabled={!this.state.selected_department}
                                        options={this.state.scenarios}
                                        value={this.state.selected_scenario}
                                        onChange={async (e) => { await this.setState({ selected_scenario: e }); await this.updateErrorText() }}
                                    />
                                </FormGroup>
                                <FormGroup >
                                    <p className="text-left text-primary"><strong>Source</strong></p>
                                    <Select
                                        options={this.state.sources}
                                        value={this.state.selected_source}
                                        onChange={(e) => { this.setState({ selected_source: e }) }}
                                    />
                                </FormGroup>
                            </Form>
                            <p className="text-warning" style={{ whiteSpace: "pre-wrap" }}><strong>{this.state.errorText}</strong></p>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}
export default NewApp;
