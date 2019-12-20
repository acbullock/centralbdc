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
    Label,
    CardBody,
    CardHeader,
    CardTitle,
    Table,
    Row,
    Col,
} from "reactstrap";
import Select from "react-select"
class AdminDashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            agents: [],
            all_appointments: [],
            last_appts: [],
            dealerships: [],
            lifetime_appts: 0,
            month_appts: 0,
            today_appts: 0,
            top10: [],
            selected_agent: {
                label: "",
                value: ""
            },
            agent_top_5: []
        };
        this.sortLastAppts = this.sortLastAppts.bind(this);
        this.getTodayAppts = this.getTodayAppts.bind(this);
        this.getTop10 = this.getTop10.bind(this);
        this.getAgentTop5 = this.getAgentTop5.bind(this)
    }
    _isMounted = false;
    async componentDidMount() {
        this._isMounted = true;
        this._isMounted && this.setState({ loading: true });
        let all_appointments = await this.props.mongo.find("appointments");
        let agents = this._isMounted && await this.props.mongo.find("agents")
        this._isMounted && this.setState({ loading: false });
        //sort every dealer's appointments array by date..
        for (let a in all_appointments) {
            all_appointments[a].appointments = all_appointments[a].appointments.sort((a, b) => {
                if (new Date(a.verified).getTime() < new Date(b.verified).getTime()) return 1;
                if (new Date(a.verified).getTime() > new Date(b.verified).getTime()) return -1;
                return 0;
            });
        }
        for (let a in agents) {
            agents[a].label = agents[a].name;
            agents[a].value = agents[a]._id
        }
        agents.sort((a, b) => {
            if (a.name > b.name) return 1;
            if (a.name < b.name) return -1;
            return 0;
        })
        this._isMounted && this.setState({ all_appointments, agents });
        this._isMounted && this.sortLastAppts()
        this._isMounted && this.getTodayAppts();
        this._isMounted && this.getTop10();
    }
    componentWillUnmount() {
        this._isMounted = false
    }
    async sortLastAppts() {
        let last_appts = [];
        let dealerships = await this.props.mongo.find("dealerships");
        this.setState({ dealerships })
        Outerloop:
        for (let a in this.state.all_appointments) {
            if (this.state.all_appointments[a].appointments.length > 0) {
                for (let d in dealerships) {
                    if (dealerships[d].value === this.state.all_appointments[a].dealership) {
                        if (!dealerships[d].isActive) {
                            continue Outerloop;
                        }
                    }
                }
                last_appts.push({
                    dealership: this.state.all_appointments[a].dealership,
                    time_elapsed_hrs: Math.round(new Date(new Date().getTime() - new Date(this.state.all_appointments[a].appointments[0].verified).getTime()).getTime() / 3600000 * 10) / 10
                });
            }
        }
        last_appts.sort((a, b) => {
            if (a.time_elapsed_hrs < b.time_elapsed_hrs) return 1;
            if (a.time_elapsed_hrs > b.time_elapsed_hrs) return -1;
            return 0;
        })
        this._isMounted && await this.setState({ last_appts })
    }
    getTodayAppts() {
        let total = [];
        let thisMonth = new Date()
        thisMonth.setDate(1)
        thisMonth.setHours(0, 0, 0, 0);
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        for (let a in this.state.all_appointments) {
            for (let b in this.state.all_appointments[a].appointments) {
                total.push(this.state.all_appointments[a].appointments[b])
            }
        }

        //get this month appts
        let month_appts = total.filter((a) => {
            return new Date(a.verified).getTime() > thisMonth.getTime();
        })
        let today_appts = total.filter((a) => {
            return new Date(a.verified).getTime() > today.getTime();
        })
        let lifetime_appts = 397740 + total.length;
        this.setState({ lifetime_appts, month_appts: month_appts.length, today_appts: today_appts.length })
    }
    async getTop10() {
        let total = [];
        for (let a in this.state.all_appointments) {
            for (let b in this.state.all_appointments[a].appointments) {
                total.push(this.state.all_appointments[a].appointments[b])
            }
        }
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        let today_appts = total.filter((a) => {
            return new Date(a.verified).getTime() > today.getTime();
        })
        let agent_counts = {}
        for (let a in today_appts) {
            if (agent_counts[today_appts[a].agent_id] != undefined) {
                agent_counts[today_appts[a].agent_id]++;
            }
            else {
                agent_counts[today_appts[a].agent_id] = 1
            }
        }
        let sortable = []
        for (let a in agent_counts) {
            sortable.push([a, agent_counts[a]])
        }
        sortable.sort((a, b) => {
            return b[1] - a[1]
        })
        this.setState({ top10: sortable })

    }
    getAgentTop5(agent) {
        //get appointments for selected agent..
        let agent_appts = agent.appointments
        let dealer_counts = {}
        for (let a in agent_appts) {
            if (dealer_counts[agent_appts[a].dealership.label] !== undefined) {
                dealer_counts[agent_appts[a].dealership.label]++;
            }
            else {
                dealer_counts[agent_appts[a].dealership.label] = 1;
            }
        }
        let sortable = []
        for (let d in dealer_counts) {
            sortable.push([d, dealer_counts[d]])
        }
        sortable.sort((a, b) => {
            return b[1] - a[1];
        })
        this.setState({ agent_top_5: sortable })

    }
    render() {
        if (this.state.loading) {
            return (
                <>
                    <div className="content">
                        <Container>
                            <Col className="ml-auto mr-auto text-center" md="6">
                                <CardImg top width="100%" src={this.props.utils.loading} />
                            </Col>
                        </Container>
                    </div>
                </>
            );
        }
        return (

            <>
                <div className="content">

                    <Row style={{ justifyContent: "center" }} className="text-center">
                        <Col lg="4">
                            <Card className="card-raised card-white">
                                <CardHeader>
                                    <CardTitle >
                                        <h3><strong>Top 10 Stale Dealerships</strong></h3>
                                        <hr />
                                    </CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Table>
                                        <thead>
                                            <tr>
                                                <th>Dealership Name</th>
                                                <th>Time Elapsed Since Last Appointment</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.last_appts.map((a, i) => {
                                                    if (i > 9) return null
                                                    let dealership_name = ""
                                                    for (let d in this.state.dealerships) {
                                                        if (this.state.dealerships[d].value === a.dealership) {
                                                            dealership_name = this.state.dealerships[d].label
                                                            if (!this.state.dealerships[d].isActive) {
                                                                dealership_name = "Inactive"
                                                            }
                                                        }
                                                    }
                                                    // let dealership_name = await this.props.mongo.findOne("dealerships", { value: a.dealership })
                                                    return (
                                                        <tr key={a.dealership}>
                                                            {/* <td>{dealership_name.label}</td> */}
                                                            <td>
                                                                <p style={{ color: "red" }} hidden={a.time_elapsed_hrs < 0.8}>{dealership_name}</p>
                                                                <p hidden={a.time_elapsed_hrs >= 0.8}>{dealership_name}</p>
                                                            </td>
                                                            <td >
                                                                <p style={{ color: "red" }} hidden={a.time_elapsed_hrs < 0.8}><strong>{a.time_elapsed_hrs + " hours"}</strong></p>
                                                                <p hidden={a.time_elapsed_hrs >= 0.8}><strong>{a.time_elapsed_hrs + " hours"}</strong></p>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </Table>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg="4">
                            <Card className="card-raised card-white">
                                <CardHeader>
                                    <CardTitle>
                                        <h3><strong>Top 10 Agents Today</strong></h3>
                                        <hr />
                                    </CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Table>
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Agent Name</th>
                                                <th>Count</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.top10.map((a, i) => {
                                                if (i > 9) return null;
                                                let name = "Unavailable"
                                                for (let b in this.state.agents) {
                                                    if (this.state.agents[b]._id == a[0]) {
                                                        name = this.state.agents[b].name
                                                    }
                                                }
                                                return (
                                                    <tr key={a[0]}>
                                                        <td>{i + 1}</td>
                                                        <td>{name}</td>
                                                        <td>{a[1]}</td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </Table>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg="4">
                            <Card className="card-raised card-white">
                                <CardHeader>
                                    <CardTitle>
                                        <h3><strong>CentralBDC Metrics</strong></h3>
                                        <hr />
                                    </CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <h2>Total Appts Today</h2>
                                    <h3><strong>{this.state.today_appts}</strong></h3>
                                    <hr />
                                    <h2>Total Appts This Month</h2>
                                    <h3><strong>{this.state.month_appts}</strong></h3>
                                    <hr />
                                    <h2>Total Appts Lifetime</h2>
                                    <h3><strong>{this.state.lifetime_appts}</strong></h3>
                                    <hr />
                                </CardBody>

                            </Card>
                        </Col>
                    </Row>
                    <Row style={{ justifyContent: "center" }} className="text-center">
                        <Col lg="6">
                            <Card className="card-raised card-white">
                                <CardHeader>
                                    <CardTitle>
                                        <h3><strong>Agent's Top 5 Dealerships</strong></h3>
                                        <hr />
                                    </CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Label>Agent</Label>
                                    <Select
                                        options={this.state.agents}
                                        value={this.state.selected_agent}
                                        onChange={(e) => {
                                            this.setState({ selected_agent: e })
                                            this.getAgentTop5(e)
                                        }}
                                    />
                                    <hr hidden={this.state.selected_agent.label.length < 1} />
                                    <Table hidden={this.state.selected_agent.label.length < 1}>
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Dealership Name</th>
                                                <th>Count</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.agent_top_5.map((d, i) => {

                                                if (i > 9) return null;
                                                return (
                                                    <tr key={i}>
                                                        <td>{i + 1}</td>
                                                        <td>{d[0]}</td>
                                                        <td>{d[1]}</td>
                                                    </tr>

                                                )
                                            })}
                                        </tbody>
                                    </Table>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </>
        );
    }
}

export default AdminDashboard;
