import React from "react";
// reactstrap components
import {
    Button,
    Card,
    CardImg,
    Container,
    CardBody,
    Row,
    Col,
    Table,

} from "reactstrap";
import Select from 'react-select'
class Justin extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            dealerships: [],
            selected_dealership: null,
            todayCount: 0,
            tomorrowCount: 0,
            dayAfterTomorrowCount: 0,
            todayAppts: [],
            tomorrowAppts: [],
            dayAfterTomorrowAppts: [],
            todayShowHide: "Show",
            tomorrowShowHide: "Show",
            dayAfterTomrorowShowHide: "Show"

        }


        this.getCount = this.getCount.bind(this)
        this._isMounted = false
    }
    async componentWillMount() {
        this._isMounted = true
        this._isMounted && this.setState({ loading: true })
        let dealerships = this._isMounted && await this.props.mongo.find("dealerships", { isActive: true, isService: true })
        dealerships.sort((a, b) => {
            if (a.label > b.label) return 1;
            if (a.label < b.label) return -1;
            return 0;
        })
        this._isMounted && this.setState({ loading: false, dealerships })
    }
    componentDidMount() {
        this._isMounted = true
    }
    componentWillUnmount() {
        this._isMounted = false
    }
    async getCount() {
        this._isMounted && await this.setState({ loading: true, todayAppts: [], tomorrowAppts: [], dayAfterTomorrowAppts: [] })
        let dealer_appts = await this.props.mongo.find("all_appointments", { dealership_department: "Service", "dealership.value": this.state.selected_dealership.value })
        let agents = await this.props.mongo.find("agents", { department: "service" })
        for (let a in agents) {
            for (let b in agents[a].appointments) {
                if (agents[a].appointments[b].dealership.value === this.state.selected_dealership.value) {
                    dealer_appts.push(agents[a].appointments[b])
                }
            }
        }

        let today = new Date();
        let tomorrow = new Date(new Date().setDate(new Date().getDate() + 1))
        let dayAfterTomorrow = new Date(new Date().setDate(new Date().getDate() + 2))

        let todayCount = 0;
        let tomorrowCount = 0;
        let dayAfterTomorrowCount = 0;

        for (let a in dealer_appts) {
            let app_date = new Date(dealer_appts[a].appointment_date)
            let app_month = app_date.getMonth()
            let app_day = app_date.getDate();

            if (app_month === today.getMonth() && app_day === today.getDate()) {
                let todayAppts = this.state.todayAppts;
                todayAppts.push(dealer_appts[a])
                this.setState({ todayAppts })
                todayCount++;
            }
            else if (app_month === tomorrow.getMonth() && app_day === tomorrow.getDate()) {
                let tomorrowAppts = this.state.tomorrowAppts;
                tomorrowAppts.push(dealer_appts[a])
                this.setState({ tomorrowAppts })
                tomorrowCount++;
            }
            else if (app_month === dayAfterTomorrow.getMonth() && app_day === dayAfterTomorrow.getDate()) {
                let dayAfterTomorrowAppts = this.state.dayAfterTomorrowAppts;
                dayAfterTomorrowAppts.push(dealer_appts[a])
                this.setState({ dayAfterTomorrowAppts })
                dayAfterTomorrowCount++;
            }
        }
        this._isMounted && this.setState({ todayCount, tomorrowCount, dayAfterTomorrowCount, loading: false })

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
            <div className="content">
                <Container>
                    <Row>
                        <Col className="ml-auto mr-auto text-center" md="8">
                            <Card style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                <CardBody>
                                    <p className="text-white">Select Dealership</p>
                                    <Select
                                        options={this.state.dealerships.map((d) => {
                                            return { label: d.label, value: d._id }
                                        })}
                                        value={this.state.selected_dealership}
                                        onChange={async (e) => {
                                            await this.setState({ selected_dealership: e, todayShowHide: "Show", tomorrowShowHide: "Show", dayAfterTomrorowShowHide: "Show" });
                                            this.getCount()
                                        }}
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row hidden={this.state.selected_dealership === null}>
                        <Col className="ml-auto mr-auto text-center" md="8">
                            <Card style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                <CardBody>
                                    <Table>
                                        <thead>
                                            <tr>
                                                <th><p className="text-white">{new Date().toLocaleDateString()}</p></th>
                                                <th><p className="text-white">{new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleDateString()}</p></th>
                                                <th><p className="text-white">{new Date(new Date().setDate(new Date().getDate() + 2)).toLocaleDateString()}</p></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <p className="text-white">{this.state.todayCount}</p>
                                                    <Button onClick={(e) => {
                                                        this.state.todayShowHide === "Show" ? this.setState({ todayShowHide: "Hide" }) : this.setState({ todayShowHide: "Show" })
                                                    }}>{this.state.todayShowHide}</Button>
                                                </td>
                                                <td>
                                                    <p className="text-white">{this.state.tomorrowCount}</p>
                                                    <Button onClick={(e) => {
                                                        this.state.tomorrowShowHide === "Show" ? this.setState({ tomorrowShowHide: "Hide" }) : this.setState({ tomorrowShowHide: "Show" })
                                                    }}>{this.state.tomorrowShowHide}</Button>
                                                </td>
                                                <td>
                                                    <p className="text-white">{this.state.dayAfterTomorrowCount}</p>
                                                    <Button onClick={(e) => {
                                                        this.state.dayAfterTomrorowShowHide === "Show" ? this.setState({ dayAfterTomrorowShowHide: "Hide" }) : this.setState({ dayAfterTomrorowShowHide: "Show" })
                                                    }}>{this.state.dayAfterTomrorowShowHide}</Button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row hidden={this.state.selected_dealership === null || (this.state.todayShowHide === "Show" && this.state.tomorrowShowHide === "Show" && this.state.dayAfterTomrorowShowHide === "Show")}>
                        <Col className="ml-auto mr-auto text-center" md="8">
                            <Card style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                <CardBody>
                                    <Row>
                                        <Col md="4" hidden={this.state.todayShowHide === "Show"}>
                                            <h3 className="text-white">Appts Scheduled for Today</h3>
                                            {this.state.todayAppts.map((a, i) => {
                                                return (
                                                    <Card key={i} >
                                                        <p style={{ whiteSpace: "pre-wrap" }} >{a.internal_msg}</p>
                                                    </Card>)
                                            })}
                                        </Col>
                                        <Col md="4" hidden={this.state.tomorrowShowHide === "Show"}>
                                            <h3 className="text-white">Appts Scheduled for Tomorrow</h3>
                                            {this.state.tomorrowAppts.map((a, i) => {
                                                return (
                                                    <Card key={i} >
                                                        <p style={{ whiteSpace: "pre-wrap" }} >{a.internal_msg}</p>
                                                    </Card>)
                                            })}
                                        </Col>
                                        <Col md="4" hidden={this.state.dayAfterTomrorowShowHide === "Show"}>
                                            <h3 className="text-white">Appts Scheduled for Day After Tomorrow</h3>
                                            {this.state.dayAfterTomorrowAppts.map((a, i) => {
                                                return (
                                                    <Card key={i} >
                                                        <p style={{ whiteSpace: "pre-wrap" }} >{a.internal_msg}</p>
                                                    </Card>)
                                            })}
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card></Col>

                    </Row>

                </Container>
            </div>
        );
    }
}

export default Justin;