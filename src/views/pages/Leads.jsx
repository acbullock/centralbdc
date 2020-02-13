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

class AgentProfile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            user: null,
            agent: null,
            leads: [],
            selected_source: { label: "", value: "" },
            filteredLeads: []
        };
        this.showLeads = this.showLeads.bind(this)
        this.leadHeartbeat = this.leadHeartbeat.bind(this)
    }
    _isMounted = false;
    async componentDidMount() {
        this._isMounted = true
        this._isMounted && await this.setState({ loading: true })
        let user = this._isMounted && await this.props.mongo.getActiveUser(this.props.mongo.mongodb)
        let agent = this._isMounted && await this.props.mongo.findOne("agents", { userId: user.userId })
        let leads = this._isMounted && await this.props.mongo.find("leads")
        let lead_options = []
        for (let l in leads) {
            if (lead_options.findIndex((lead) => { return lead.label === leads[l].rules.dealership }) === -1) {
                lead_options.push({ label: leads[l].rules.dealership, value: leads[l]._id })
            }
        }
        console.log(lead_options)
        this._isMounted && await this.setState({ loading: false, user, agent, leads, lead_options })
        this._isMounted && this.leadHeartbeat()
    }
    componentWillUnmount() {
        this._isMounted = false
    }
    async showLeads() {
        let filtered = this.state.leads.slice().filter((l) => {
            return l.rules.dealership === this.state.selected_source.label
        })
        filtered.sort((a, b) => {
            if (a.received_at_text > b.received_at_text) return -1;
            if (a.received_at_text < b.received_at_text) return 1;
            return 0

        })
        // console.log(filtered)
        this.setState({ filteredLeads: filtered })
    }
    async leadHeartbeat() {
        setInterval(async () => {
            console.log("refreshed")
            let leads = this._isMounted && await this.props.mongo.find("leads")
            let lead_options = []
            for (let l in leads) {
                if (lead_options.findIndex((lead) => { return lead.label === leads[l].rules.dealership }) === -1) {
                    lead_options.push({ label: leads[l].rules.dealership, value: leads[l]._id })
                }
            }
            this._isMounted && await this.setState({ leads, lead_options })
            if (this.state.selected_source.label.length > 0) {
                this.showLeads()
            }
        }, 30000);
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
                            <h1 style={{ background: "-webkit-linear-gradient(#1d67a8, #000000)", "WebkitBackgroundClip": "text", "WebkitTextFillColor": "transparent" }}><strong>Leads</strong></h1>
                            {/* <h1 style={{ color: "#1d67a8", textAlign: "center" }}><strong>Service Department</strong></h1> */}
                        </Col>
                    </Row>
                    <br />
                    <Row style={{ textAlign: "center" }}>
                        <Col md="12" >
                            <Card style={{ padding: "20px", background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                <CardTitle>
                                    <h1 className="text-white"><strong>Leads</strong></h1>
                                </CardTitle>
                                <Row style={{ justifyContent: "center" }}>
                                    <Col md="6" >
                                        <Select
                                            options={this.state.lead_options}
                                            value={this.state.selected_source}
                                            onChange={async (e) => {
                                                this._isMounted && await this.setState({ selected_source: e });
                                                this.showLeads();
                                            }}
                                        />

                                    </Col>
                                </Row>
                                <hr style={{ border: "1px solid white" }} />
                                <br />
                                {this._isMounted && this.state.filteredLeads.map((f, i) => {
                                    return (
                                        <div key={i}>

                                            <Row>
                                                <Col md="5">

                                                    <Card color="transparent" className="card-raised card-white">
                                                        <p style={{ textDecoration: "underline" }} className="text-white"><strong>Vehicle Info</strong></p>
                                                        <p className="text-white"><strong>Make:</strong> {f.rules.make}</p>
                                                        <p className="text-white"><strong>Model:</strong> {f.rules.model}</p>
                                                        <p className="text-white"><strong>Year:</strong> {f.rules.year}</p>
                                                        <p className="text-white"><strong>Trim:</strong> {f.rules.trim}</p>
                                                        <p className="text-white"><strong>Body Style:</strong> {f.rules.body_style}</p>
                                                        <p className="text-white"><strong>Transmission:</strong> {f.rules.transmission}</p>
                                                        <p className="text-white"><strong>Interior Color:</strong> {f.rules.interior_color}</p>
                                                        <p className="text-white"><strong>Exterior Color:</strong> {f.rules.exterior_color}</p>
                                                        <p className="text-white"><strong>Price:</strong> {f.rules.price}</p>
                                                        <p className="text-white"><strong>Price Comment:</strong> {f.rules.price_comment}</p>
                                                    </Card>
                                                </Col>
                                                <Col md="5">
                                                    <Card color="transparent">
                                                        <p style={{ textDecoration: "underline" }} className="text-white"><strong>Customer Info</strong></p>
                                                        <p className="text-white"><strong>Name:</strong> {f.rules.first_name} {f.rules.last_name}</p>
                                                        <p className="text-white"><strong>Phone Number:</strong> {f.rules.phone_number}</p>
                                                        <p className="text-white"><strong>Email:</strong> {f.rules.email_address}</p>
                                                        <p className="text-white"><strong>Preferred Contact Method:</strong> {f.rules.preferred_contact_method}</p>
                                                        <p className="text-white"><strong>Address:</strong> {f.rules.address} {f.rules.city}, {f.rules.st} {f.rules.zip}</p>
                                                        <p className="text-white"><strong>Special Requests:</strong> {f.rules.special_requests}</p>
                                                        <p className="text-white"><strong>Lead ID:</strong> {f.rules.lead_id}</p>
                                                    </Card>
                                                </Col>
                                                <Col md="12">
                                                    <p className="text-white">Lead Source: <strong>{f.rules.lead_source}</strong></p>
                                                    <p className="text-white">Sub-Lead Source: <strong>{f.rules.sub_lead_source}</strong></p>
                                                    <p className="text-white">Date Received: <strong>{new Date(f.received_at_text).toLocaleString()}</strong></p>
                                                </Col>
                                            </Row>

                                            <hr style={{ border: "1px solid white" }} />
                                        </div>
                                    )
                                })}
                            </Card>
                        </Col>
                    </Row>
                </div>
            </>
        );
    }
}

export default AgentProfile;
