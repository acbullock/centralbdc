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
    CardBody,
    CardFooter,
    CardImg,
    CardTitle,
    ListGroupItem,
    ListGroup,
    Progress,
    Input,
    Image,
    Label,
    Form,
    Container,
    Row,
    Col
} from "reactstrap";
import Select from "react-select"

class AppointmnetSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchFirst: "",
            searchLast: "",
            searchPhone: "",
            results: [],
            loading: false
        };

    }
    _isMounted = false
    async componentDidMount() {
        this._isMounted = true
        let user = await this.props.mongo.getActiveUser(this.props.mongo.mongodb)
        let agent = await this.props.mongo.findOne("agents", { userId: user.userId })
        if (agent.account_type !== "admin") {
            this._isMounted = false
            this.props.history.push("/admin/dashboard")
        }


        this._isMounted && this.setState({ loading: false })

    }
    onInputChange(key, value) {
        this.setState({ [key]: value })
    }
    async searchAppt(e) {
        e.preventDefault()
        this.setState({ loading: true, results: [] })
        let agents = await this.props.mongo.find("agents")
        let appts = []
        for (let a in agents) {
            for (let b in agents[a].appointments) {
                appts.push(agents[a].appointments[b])
            }
        }
        appts = appts.filter((a) => {
            return (this.state.searchFirst.length > 0 && a.customer_firstname.toLowerCase().indexOf(this.state.searchFirst.toLowerCase()) != -1) ||
                (this.state.searchLast.length > 0 && a.customer_lastname.toLowerCase().indexOf(this.state.searchLast.toLowerCase()) != -1) ||
                (this.state.searchPhone.length > 0 && a.customer_phone.toLowerCase().indexOf(this.state.searchPhone.toLowerCase()) != -1)
        })
        for (let a in appts) {
            let id = appts[a].agent_id
            for (let agent in agents) {
                if (agents[agent]._id == id) {
                    appts[a].agent_name = agents[agent].name
                    break;
                }
            }
        }
        this.setState({ results: appts, loading: false })
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
                            <Col className="ml-auto mr-auto text-center" md="6" >
                                <Card color="transparent">
                                    <CardImg top width="100%" src={this.props.utils.loading}/>
                                </Card>
                            </Col>
                        </Container>
                    </div>
                </>
            );
        }
        return (
            <>
                <div className="content">
                    <Container >
                        <Row>
                            <Col className="ml-auto mr-auto text-center" md="6">

                                <h1 className="title">Appointment Search</h1>
                                <h1 hidden={!this.state.loading}>Loading</h1>
                                <br />
                            </Col>
                        </Row>
                        <br /><br /><br />
                        <Row>
                            <Col lg="6" md="6">
                                <Card>

                                    <CardBody>

                                        <Form onSubmit={(e) => { this.searchAppt(e) }}>
                                            <Label>
                                                Customer First Name
                                            </Label>
                                            <Input
                                                placeholder="Customer First Name"
                                                value={this.state.searchFirst}
                                                onChange={(e) => { this.onInputChange("searchFirst", e.target.value) }}
                                            />
                                            <Label>
                                                Customer Last Name
                                            </Label>
                                            <Input
                                                placeholder="Customer Last Name"
                                                value={this.state.searchLast}
                                                onChange={(e) => { this.onInputChange("searchLast", e.target.value) }}
                                            /><hr></hr>
                                            <Label>
                                                Customer Phone Number
                                            </Label>
                                            <Input
                                                type="number"
                                                placeholder="Customer Phone Number"
                                                value={this.state.searchPhone}
                                                onChange={(e) => { this.onInputChange("searchPhone", e.target.value) }}
                                            />
                                            <Button type="submit" disabled={this.state.loading || (this.state.searchFirst.length == 0 && this.state.searchLast.length == 0 && this.state.searchPhone.length == 0)}>
                                                Search
                                            </Button>
                                            <Button color="warning" disabled={this.state.loading || (this.state.searchFirst.length == 0 && this.state.searchLast.length == 0 && this.state.searchPhone.length == 0)} onClick={(e) => {
                                                e.preventDefault();
                                                this.setState({
                                                    searchFirst: "",
                                                    searchLast: "",
                                                    searchPhone: ""
                                                })
                                            }}>Clear Form</Button>

                                        </Form>
                                    </CardBody>

                                </Card>
                                <br />
                            </Col>

                            <Col lg="12" md="12">
                                <h2>Results Count: {this.state.results.length}</h2>
                                {/* <Card className="card-warning card-raised card-white" > */}
                                {/* <CardBody > */}
                                {
                                    this.state.results.map((a, i) => {
                                        return (
                                            <div key={a.agent_id + "_" + i} style={{ whiteSpace: "pre-wrap" }} >
                                                <Card>
                                                    <CardBody>
                                                        <p> {a.internal_msg}</p><br />
                                                        <p><strong>Agent Name: </strong>{a.agent_name}</p>
                                                        <p><strong>Appointment Created: </strong>{new Date(a.verified).toLocaleDateString() + " " + new Date(a.verified).toLocaleTimeString()}</p>
                                                    </CardBody>
                                                </Card>
                                            </div>

                                        )
                                    })
                                }
                                {/* </CardBody> */}
                                {/* </Card> */}
                            </Col>
                        </Row>
                    </Container>
                </div>
            </>
        );
    }
}

export default AppointmnetSearch;
