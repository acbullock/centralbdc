import React from "react";
// reactstrap components
import {
    Card,
    CardImg,
    Container,
    Row,
    Col,
    Table,
} from "reactstrap";
class DealershipPerformanceTiers extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            dealerships: [],
            appointments: [],
            agents: [],
            dealership1: [],
            dealership2: [],
            dealership3: [],
            dealership4: []
        }
        this._isMounted = false
        this.todayDealerCount = this.todayDealerCount.bind(this)
    }
    async componentWillMount() {
        this._isMounted = true
        this._isMounted && this.setState({ loading: true })
        let dealerships = this._isMounted && await this.props.mongo.find("dealerships", { isActive: true }, { projection: { goal: 1, label: 1, value: 1 } });

        // let appointments = this._isMounted && await this.props.mongo.find("appointments");
        // this.setState({appointments})
        this._isMounted && dealerships.sort((a, b) => {
            if (parseInt(a.goal) > parseInt(b.goal)) return -1;
            if (parseInt(a.goal) < parseInt(b.goal)) return 1;
            return 0;
        })
        let fourth = Math.round(dealerships.length / 4)
        let dealership1 = [];
        let dealership2 = [];
        let dealership3 = [];
        let dealership4 = [];
        for (let i = 0; i < dealerships.length; i++) {
            if (i < fourth) {
                dealership1.push(dealerships[i])
            }
            else if (i >= fourth && i < (2 * fourth)) {
                dealership2.push(dealerships[i])
            }
            else if (i >= (2 * fourth) && i < (3 * fourth)) {
                dealership3.push(dealerships[i])
            }
            else {
                dealership4.push(dealerships[i])
            }
        }
        this._isMounted && this.setState({ dealerships, dealership1, dealership2, dealership3, dealership4 })
        let apps = await this.props.mongo.find("all_appointments",
            {
                dealership_department: {
                    "$ne": "Service"
                },
                verified: {
                    "$gte": new Date(new Date().setHours(0, 0, 0, 0)).toISOString()
                }
            },
            {
                projection: {
                    goal: 1,
                    dealership: 1

                }
            })

        for (let d in dealerships) {
            this._isMounted && await this.todayDealerCount(dealerships[d], "dealerships", apps)
        }
        for (let d in dealership1) {
            this._isMounted && await this.todayDealerCount(dealership1[d], "dealership1", apps)
        }
        for (let d in dealership2) {
            this._isMounted && await this.todayDealerCount(dealership2[d], "dealership2", apps)
        }
        for (let d in dealership3) {
            this._isMounted && await this.todayDealerCount(dealership3[d], "dealership3", apps)
        }
        for (let d in dealership4) {
            this._isMounted && await this.todayDealerCount(dealership4[d], "dealership4", apps)
        }
        this._isMounted && this.setState({ loading: false })
    }
    componentDidMount() {
        this._isMounted = true
    }
    componentWillUnmount() {
        this._isMounted = false
    }
    async todayDealerCount(dealership, dealerships, appointments) {
        let apps = appointments.filter((a) => {
            return a.dealership === dealership.value
        });
        let dlr = this._isMounted && this.state[dealerships].map((d) => {
            if (d.value === dealership.value) {
                let progressValue = Math.round(apps.length * 10 / d.goal * 100) / 10;
                let progressColor = "red";
                if (progressValue > 33) {
                    progressColor = "#CCCC00"
                }
                if (progressValue >= 100) {
                    progressColor = "green"
                }
                let todayStart = new Date()
                todayStart.setHours(8, 0, 0, 0)

                let now = new Date();

                let elapsed = now.getTime() - todayStart.getTime()
                //if before 8am..
                if (elapsed < 0) {
                    elapsed = 0;
                }
                let hourlyRate = elapsed / (1000 * 60 * 60)
                hourlyRate = apps.length / hourlyRate
                let totalHrs = now.getDay() === 0 ? 8 : 12;
                let projection = Math.round(10 * hourlyRate * totalHrs) / 10


                return Object.assign(d, { totalCount: apps.length, progressValue, progressColor, projection: projection })
            }
            else {
                return d;
            }
        })
        this._isMounted && dlr.sort((a, b) => {
            if ((a.goal - a.projection) > (b.goal - b.projection)) return -1;
            if ((a.goal - a.projection) < (b.goal - b.projection)) return 1;
            return 0;
        })

        this._isMounted && this.setState({ [dealerships]: dlr });
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
                        <Col className="ml-auto mr-auto text-center" md="6">
                            <Card className="card-raised card-white">
                                <Table bordered striped responsive>
                                    <thead style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                        <tr>
                                            <th><p style={{ color: "white" }}>Progress</p></th>
                                            <th><p style={{ color: "white" }}>Name</p></th>
                                            <th><p style={{ color: "white" }}>Count</p></th>
                                            <th><p style={{ color: "white" }}>Goal</p></th>
                                            <th><p style={{ color: "white" }}>On Track</p></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this._isMounted && this.state.dealership1.map((d, i) => {
                                            return (
                                                <tr key={i}>
                                                    {/* <td ><Progress style={{ height: "25px", width: "150px", fontSize: "18px" }} animated value={d.progressValue} color={d.progressColor}><strong>{d.progressValue}%</strong></Progress></td> */}
                                                    <td ><p style={{ color: d.progressColor }}><strong>{d.progressValue}%</strong></p></td>
                                                    <td><p style={{ fontSize: "18px" }}>{d.label}</p></td>
                                                    <td><p style={{ fontSize: "18px" }}>{d.totalCount}</p></td>
                                                    <td><p style={{ fontSize: "18px" }}>{d.goal}</p></td>
                                                    <td><i style={{ fontSize: "24pt", fontWeight: "bolder", color: d.projection / d.goal >= .9 ? "green" : "red" }} className={d.projection / d.goal >= .9 ? "tim-icons icon-check-2" : "tim-icons icon-simple-remove"} /></td>
                                                </tr>
                                            );

                                        })}
                                    </tbody>
                                </Table>
                            </Card>
                        </Col>
                        <Col className="ml-auto mr-auto text-center" md="6">
                            <Card className="card-raised card-white">
                                <Table bordered striped responsive>
                                    <thead style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                        <tr>
                                            <th><p style={{ color: "white" }}>Progress</p></th>
                                            <th><p style={{ color: "white" }}>Name</p></th>
                                            <th><p style={{ color: "white" }}>Count</p></th>
                                            <th><p style={{ color: "white" }}>Goal</p></th>
                                            <th><p style={{ color: "white" }}>On Track</p></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this._isMounted && this.state.dealership2.map((d, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td ><p style={{ color: d.progressColor }}><strong>{d.progressValue}%</strong></p></td>
                                                    <td><p style={{ fontSize: "18px" }}>{d.label}</p></td>
                                                    <td><p style={{ fontSize: "18px" }}>{d.totalCount}</p></td>
                                                    <td><p style={{ fontSize: "18px" }}>{d.goal}</p></td>
                                                    <td><i style={{ fontSize: "24pt", fontWeight: "bolder", color: d.projection / d.goal >= .9 ? "green" : "red" }} className={d.projection / d.goal >= .9 ? "tim-icons icon-check-2" : "tim-icons icon-simple-remove"} /></td>
                                                </tr>
                                            );

                                        })}
                                    </tbody>
                                </Table>
                            </Card>
                        </Col>
                        <Col className="ml-auto mr-auto text-center" md="6">
                            <Card className="card-raised card-white">
                                <Table bordered striped responsive>
                                    <thead style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                        <tr>
                                            <th><p style={{ color: "white" }}>Progress</p></th>
                                            <th><p style={{ color: "white" }}>Name</p></th>
                                            <th><p style={{ color: "white" }}>Count</p></th>
                                            <th><p style={{ color: "white" }}>Goal</p></th>
                                            <th><p style={{ color: "white" }}>On Track</p></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this._isMounted && this.state.dealership3.map((d, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td><p style={{ color: d.progressColor }}><strong>{d.progressValue}%</strong></p></td>
                                                    {/* <td ><Progress style={{ height: "25px", width: "150px", fontSize: "18px" }} animated value={d.progressValue} color={d.progressColor}><strong>{d.progressValue}%</strong></Progress></td> */}
                                                    <td><p style={{ fontSize: "18px" }}>{d.label}</p></td>
                                                    <td><p style={{ fontSize: "18px" }}>{d.totalCount}</p></td>
                                                    <td><p style={{ fontSize: "18px" }}>{d.goal}</p></td>
                                                    <td><i style={{ fontSize: "24pt", fontWeight: "bolder", color: d.projection / d.goal >= .9 ? "green" : "red" }} className={d.projection / d.goal >= .9 ? "tim-icons icon-check-2" : "tim-icons icon-simple-remove"} /></td>
                                                </tr>
                                            );

                                        })}
                                    </tbody>
                                </Table>
                            </Card>
                        </Col>
                        <Col className="ml-auto mr-auto text-center" md="6">
                            <Card className="card-raised card-white">
                                <Table bordered striped responsive>
                                    <thead style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                        <tr>
                                            <th><p style={{ color: "white" }}>Progress</p></th>
                                            <th><p style={{ color: "white" }}>Name</p></th>
                                            <th><p style={{ color: "white" }}>Count</p></th>
                                            <th><p style={{ color: "white" }}>Goal</p></th>
                                            <th><p style={{ color: "white" }}>On Track</p></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this._isMounted && this.state.dealership4.map((d, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td><p style={{ color: d.progressColor }}><strong>{d.progressValue}%</strong></p></td>
                                                    {/* <td style={{ height: "75px", maxHeight: "75px" }}><Progress style={{ height: "25px", width: "150px", fontSize: "18px" }} animated value={d.progressValue} color={d.progressColor}><strong>{d.progressValue}%</strong></Progress></td> */}
                                                    <td ><p style={{ fontSize: "18px" }}>{d.label}</p></td>
                                                    <td ><p style={{ fontSize: "18px" }}>{d.totalCount}</p></td>
                                                    <td ><p style={{ fontSize: "18px" }}>{d.goal}</p></td>
                                                    <td ><i style={{ fontSize: "24pt", fontWeight: "bolder", color: d.projection / d.goal >= .9 ? "green" : "red" }} className={d.projection / d.goal >= .9 ? "tim-icons icon-check-2" : "tim-icons icon-simple-remove"} /></td>
                                                </tr>
                                            );

                                        })}
                                    </tbody>
                                </Table>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default DealershipPerformanceTiers;