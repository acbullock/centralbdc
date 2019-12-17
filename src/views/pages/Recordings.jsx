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
    Label,
    Container,
    Row,
    Col
} from "reactstrap";
import Select from "react-select"
import axios from 'axios'
import ReactPlayer from 'react-player'
class Recordings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            agent: {},
            records: [],
            dealership: {},
            urls: [],
            mappings: {}
        };
        this.getToken = this.getToken.bind(this)
        this.loadAudio = this.loadAudio.bind(this)
    }
    _isMounted = false
    async componentWillMount() {
        this.setState({ loading: true })
        this._isMounted = true
        //get user..
        let user = this._isMounted && await this.props.mongo.getActiveUser(this.props.mongo.mongodb);
        let agent = this._isMounted && await this.props.mongo.findOne("dealership_users", { "userId": user.userId })

        //get user's dealership
        let dealership = this._isMounted && await this.props.mongo.findOne("dealerships", { "_id": agent.dealership })
        //get all records
        let token = this._isMounted && await this.props.mongo.findOne("utils", {_id: "5df2b825f195a16a1dbd4bf5"})
        token = token.voice_token
        let records = this._isMounted && await this.props.mongo.callsForMonth(token, 12, 2019, dealership.sales.substring(1, 11), 1)
        let records2 = this._isMounted && await this.props.mongo.callsForMonth(token, 12, 2019, dealership.dataMining.substring(1, 11), 1)
        console.log(records);
        records = records.records;
        records2 = records2.records;
        records = records.concat(records2)
        records = records.filter((r) => { return r.recording !== undefined })
        records = records.filter((r) => {
            return parseInt(r.duration["$numberDouble"]) > 120
        })
        console.log(records)
        //get mappings
        let mappings = this._isMounted && await this.props.mongo.find("dealer_mappings");
        mappings = mappings[0]
        let urls = records.map((r) => { return "" })
        this._isMounted && this.setState({ loading: false, agent: agent, records: records, dealership: dealership, urls: urls, mappings: mappings });

    }
    async componentWillUnmount() {
        this._isMounted = false
    }
    async getToken() {
        let token = await this.props.mongo.find("utils")
        token = token[1].voice_token;
        this.setState({ token: token })
    }
    async loadAudio(index) {
        this.setState({ loading: true })
        let token = await this.props.mongo.find("utils")
        token = token[1].voice_token
        let urls = this.state.records.map((r) => { return r.recording.contentUri })
        urls[index] = urls[index] + "?access_token=" + token
        console.log(urls[index])
        for (let i = 0; i < urls.length; i++) {
            if (i != index) {
                urls[i] = ""
            }
        }
        this.setState({ urls: urls, loading: false })
    }
    async componentDidMount() {
        this._isMounted = true

    }
    timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    render() {
        if (this.state.loading) {
            return (
                <>
                    <div className="content">
                        <Container>
                            <Col className="ml-auto mr-auto text-center" md="6">
                                {/* <Card > */}
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
                    <Container >
                        <Row>
                            <Col className="ml-auto mr-auto text-center" md="6">

                                <h1 className="title">Call Recordings</h1>
                                <h4 className="subtitle">Most Recent at the Top</h4>
                                <br />
                                <br />
                            </Col>
                        </Row>
                        {this.state.urls.map((u, i) => {
                            return (
                                <div key={i}>
                                    <Row style={{ justifyContent: "center" }}>
                                        <Card>
                                            <CardBody >
                                                <Row style={{ justifyContent: "center" }}>
                                                    <Col style={{ justifyContent: "center" }}>
                                                        <p><strong>Call Started: </strong>{new Date(this.state.records[i].startTime).toLocaleString()}</p>
                                                        <p><strong>To: </strong>{this.state.records[i].to.phoneNumber}</p>
                                                        <p><strong>From: </strong>{this.state.records[i].from.phoneNumber}</p>
                                                        <p><strong>Dealership: </strong> {this.state.mappings[this.state.records[i].direction === "Inbound" ? this.state.records[i].to.phoneNumber : this.state.records[i].from.phoneNumber] || "Unavailable"}</p>
                                                        <p><strong>Agent: </strong>{this.state.records[i].from.name || "Not available.."}</p>
                                                        <p><strong>Direction: </strong>{this.state.records[i].direction || "Not available.."}</p>
                                                        <p>{this.state.records[i].duration["$numberDouble"]}</p>
                                                    </Col>
                                                </Row>
                                                <Row style={{ justifyContent: "center" }}>
                                                    <audio controls src={u} />
                                                </Row>
                                                <Row style={{ justifyContent: "center" }}>
                                                    <Button color="primary" onClick={() => { this.loadAudio(i) }}>Load Audio</Button>

                                                </Row>

                                                <br />
                                            </CardBody>
                                        </Card>
                                        <hr />
                                    </Row>
                                    <Row>
                                        <br />
                                    </Row>

                                </div>
                            )
                        })}
                    </Container>
                </div>
            </>
        );
    }
}

export default Recordings;
