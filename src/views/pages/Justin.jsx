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
    Modal,
    ModalHeader,
    ModalBody,
    Input,
    FormGroup,
    Form,
    Tooltip,
    InputGroup
} from "reactstrap";
import Select from 'react-select'
import ReactDateTime from "react-datetime";
class Justin extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            dealerships: [],
            selected_dealership: null,
            todayCount: 0,
            tomorrowCount: 0,
            dayAfterTomorrowCount: 0

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
        this._isMounted && this.setState({ loading: true })
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
                console.log(dealer_appts[a].customer_phone)
                todayCount++;
            }
            else if (app_month === tomorrow.getMonth() && app_day === tomorrow.getDate()) {
                tomorrowCount++;
            }
            else if (app_month === dayAfterTomorrow.getMonth() && app_day === dayAfterTomorrow.getDate()) {
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
                                            await this.setState({ selected_dealership: e });
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
                                                <td><p className="text-white">{this.state.todayCount}</p></td>
                                                <td><p className="text-white">{this.state.tomorrowCount}</p></td>
                                                <td><p className="text-white">{this.state.dayAfterTomorrowCount}</p></td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default Justin;