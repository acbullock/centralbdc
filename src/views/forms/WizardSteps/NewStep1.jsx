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
import classnames from "classnames";
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
    FormGroup
} from "reactstrap";

class NewApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname: "",
            lastname: "",
            phone: "",
            errorText: ""
        };
    }
    async componentDidMount() {
        await this.props.wizardData.generateInternalMessage()
        await this.props.wizardData.generateCustomerMessage()
    }
    updateErrorText = () => {
        let err = ""
        if (this.state.firstname.length === 0) {
            err += "\nFirst Name cannot be blank."
        }
        if (this.state.lastname.length === 0) {
            err += "\nLast Name cannot be blank."
        }
        if (this.state.phone.length !== 10 || parseInt(this.state.phone) === -1) {
            err += "\nPhone Number must be a 10-digit number (no symbols)"
        }
        this.setState({ errorText: err })
    }

    isValidated = () => {
        this.updateErrorText()
        return this.state.firstname.length !== 0 &&
            this.state.lastname.length !== 0 &&
            this.state.phone.length === 10 &&
            parseInt(this.state.phone) !== -1
    };
    render() {
        return (
            <>
                <Container>
                    <Row style={{ justifyContent: "center" }}>
                        <Col md="5" style={{ border: "1px solid #1d67a8", padding: 10 }}>
                            <h1 className="text-primary">Customer Information</h1>
                            <Form>
                                <FormGroup >
                                    <p className="text-left text-primary"><strong>First Name</strong></p>
                                    <Input
                                        type="text"
                                        value={this.state.firstname}
                                        onChange={async (e) => { await this.setState({ firstname: e.target.value }); await this.updateErrorText(); await this.props.wizardData.generateInternalMessage(); await this.props.wizardData.generateCustomerMessage(); }}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <p className="text-left text-primary"><strong>Last Name</strong></p>
                                    <Input
                                        type="text"
                                        value={this.state.lastname}
                                        onChange={async (e) => { await this.setState({ lastname: e.target.value }); await this.updateErrorText() }} />
                                </FormGroup>
                                <FormGroup>
                                    <p className="text-left text-primary"><strong>Customer Phone Number</strong></p>
                                    <Input
                                        type="number"
                                        value={this.state.phone}
                                        onChange={async (e) => { await this.setState({ phone: e.target.value }); await this.updateErrorText() }}
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
