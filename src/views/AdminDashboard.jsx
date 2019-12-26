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
            agent_top_5: [],
            total: [],
            top10Loading: false,
            lastAppsLoading: false,
            agent5Loading: false
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
        this._isMounted && this.getTodayAppts();
        let dealerships = this._isMounted && await this.props.mongo.find("dealerships", { isActive: true });
        let agents = this._isMounted && await this.props.mongo.find("agents_no_appts")
        for (let a in agents) {
            agents[a].label = agents[a].name;
            agents[a].value = agents[a]._id
        }
        agents.sort((a, b) => {
            if (a.name > b.name) return 1;
            if (a.name < b.name) return -1;
            return 0;
        })
        this._isMounted && this.setState({ dealerships, agents });
        this._isMounted && this.sortLastAppts();
        this._isMounted && this.getTop10();
        this._isMounted && this.setState({ loading: false });
    }
    componentWillUnmount() {
        this._isMounted = false
    }
    async sortLastAppts() {
        console.log(new Date())
        this.setState({ lastAppsLoading: true })
        let last_appts = [];
        let appointments = this._isMounted && await this.props.mongo.find("appointments")
        let dealervals = this._isMounted && await this.state.dealerships.map((d)=>{
            return d.value
        })
        for (let a in appointments) {
            let found = this._isMounted && dealervals.indexOf(appointments[a].dealership) !== -1 && appointments[a].appointments[0] !== undefined;
            // for (let d in this.state.dealerships) {
            //     if (appointments[a].dealership === this.state.dealerships[d].value && appointments[a].appointments.length > 0) {
            //         found = true;
            //         break;
            //     }
            // }
            if (found) {
                last_appts.push({
                    dealership: appointments[a].dealership,
                    time_elapsed_hrs: Math.round(new Date(new Date().getTime() - new Date(appointments[a].appointments[0].verified).getTime()).getTime() / 3600000 * 10) / 10
                });
            }
            else {
                if (found) {
                    last_appts.push({
                        dealership: appointments[a].dealership.label,
                        time_elapsed_hrs: 1000
                    });
                }

            }
        }
        this._isMounted && await last_appts.sort((a, b) => {
            if (a.time_elapsed_hrs < b.time_elapsed_hrs) return 1;
            if (a.time_elapsed_hrs > b.time_elapsed_hrs) return -1;
            return 0;
        })
        this._isMounted && await this.setState({ last_appts, lastAppsLoading: false })
        console.log(new Date())
    }
    async getTodayAppts() {
        let metrics = this._isMounted && await this.props.mongo.findOne("admin_dashboard", { label: "centralbdc_metrics" })
        let lifetime_appts = metrics.total_lifetime;
        let month_appts = metrics.total_mtd;
        let today_appts = metrics.total_today;
        this._isMounted && this.setState({ lifetime_appts, month_appts, today_appts: today_appts })
    }
    async getTop10() {
        this.setState({ top10Loading: true })
        let agents = this._isMounted && await this.props.mongo.find("agents");
        let today_appts = [];
        for (let a in agents) {
            for (let b in agents[a].appointments) {
                today_appts.push(agents[a].appointments[b])
            }
        }

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
        this._isMounted && this.setState({ top10: sortable, top10Loading: false })
    }
    async getAgentTop5(agent) {
        //get appointments for selected agent..
        this._isMounted && this.setState({ agent5Loading: true })
        let agent_appts = this._isMounted && await this.props.mongo.find("all_appointments", { agent_id: agent._id })
        let dealer_counts = {}
        let active;
        for (let a in agent_appts) {
            active = false;
            for (let d in this.state.dealerships) {
                if (this.state.dealerships[d].value === agent_appts[a].dealership.value) {
                    active = this.state.dealerships[d].isActive;
                    break;
                }
            }
            if (dealer_counts[agent_appts[a].dealership.label] !== undefined && active) {
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
        this._isMounted && this.setState({ agent_top_5: sortable, agent5Loading: false })

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
                        <Col lg="6">
                            <Card className="card-raised card-white blur">
                                <CardHeader>
                                    <CardTitle >
                                        <h3><strong>Top 10 Stale Dealerships</strong></h3>
                                        <hr />
                                    </CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <CardImg hidden={!this.state.lastAppsLoading} top width="100%" src={this.props.utils.loading} />

                                    <Table hidden={this.state.lastAppsLoading}>
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
                                                            <td>
                                                                <p style={{ color: "red" }} hidden={a.time_elapsed_hrs < 1}>{dealership_name}</p>
                                                                <p hidden={a.time_elapsed_hrs >= 1}>{dealership_name}</p>
                                                            </td>
                                                            <td >
                                                                <p style={{ color: "red" }} hidden={a.time_elapsed_hrs < 1}>{a.time_elapsed_hrs + " hours"}</p>
                                                                <p hidden={a.time_elapsed_hrs >= 1}>{a.time_elapsed_hrs + " hours"}</p>
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
                        <Col lg="6">
                            <Card className="card-raised card-white">
                                <CardHeader>
                                    <CardTitle>
                                        <h3><strong>Top 10 Agents Today</strong></h3>
                                        <hr />
                                    </CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <CardImg hidden={!this.state.top10Loading} top width="100%" src={this.props.utils.loading} />

                                    <Table hidden={this.state.top10Loading}>
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
                                                        <td><p>{i + 1}</p></td>
                                                        <td><p hidden></p><p>{name}</p></td>
                                                        <td>{a[1]}</td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </Table>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row style={{ justifyContent: "center" }} className="text-center">
                        <Col lg="6" style={{ justifyContent: "center" }} className="text-center">
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
                                    <CardImg hidden={!this.state.agent5Loading} top width="100%" src={this.props.utils.loading} />

                                    <hr hidden={this.state.selected_agent.label.length < 1} />
                                    <Table hidden={this.state.selected_agent.label.length < 1 || this.state.agent5Loading}>
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Dealership Name</th>
                                                <th>Count</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.agent_top_5.map((d, i) => {

                                                if (i > 4) return null;
                                                let stale = false
                                                let stales = []
                                                for (let l in this.state.last_appts) {
                                                    if (l > 9) break;
                                                    let dealer = {};
                                                    for (let dealership in this.state.dealerships) {
                                                        if (this.state.dealerships[dealership].value === this.state.last_appts[l].dealership) {
                                                            stales.push(this.state.dealerships[dealership].label)
                                                            break;
                                                        }
                                                    }
                                                }
                                                if (stales.indexOf(d[0]) !== -1) {
                                                    stale = true;
                                                }
                                                return (
                                                    <tr key={i}>
                                                        <td>{i + 1}</td>
                                                        <td hidden={!stale}><p style={{ color: "red" }}>{d[0]}</p></td>
                                                        <td hidden={stale}><p>{d[0]}</p></td>
                                                        <td>{d[1]}</td>
                                                    </tr>

                                                )
                                            })}
                                        </tbody>
                                    </Table>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg="6">
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
                </div>
            </>
        );
    }
}

export default AdminDashboard;
