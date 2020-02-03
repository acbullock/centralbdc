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
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
// reactstrap components
import {
    Button,
    Card,
    CardImg,
    Container,
    CardHeader,
    CardBody,
    CardTitle,
    Table,
    Input,
    Form, FormGroup, Label,
    Row,
    Col,
    CustomInput,
} from "reactstrap";
import Select from "react-select"
import logo from "../../assets/img/logo.png";

class PaymentCalculator extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            user: null,
            agent: null,
            appointmentCount: 0,
            standing: null,
            errorText: "",
            payment: undefined
        };
        this.clearForm = this.clearForm.bind(this)
        this.calculatePay = this.calculatePay.bind(this)
    }
    _isMounted = false;
    async componentDidMount() {
        this._isMounted = true
        this._isMounted && await this.setState({ loading: true })
        let user = this._isMounted && await this.props.mongo.getActiveUser(this.props.mongo.mongodb)
        let agent = this._isMounted && await this.props.mongo.findOne("agents", { userId: user.userId })

        this._isMounted && await this.setState({ loading: false, user, agent })

    }
    componentWillUnmount() {
        this._isMounted = false
    }
    onValueChange(key, value) {
        this._isMounted && this.setState({ [key]: value });
        if (isNaN(parseInt(this.state.appointmentCount))) {
            this._isMounted && this.setState({ errorText: "Appointment Count must be a number" });
            return
        }
        else{
            this._isMounted && this.setState({ errorText: ""})
        }
    }
    clearForm() {
        this._isMounted && this.setState({
            appointmentCount: 0,
            standing: null,
            errorText: "",
            payment: undefined
        })
    }
    calculatePay() {

        
        if (isNaN(parseInt(this.state.appointmentCount))) {
            this._isMounted && this.setState({ errorText: "Appointment Count must be a number" });
            return
        }
        let payment = 2000 //base
        if (this.state.appointmentCount <= 400) {
            payment += 0
        }
        else if (this.state.appointmentCount > 400 && this.state.appointmentCount < 600) {
            payment += (4 * (this.state.appointmentCount - 400))
        }
        else if (this.state.appointmentCount >= 600 && this.state.appointmentCount < 800) {
            payment += (5 * (this.state.appointmentCount - 400))
        }
        else if (this.state.appointmentCount >= 800 && this.state.appointmentCount < 1000) {
            payment += (6 * (this.state.appointmentCount - 400))
        }
        else if (this.state.appointmentCount >= 1000 && this.state.appointmentCount < 1200) {
            payment += (7 * (this.state.appointmentCount - 400))
        }
        else if (this.state.appointmentCount >= 1200) {
            payment += (9 * (this.state.appointmentCount - 400))
        }

        //add in bonuses..
        if (this.state.standing === null) {
            this._isMounted && this.setState({ payment })
        }
        else {
            payment += (2500 + (1 - this.state.standing.value) * 500)
            this._isMounted && this.setState({ payment })
        }
    }
    render() {

        if (this.state.loading) {
            return (
                <>
                    <div className="content">
                        <Container>
                            <Col className="ml-auto mr-auto text-center" md="6">
                                {/* <Card color="transparent" > */}
                                <CardImg top width="100%" src={this.props.utils.loading} />
                                {/* </Card> */}
                            </Col>
                        </Container>
                    </div>
                </>
            );
        }
        return (
            <>
                <div className="content">
                    <Row style={{ textAlign: "center" }}>
                        <Col md="12" >
                            <img src={logo} alt="react-logo" height="100" style={{ textAlign: "center", display: "block", margin: "auto" }} />
                            <h1 style={{ background: "-webkit-linear-gradient(#1d67a8, #000000)", "WebkitBackgroundClip": "text", "WebkitTextFillColor": "transparent" }}><strong>Payment Calculator</strong></h1>
                            {/* <h1 style={{ color: "#1d67a8", textAlign: "center" }}><strong>Service Department</strong></h1> */}
                        </Col>
                    </Row>
                    <br />
                    <Row >
                        <Col md="12" >
                            <Card style={{ padding: "20px", background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                <CardTitle>
                                    <h1 className="text-white"><strong>Performance Pay</strong></h1>
                                    <hr style={{ border: "1px solid white" }} />
                                </CardTitle>
                                <CardBody>
                                    <Form>
                                        <FormGroup>
                                            <Label style={{ color: "white" }}>Appointment Count:</Label>
                                            <Input type="number"
                                                style={{ backgroundColor: "white" }}
                                                value={this.state.appointmentCount}
                                                onChange={(e) => { this._isMounted && this.setState({ payment: undefined }); this.onValueChange("appointmentCount", e.target.value);  }}
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label style={{ color: "white" }}>Office Standing: (optional)</Label>
                                            <Select
                                                value={this.state.standing}
                                                options={[
                                                    { label: "1st Place", value: "1" },
                                                    { label: "2nd Place", value: "2" },
                                                    { label: "3rd Place", value: "3" },
                                                    { label: "4th Place", value: "4" },
                                                    { label: "5th Place", value: "5" },
                                                ]}
                                                onChange={(e) => { this._isMounted && this.setState({ payment: undefined }); this.onValueChange("standing", e) }}
                                            />
                                        </FormGroup>
                                        <Button color="warning" onClick={(e) => { e.preventDefault(); this.clearForm() }}>Clear Form</Button>
                                        <Button color="success" onClick={(e) => { e.preventDefault(); this.calculatePay() }}>Calculate Pay</Button>
                                        <p style={{ color: "red" }}>{this.state.errorText}</p>
                                        <h3 style={{ color: "green" }} hidden={isNaN(this.state.payment)}>{this.state.appointmentCount} Appointments{this.state.standing !== null ? " + " + this.state.standing.label + " Standing" : null} = ${this.state.payment}</h3>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </>
        );
    }
}

export default PaymentCalculator;
