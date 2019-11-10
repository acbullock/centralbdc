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
    Button,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardText,
    // CardTitle,
    Label,
    FormGroup,
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Container,
    Row,
    Col
} from "reactstrap";

class RemoveDealership extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dealership_name: "",
            dealership_phone: "",
            loading: false,
            error: ""
        };
    }
    async componentWillMount() {
        let user = await this.props.mongo.getActiveUser(this.props.mongo.mongodb)
        let agents = await this.props.mongo.getCollection("agents")
        let agent = await agents.findOne({ userId: user.userId })
        if (agent.account_type !== "admin") {
            this.props.history.push("/admin/dashboard")
        }
    }
    async componentDidMount() {
        document.body.classList.toggle("register-page");
        let user = this.props.mongo.getActiveUser(this.props.mongo.mongodb);
        if (user.userId === undefined) {
            this.props.history.push("/auth/login")
        }
        else {
            let agent = await this.props.mongo.db.collection("agents").findOne({ userId: user.userId });
            if (agent.account_type !== "admin") {
                this.props.history.push("/admin/dashboard")
            }
        }
    }
    componentWillUnmount() {
        document.body.classList.toggle("register-page");
    }
    async removeDealer() {
        this.setState({ loading: true })
        let dealerships = await this.props.mongo.getCollection("dealerships")
        await dealerships.findOneAndDelete({label: this.state.dealership_name})

        this.setState({ loading: false, dealership_name: "" })
    }
    render() {
        return (
            <>
                <div className="content">
                    <Container>
                        <Row>

                            <Col className="mr-auto center" md="6">
                                <Card className="card-register card-white">
                                    <CardHeader>
                                        <img
                                            alt="logo"
                                            src={require("../../assets/img/logo.png")}
                                            style={{ padding: 10 }}
                                        />
                                    </CardHeader>
                                    <CardBody>
                                        <Form className="form">
                                            <InputGroup>
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="tim-icons icon-single-02" />
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input placeholder="Dealership Name" type="text" value={this.state.dealership_name} onChange={(e) => { e.preventDefault(); this.setState({ dealership_name: e.target.value }) }} />
                                            </InputGroup>

                                        </Form>
                                    </CardBody>
                                    <CardFooter>
                                        <Button
                                            className="btn-round float-left"
                                            color="info"
                                            href="#pablo"
                                            onClick={e => { e.preventDefault(); this.props.history.push("/admin/dashboard") }}
                                            size="lg"
                                            disabled={this.state.loading}
                                        >
                                            Back To Dashboard
                    </Button>
                                        <Button
                                            className="btn-round float-right"
                                            color="danger"
                                            href="#pablo"
                                            onClick={e => { e.preventDefault(); this.removeDealer() }}
                                            size="lg"
                                            disabled={this.state.loading || this.state.dealership_name.length == 0}
                                        >
                                            Remove Dealership
                    </Button>
                                        <Card color="warning" hidden={this.state.error.length === 0}>
                                            <CardText>
                                                {this.state.error.message}
                                            </CardText>
                                        </Card>
                                    </CardFooter>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </>
        );
    }
}

export default RemoveDealership;
