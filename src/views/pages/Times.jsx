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
    CardHeader

} from "reactstrap";
import Select from 'react-select'
import axios from "axios"
import ReactDateTime from "react-datetime";
class Times extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            timesLoading: false,
            extensions: [],
            from_date: null,
            to_date: null,
            times: [],
            names: [],
            selected_name: null
        }
        this.getTimes = this.getTimes.bind(this)
        this.getExtensions = this.getExtensions.bind(this)
        this._isMounted = false
        this.SERVER = "https://guarded-castle-33109.herokuapp.com";
        this.RING_CENTRAL = "https://platform.ringcentral.com/restapi/v1.0";
    }
    async componentDidMount() {
        this._isMounted && this.setState({ loading: true })
        this._isMounted && this.setState({ loading: false })
    }
    async componentWillMount() {
        this._isMounted = true
        let user = this.props.mongo.getActiveUser(this.props.mongo.mongodb)
        let agent = await this.props.mongo.findOne("agents", { userId: user.userId }, { projection: { account_type: 1 } })
        if (agent.account_type !== "admin") {
            this.props.history.push("/admin/dashboard")
            return;
        }
        let names = this._isMounted && await this.props.mongo.aggregate("timesheet", [
            {
                "$group": {
                    "_id": "$name",
                    "label": {
                        "$first": "$name"
                    },
                    "value": {
                        "$first": "$name"
                    }
                }
            },
            {
                "$sort": {
                    "label": 1
                }
            }
        ]);
        this._isMounted && await this.setState({ names })

    }
    componentWillUnmount() {
        this._isMounted = false
    }
    timeout(ms) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, ms);
        })
    }
    async getExtensions() {
        let token = await axios.post(`${this.SERVER}/findOne`, { collection: "utils", query: { _id: "5e583450576f3ada786de3c2" } })
        token = token.data.voice_token;

        let url = `${this.RING_CENTRAL}/account/~/extension?access_token=${token}&perPage=1000`
        let records = await axios.get(url)
        records = records.data.records;
        let extensions = records.map((r) => { return { id: r.id, name: r.name, value: r.id, label: r.name } })
        await extensions.sort((a, b) => {
            if (a.name > b.name) return 1;
            if (a.name < b.name) return -1
            return 0
        })
        extensions = await extensions.filter((e) => {
            if (e.name == undefined) return false
            return e.name != "Amanda Schwartzmeyer" && e.name !== "Benjamin Shamsizadeh" && e.name !== "Alex Test" && e.name !== "ALL EMPLOYEES" && e.name.indexOf("S ") !== 0 && e.name.indexOf("D ") !== 0 && e.name.indexOf("Z ") !== 0
        })
        this.setState({ extensions })
        return extensions


    }
    async getTimes() {
        this.setState({ timesLoading: true })
        let times = await this.props.mongo.aggregate("timesheet", [
            {
                "$match": {
                    "name": this.state.selected_name.label,
                    "start": {
                        "$gte": new Date(new Date(this.state.from_date).setHours(0, 0, 0, 0)).toISOString(),
                        "$lte": new Date(new Date(this.state.to_date).setHours(23, 59, 59, 999)).toISOString()
                    }
                }
            },
            {
                "$group": {
                    "_id": "$name",
                    "name": { "$first": "$name" },
                    "hoursWorked": {
                        "$sum": "$hoursWorked"
                    }
                }
            }
        ])
        this.setState({ times, timesLoading: false })
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
                                <CardHeader>
                                    <h3 className="text-white text-center">Generate Timesheet</h3>
                                    <p className="text-white text-center" hidden={!this.state.timesLoading}>Still Loading</p>
                                </CardHeader>
                                <CardBody>
                                    <p className="text-white text-left">Agent Name:</p>
                                    <Select
                                        options={this.state.names}
                                        value={this.state.selected_name}
                                        onChange={(e) => { this.setState({ selected_name: e }) }}
                                    />
                                    <br />
                                    <p className="text-white text-left">From:</p>
                                    <Card>
                                        <ReactDateTime
                                            isValidDate={(sel) => {
                                                return new Date(sel).getTime() > new Date(new Date(new Date(new Date().setFullYear(2019)).setMonth(8)).setDate(30)).getTime()
                                            }}
                                            timeFormat={false}
                                            value={this.state.selected_date}
                                            onChange={(e) => { this.setState({ times: [], from_date: new Date(new Date(e).setHours(0, 0, 0, 0)) }) }}
                                        />
                                    </Card>
                                    <p className="text-white text-left">To:</p>
                                    <Card>
                                        <ReactDateTime
                                            isValidDate={(sel) => {
                                                return new Date(sel).getTime() > new Date(new Date(new Date(new Date().setFullYear(2019)).setMonth(8)).setDate(30)).getTime()
                                            }}
                                            timeFormat={false}
                                            value={this.state.to_date}
                                            onChange={(e) => { this.setState({ times: [], to_date: new Date(new Date(e).setHours(0, 0, 0, 0)) }) }}
                                        />
                                    </Card>
                                    <Button
                                        disabled={this.state.from_date === null || this.state.to_date === null || this.state.timesLoading}
                                        onClick={() => { this.getTimes() }}>See Times
                                    </Button>
                                    <Table hidden={this.state.times.length < 1}>
                                        <thead>
                                            <tr >
                                                <th style={{ borderBottom: "1px solid white" }}><p className="text-white text-center">Name</p></th>
                                                <th style={{ borderBottom: "1px solid white" }}><p className="text-white text-center">Hours Worked</p></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.times.map((t, i) => {
                                                    return (
                                                        <tr key={i}>
                                                            <td style={{ borderBottom: "1px solid white" }}><p className="text-white text-center">{t.name}</p></td>
                                                            <td style={{ borderBottom: "1px solid white" }}><p className="text-white text-center">{Math.round(100 * t.hoursWorked) / 100}</p></td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </Table>
                                </CardBody>

                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div >
        );
    }
}

export default Times;