import React from "react";
// reactstrap components
import {
    Button,
    Label,
    Card,
    CardImg,
    Container,
    CardBody,
    Row,
    Col,
    Table,
    Progress,
    Modal,
    ModalHeader,
    ModalBody,
    Input,
    FormGroup,
    Form
} from "reactstrap";
import Select from 'react-select'

class DealershipPerformance extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            dealerships: [],
            appointments: [],
            agents: []
        }
        this._isMounted = false
        this.todayDealerCount = this.todayDealerCount.bind(this)
    }
    async componentWillMount() {
        console.log(new Date())
        this._isMounted = true
        this.setState({ loading: true })
        let dealerships = this._isMounted && await this.props.mongo.find("dealerships");
        // let appointments = this._isMounted && await this.props.mongo.find("appointments");
        let agents = this._isMounted && await this.props.mongo.find("agents");
        // this.setState({appointments})
        this.setState({ agents })
        dealerships = dealerships.filter((d) => { return d.isActive === true })
        dealerships.sort((a, b) => {
            if (parseInt(a.goal) > parseInt(b.goal)) return -1;
            if (parseInt(a.goal) < parseInt(b.goal)) return 1;
            return 0;
        })
        this.setState({ dealerships })

        for (let d in dealerships) {
            this._isMounted && await this.todayDealerCount(dealerships[d])
        }
        console.log(new Date())
        this.setState({ loading: false })
    }
    componentDidMount() {
        this._isMounted = true
    }
    componentWillUnmount() {
        this._isMounted = false
    }
    async todayDealerCount(dealership) {
        let apps = [];
        for (let a in this.state.agents) {
            for (let b in this.state.agents[a].appointments) {
                if (this.state.agents[a].appointments[b].dealership.value === dealership.value) {
                    apps.push(this.state.agents[a].appointments[b])
                }
            }
        }
        let dlr = this.state.dealerships.map((d) => {
            if (d.value === dealership.value) {
                let progressValue = Math.round(apps.length * 10 / d.goal * 100) / 10;
                let progressColor = "red";
                if (progressValue > 33) {
                    progressColor = "yellow"
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
                let projection = Math.round(10* hourlyRate * totalHrs)/10



                return Object.assign(d, { totalCount: apps.length, progressValue, progressColor, projection: projection })
            }
            else {
                return d;
            }
        })
        dlr.sort((a, b) => {
            if (a.progressValue > b.progressValue) return 1;
            if (a.progressValue < b.progressValue) return -1;
            return 0;
        })
        this.setState({ dealerships: dlr });
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
                            <legend>Daily Dealership Goals</legend>
                            <Card className="card-raised card-white">
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>Progress</th>
                                            <th>Dealership Name</th>
                                            <th>Today's Appointment Count</th>
                                            <th>Dealership Goal</th>
                                            <th>On Track</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.dealerships.map((d, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td><Progress value={d.progressValue} color={d.progressColor}><strong>{d.progressValue}%</strong></Progress></td>
                                                    <td>{d.label}</td>
                                                    <td>{d.totalCount}</td>
                                                    <td>{d.goal}</td>
                                            <td><i style={{color:d.projection >= d.goal ? "green": "red"}} className={d.projection >= d.goal ? "tim-icons icon-check-2": "tim-icons icon-simple-remove"}/></td>
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

export default DealershipPerformance;