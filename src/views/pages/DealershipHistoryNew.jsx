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
    Form,
    CardImg,
    CardTitle,
    ListGroupItem,
    ListGroup,
    Progress,
    Input,
    Label,
    Container,
    Row,
    Col,
    CardHeader,
    FormGroup
} from "reactstrap";
import Select from "react-select"
import ReactDatetime from "react-datetime";
class DealershipHistoryNew extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            agent: {},
            appointments: [],
            dealerships: [],
            assistance: [],
            loading: true,
            dealerAppts: [],
            dealerFollow: [],
            numDays: 0,
            selected_dealership: { label: "", value: "" },
            historyLoading: false,
            history: [],
            fromDate: new Date(),
            toDate: new Date(),
            results: [],
            searched: false,
            resultsLoading: false
        };
        this.loadHistory = this.loadHistory.bind(this)
        this.getResults = this.getResults.bind(this)
    }
    _isMounted = false
    async componentWillMount() {
        this._isMounted = true;
        let user = this._isMounted && await this.props.mongo.getActiveUser(this.props.mongo.mongodb)
        let agent = this._isMounted && await this.props.mongo.findOne("agents", { userId: user.userId })
        if (agent.account_type !== "admin") {
            this._isMounted = false
            this.props.history.push('/admin/dashboard')
        }
    }
    async componentWillUnmount() {
        this._isMounted = false;
    }
    async componentDidMount() {
        this._isMounted = true
        this._isMounted && this.setState({ loading: true })
        let dealerships = this._isMounted && await this.props.mongo.find("dealerships", { isActive: true, isSales: true })
        let agents = this._isMounted && await this.props.mongo.find("agents", { department: "sales" })
        dealerships.sort((a, b) => {
            if (a.label > b.label) return 1;
            if (a.label < b.label) return -1;
            return 0;
        })
        this._isMounted && this.setState({ loading: false, dealerships, agents })

    }
    async loadHistory(dealer) {
        this._isMounted && this.setState({ historyLoading: true })
        let agents = this.state.agents
        let appts = []
        for (let a in agents) {
            appts = appts.concat(agents[a].appointments)
        }
        appts = appts.filter((a) => {
            return a.dealership.value === dealer.value
        })

        let all_appts = this._isMounted && await this.props.mongo.find("all_appointments", { "dealership.value": dealer.value })
        appts = appts.concat(all_appts)
        appts = appts.filter((a)=>{
            return a.dealership_department !== "Service"
        })
        this._isMounted && this.setState({ historyLoading: false, history: appts })

    }
    async getResults() {
        this._isMounted && await this.setState({ searched: true, resultsLoading: true, results: [] })
        let from = new Date(this.state.fromDate).setHours(0, 0, 0, 0)
        let to = new Date(this.state.toDate).setHours(23, 59, 59, 999)
        let results = this.state.history.filter((a) => {
            let verified = new Date(a.verified)
            return verified.getTime() >= new Date(from).getTime() && verified.getTime() <= new Date(to).getTime()
        })
        results.sort((a, b) => {
            if (new Date(a.verified).getTime() > new Date(b.verified).getTime()) return 1;
            if (new Date(a.verified).getTime() < new Date(b.verified).getTime()) return -1;
            return 0
        })
        for (let r in results) {
            let name = "Not available.."
            for (let a in this.state.agents) {
                if (this.state.agents[a]._id === results[r].agent_id) {
                    name = this.state.agents[a].name;
                    break;
                }
            }
            results[r].agent_name = name
        }
        this._isMounted && await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, 200);
        })
        this._isMounted && await this.setState({ results, resultsLoading: false })

    }
    render() {
        if (this.state.loading) {
            return (
                <>
                    <div className="content">
                        <Container>
                            <Col className="ml-auto mr-auto text-center" md="6">
                                {/* <Card  color="transparent" > */}
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
                    <Container>
                        <Row style={{ textAlign: "center", justifyContent: "center" }}>
                            <Col md="8">
                                <Card className="card-raised card-white text-center" style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                    <CardHeader>
                                        <CardTitle><h1 style={{ color: "white" }}><strong>Dealership History</strong></h1></CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                        <Select
                                            options={this.state.dealerships}
                                            value={this.state.selected_dealership}
                                            onChange={(e) => {
                                                this._isMounted && this.setState({ selected_dealership: e, history: [], results: [], searched: false })
                                                this.loadHistory(e)
                                            }}
                                        />
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                        <Row hidden={this.state.history.length < 1 && !this.state.historyLoading} style={{ justifyContent: "center" }}>
                            <Col md="8">
                                <Card className="card-raised card-white" style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                    <CardHeader>
                                        <CardTitle><h1 className="text-center" style={{ color: "white" }}>Select Date Range</h1></CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                        <Card>
                                            <CardImg top src={this.props.utils.loading} hidden={!this.state.historyLoading} />
                                        </Card>
                                        <Card style={{ color: "white", padding: "20px" }} hidden={this.state.historyLoading}>
                                            <Form style={{ opacity: "100%" }}>
                                                <FormGroup>
                                                    <legend style={{ color: "#1d67a8" }}>From:</legend>
                                                    <ReactDatetime

                                                        timeFormat={false}
                                                        isValidDate={() => {
                                                            return true
                                                        }}
                                                        inputProps={{
                                                            className: "form-control",
                                                            placeholder: "From date",
                                                            name: "date",

                                                        }}
                                                        value={this.state.fromDate}
                                                        onChange={(value) => {

                                                            this._isMounted && this.setState({ fromDate: new Date(value) })
                                                        }
                                                        }
                                                        className="primary"
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <legend style={{ color: "#1d67a8" }} >To:</legend>
                                                    <ReactDatetime

                                                        timeFormat={false}
                                                        isValidDate={() => {
                                                            return true
                                                        }}
                                                        inputProps={{
                                                            className: "form-control",
                                                            placeholder: "To date",
                                                            name: "date",

                                                        }}
                                                        value={this.state.toDate}
                                                        onChange={(value) => {

                                                            this._isMounted && this.setState({ toDate: new Date(value) })
                                                        }
                                                        }
                                                        className="primary"
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <Button
                                                        disabled={new Date(this.state.fromDate).getTime() > new Date(this.state.toDate).getTime() || this.state.resultsLoading}
                                                        color="primary" onClick={(e) => {
                                                            e.preventDefault();
                                                            this._isMounted && this.setState({ results: [] })

                                                            this.getResults()
                                                        }}>Search</Button>
                                                </FormGroup>
                                            </Form>
                                        </Card>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>

                        <Row style={{ justifyContent: "center" }} hidden={!this.state.searched}>
                            <Col md="8">
                                <Card className="card-raised card-white" style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)", padding: "20px" }}>
                                    <Card className="card-raised card-white" >
                                        <CardImg top width="100%" src={this.props.utils.loading} hidden={!this.state.resultsLoading} />
                                    </Card>
                                    <h2 style={{ color: "white" }}>{this.state.results.length} Results</h2>
                                    {this.state.results.map((a, i) => {
                                        return (
                                            <Card key={i} color="transparent" className="card-raised card-white shadow">
                                                <CardBody style={{ whiteSpace: "pre-wrap" }}>
                                                    <p style={{ color: "white" }}><strong>{i + 1}.</strong></p>
                                                    <p style={{ color: "white" }}><strong>{a.internal_msg}</strong></p>
                                                    <p style={{ color: "white" }}>Created: <strong>{new Date(a.verified).toLocaleString()}</strong></p>
                                                    <p style={{ color: "white" }}>Agent Name: <strong>{a.agent_name}</strong></p>
                                                </CardBody>
                                            </Card>);
                                    })}


                                </Card>
                            </Col>
                        </Row>

                    </Container>
                </div>
            </>
        );
    }
}

export default DealershipHistoryNew;
