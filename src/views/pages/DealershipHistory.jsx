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

class DealershipHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            agent: {},
            appointments: [],
            dealershps: [],
            assistance: [],
            loading: true,
            currDealer: {},
            dealerAppts: [],
            dealerFollow: [],
            numDays: 0
        };

    }
    _isMounted = false
    async componentDidMount() {
        this._isMounted = true
        let agents = this._isMounted && await this.props.mongo.find("agents")
        let dealerships = this._isMounted && await this.props.mongo.find("dealerships")
        this._isMounted && dealerships.sort((a, b) => {
            if (a.label > b.label) return 1
            if (a.label < b.label) return -1
            return 0
        })
        let appts = []
        let assistance = []
        for (let a in agents) {
            for (let b in agents[a].appointments) {
                appts.push(agents[a].appointments[b])
            }
            for( let c in agents[a].assistance){
                assistance.push(agents[a].assistance[c])
            }
        }
        this._isMounted && appts.sort((a, b) => {
            if (new Date(a.verified).getTime() > new Date(b.verified).getTime()) return -1
            if (new Date(a.verified).getTime() < new Date(b.verified).getTime()) return 1
            return 0
        })
        this._isMounted && assistance.sort((a, b) => {
            if (new Date(a.created).getTime() > new Date(b.created).getTime()) return -1
            if (new Date(a.created).getTime() < new Date(b.created).getTime()) return 1
            return 0
        })
        // appts = appts.filter((a)=>{
        //     let today = new Date()
        //     today.setHours(0,0,0,0)
        //     return new Date(a.verified).getTime() > today.getTime()
        // })


        this._isMounted && this.setState({ appointments: appts, agents: agents, dealerships: dealerships, assistance: assistance, loading: false })

    }
    async refreshList() {
        let appts = []
        let assistance = []
        this._isMounted && this.setState({ loading: true })
        appts = await this.state.appointments.filter((d) => {

            return d.dealership.label == this.state.currDealer.label
        })
        assistance = await this.state.assistance.filter((a)=>{
            return a.dealership.label == this.state.currDealer.label
        })
        let today = new Date()
        today.setHours(0, 0, 0, 0)
        let day = new Date(today.getTime() - (24 * 3600000 * this.state.numDays))
        appts = appts.filter((a) => {
            return new Date(a.verified).getTime() > day.getTime()
        })
        assistance = assistance.filter((a)=>{
            return new Date(a.created).getTime() > day.getTime()
        })
        //   for(let z in appts){
        //     appts[z].agent_name = await this.getAgentFromId(appts[z].agent_id)
        // }

        for(let a in appts){
            for(let b in this.state.agents){
                if(this.state.agents[b]._id == appts[a].agent_id){
                    appts[a].agent_name = this.state.agents[b].name
                }
            }
        }
        this._isMounted && this.setState({ dealerAppts: appts, dealerFollow: assistance, loading: false })
    }
    async getAgentFromId(id) {
        let agent = await this.props.mongo.findOne("agents", { _id: id })
        return agent.name
    }
    componentWillUnmount() {
        this._isMounted = false

    }
    async refreshButton(){
        this._isMounted && this.setState({loading:true})
        let agents = this._isMounted && await this.props.mongo.find("agents")
        let dealerships = this._isMounted && await this.props.mongo.find("dealerships")
        this._isMounted && dealerships.sort((a, b) => {
            if (a.label > b.label) return 1
            if (a.label < b.label) return -1
            return 0
        })
        let appts = []
        let assistance = []
        for (let a in agents) {
            for (let b in agents[a].appointments) {
                appts.push(agents[a].appointments[b])
            }
            for( let c in agents[a].assistance){
                assistance.push(agents[a].assistance[c])
            }
        }
        this._isMounted && appts.sort((a, b) => {
            if (new Date(a.verified).getTime() > new Date(b.verified).getTime()) return -1
            if (new Date(a.verified).getTime() < new Date(b.verified).getTime()) return 1
            return 0
        })
        this._isMounted && assistance.sort((a, b) => {
            if (new Date(a.created).getTime() > new Date(b.created).getTime()) return -1
            if (new Date(a.created).getTime() < new Date(b.created).getTime()) return 1
            return 0
        })
        // appts = appts.filter((a)=>{
        //     let today = new Date()
        //     today.setHours(0,0,0,0)
        //     return new Date(a.verified).getTime() > today.getTime()
        // })


        this._isMounted && await this.setState({ appointments: appts, dealerships: dealerships, assistance: assistance, loading: false })
        this._isMounted && await this.refreshList()
    }
    render() {
        return (
            <>
                <div className="content">
                    <Container >
                        <Row>
                            <Col className="ml-auto mr-auto text-center" md="6">
                                <h1 className="title">Dealership History</h1>
                                <h1 hidden={!this.state.loading}>Loading</h1>
                                <Label>Dealership</Label>
                                <Select
                                    isDisabled={this.state.loading}
                                    options={this.state.dealerships}
                                    onChange={async (e) => { this._isMounted && await this.setState({ currDealer: e }); this.refreshList() }}
                                />
                                <br />
                                <Label>
                                    Number of Days in the Past (choose 0, or leave blank for <strong>today</strong> only)
                </Label>
                                <Input
                                    type="number"
                                    disabled={this.state.loading}
                                    onChange={(e) => { this._isMounted && this.setState({ numDays: e.target.value }); this.refreshList() }}
                                /><br/>
                                <Button disabled = {this.state.loading} onClick={()=>{this.refreshButton()}}>Refresh</Button>
                            </Col>
                        </Row>
                        <br /><br /><br />
                        <Row>
                            <Col lg="6" md="12">
                                <h2>Appointment Count: {this.state.dealerAppts.length}</h2>
                                <Card className="card-warning card-raised card-white" >

                                    <CardBody >

                                        {
                                            this.state.dealerAppts.map((appt, i) => {
                                                return (
                                                    <div key={i} style={{ whiteSpace: "pre-wrap" }} >
                                                        {/* <p>Agent Name: <strong>{appt.agent_name}</strong></p> */}
                                                        <p>{appt.internal_msg}</p>
                                                        <p>Created: <strong>{new Date(appt.verified).toLocaleDateString()} {new Date(appt.verified).toLocaleTimeString()}</strong></p>
                                                        <p>Agent Name: {appt.agent_name}</p>
                                                        <hr />
                                                    </div>
                                                )
                                            })
                                        }
                                    </CardBody>
                                </Card>

                            </Col>
                            <Col lg="6" md="12">
                                <h2>Follow-up Count: {this.state.dealerFollow.length}</h2>
                                <Card className="card-warning card-raised card-white" >
                                    <CardBody >
                                        {
                                            this.state.dealerFollow.map((appt, i) => {
                                                return (
                                                    <div key={i} style={{ whiteSpace: "pre-wrap" }} >
                                                        {/* <p>Agent Name: <strong>{appt.agent_name}</strong></p> */}
                                                        <p>{appt.text}</p>
                                                        <p>Created: <strong>{new Date(appt.created).toLocaleDateString()} {new Date(appt.created).toLocaleTimeString()}</strong></p>
                                                        <p>Agent Name: {appt.agent_name}</p>
                                                        <hr />
                                                    </div>
                                                )
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

export default DealershipHistory;
