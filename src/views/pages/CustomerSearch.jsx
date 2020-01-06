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
    Form,
    FormGroup,
    Row,
    Col
} from "reactstrap";
import Select from "react-select"
import axios from "axios"
import ReactPlayer from 'react-player'
class CustomerSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            agent: "",
            records: "",
            searchPhone: "",
            results: [],
            urls: []
        };

    }
    _isMounted = false
    async componentWillMount() {
        this._isMounted = true;
        let mappings = this._isMounted && await this.props.mongo.find("dealer_mappings")
        this._isMounted && this.setState({ loading: true })
        //get user..
        let user = this._isMounted && await this.props.mongo.getActiveUser(this.props.mongo.mongodb);
        let agent = this._isMounted && await this.props.mongo.findOne("dealership_users", { "userId": user.userId })
        let dealerships = this._isMounted && await this.props.mongo.find("dealerships")
        //get user's dealership
        let dealership = this._isMounted && await this.props.mongo.findOne("dealerships", { "_id": agent.dealership })
        this._isMounted && await this.setState({ loading: false, agent: agent, dealership: dealership, dealerships: dealerships, mappings: mappings[0] });


    }
    async componentDidMount() {
        this._isMounted = true

    }
    timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    componentWillUnmount() {
        this._isMounted = false

    }
    async searchRecords(e) {
        this._isMounted && this.setState({ loading: true, results: [] })
        e.preventDefault()
        //get user's group
        let dealer = this._isMounted &&  await this.props.mongo.findOne("dealerships", { value: this.state.agent.dealership })
        let group = this._isMounted && await this.props.mongo.findOne("dealership_groups", { value: dealer.group })
        let dealersInGroup = this.state.dealerships.filter((d) => {
            return d.group == group.value
        })
        let validNumbers = [];
        if (this.state.agent.access == "store") {
            validNumbers.push(dealer.dataMining.substring(1, 12))
            validNumbers.push(dealer.sales.substring(1, 12))
        }
        else if (this.state.agent.access == "group") {
            for (let d in dealersInGroup) {
                if (dealersInGroup[d].dataMining.length == 12)
                    validNumbers.push(dealersInGroup[d].dataMining.substring(1, 12))
                if (dealersInGroup[d].sales.length == 12)
                validNumbers.push(dealersInGroup[d].sales.substring(1, 12))
            }
        }
        else if (this.state.agent.access == "admin") {
            for (let d in this.state.dealerships) {
                if (this.state.dealerships[d].dataMining.length == 12)
                    validNumbers.push(this.state.dealerships[d].dataMining.substring(1, 12))
                if (this.state.dealerships[d].sales.length == 12)
                validNumbers.push(this.state.dealerships[d].sales.substring(1, 12))
            }
        }
        // console.log("valid", validNumbers)

        //get token
        let token = this._isMounted && await this.props.mongo.findOne("utils", { _id: "5df2b825f195a16a1dbd4bf5" })
        token = token.voice_token;
        let lastMonth = new Date()
        lastMonth = new Date(lastMonth.setDate(lastMonth.getDate() - 10))
        
        let nextMonth = new Date()
        nextMonth = new Date(nextMonth.setDate(nextMonth.getDate() +1))
        // console.log(lastMonth, nextMonth)
        // nextMonth = new Date(nextMonth.setMonth(nextMonth.getMonth() + 1))

        let results = this._isMounted && await axios.get(`https://platform.ringcentral.com/restapi/v1.0/account/~/call-log?access_token=${token}&phoneNumber=${this.state.searchPhone}&withRecording=true&view=Detailed&dateFrom=${lastMonth.getFullYear()}-${lastMonth.getMonth() + 1}-${lastMonth.getDate()}&dateTo=${nextMonth.getFullYear()}-${nextMonth.getMonth() + 1}-${nextMonth.getDate()}&perPage=1000&page=1`)



        results = results.data.records
        results = results.filter((r) => {
            let useMe = false;
            for (let v in validNumbers) {
                if(r.to.phoneNumber == undefined || r.from.phoneNumber == undefined){
                    continue;
                }
                useMe = r.to.phoneNumber.indexOf(validNumbers[v]) != -1 ||
                    r.from.phoneNumber.indexOf(validNumbers[v]) != -1;
                if (useMe) {
                    break;
                }
            }
            return useMe;
        })
        // console.log("!@#", results)
        let urls = []
        for (let r in results) {
            urls[r] = ""
        }
        this._isMounted && this.setState({ results: results, urls: urls, loading: false })
    }
    async loadAudio(i) {
        let token = this._isMounted && await this.props.mongo.findOne("utils", { _id: "5df2b825f195a16a1dbd4bf5" })
        token = token.voice_token;

        let urls = this.state.urls;
        urls[i] = this.state.results[i].recording.contentUri + "?access_token=" + token
        this.setState(urls)
    }
    render() {
        if (this.state.loading) {
            return (
                <>
                    <div className="content">
                        <Container>
                            <Col className="ml-auto mr-auto text-center" md="6">
                                {/* <Card color="transparent"> */}
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
                        <Row style={{justifyContent: "center"}}>
                            <Col lg="8" >
                                <Card className="card-raised card-white">
                                    <CardBody>
                                        <Form onSubmit={(e) => { this.searchRecords(e) }}>
                                            <legend>Customer Search</legend>
                                            <FormGroup>
                                                <Label>Phone Number:</Label>
                                                <Input
                                                    placeholder="Customer Phone Number"
                                                    type="number"
                                                    value={this.state.searchPhone}
                                                    onChange={(e) => { this.setState({ searchPhone: e.target.value }) }}
                                                ></Input>
                                            </FormGroup>
                                            <FormGroup>
                                                <Button disabled={this.state.searchPhone.length < 1} color="danger" onClick={() => { this.setState({ searchPhone: "" }) }}>Clear Form</Button>
                                                <Button disabled={this.state.searchPhone.length != 10} color="success" type="submit" >Search</Button>
                                            </FormGroup>
                                        </Form>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>

                        <Row style={{justifyContent: "center"}}>
                            <Col lg="8">
                                <Card className="card-raised card-white">
                                    <CardTitle className="text-center">
                                        <legend>
                                            Results:
                                        </legend>
                                    </CardTitle>
                                    <CardBody>
                                        {
                                            this.state.urls.map((u, i) => {
                                                return (<div key={i} className="text-center">
                                                    <p><strong>Call Started: </strong>{new Date(this.state.results[i].startTime).toLocaleString()}</p>
                                                    <p><strong>To: </strong>{this.state.results[i].to.phoneNumber}</p>
                                                    <p><strong>From: </strong>{this.state.results[i].from.phoneNumber}</p>
                                                    <p><strong>Dealership: </strong> {this.state.mappings[this.state.results[i].direction === "Inbound" ? this.state.results[i].to.phoneNumber : this.state.results[i].from.phoneNumber] || "Unavailable"}</p>
                                                    <p><strong>Agent: </strong>{this.state.results[i].from.name || "Not available.."}</p>
                                                    <p><strong>Direction: </strong>{this.state.results[i].direction || "Not available.."}</p>
                                                    <br/>
                                                    <audio controls src={u} hidden={u.length < 1 || this.state.agent.access !== "admin"}/>
                                                    <audio controls src={u} hidden={u.length < 1 || this.state.agent.access === "admin"} controlsList="nodownload"/>
                                                    <br />
                                                    <Button onClick={() => this.loadAudio(i)}>Load Audio</Button>
                                                    <hr />
                                                    <hr />
                                                </div>);
                                            })
                                        }
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </>
        );
    }
}

export default CustomerSearch;
