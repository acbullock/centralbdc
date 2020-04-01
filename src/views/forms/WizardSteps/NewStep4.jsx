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
    Button,
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
            loading: false,
            internal_message: "",
            customer_message: ""
        };
        this._isMounted = false
        // this.generateInternalMessage = this.generateInternalMessage.bind(this)
        // this.formatPhoneNumber = this.formatPhoneNumber(this)
    }
    componentDidMount = async () => {
        this._isMounted = true
        this._isMounted && await this.setState({ loading: true })


        this._isMounted && await this.setState({ loading: false })
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    isValidated = () => {
        return true
    };
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
                        <Col md="5">
                            <h3 className="text-center text-primary">Internal Message</h3>
                            <p className="text-primary" style={{ whiteSpace: "pre-wrap", border: "1px solid #1d67a8", padding: 10, margin: 10 }}>{this.props.wizardData.generateInternalMessage(this.props.wizardData)}</p>
                        </Col>
                        <Col md="5">
                            <h3 className="text-center text-primary">Customer Message</h3>
                            <p className="text-primary" style={{ whiteSpace: "pre-wrap", border: "1px solid #1d67a8", padding: 10, margin: 10 }}>{this.props.wizardData.generateCustomerMessage(this.props.wizardData)}</p>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}
export default NewApp;
