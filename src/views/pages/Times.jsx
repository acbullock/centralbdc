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
    Collapse,
    CardHeader,
    Table

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
            timesheet: [],
            names: [],
            totals: [],
            opens: [],
            selected_name: null,
            all_agents: false
        }
        this.getTimes = this.getTimes.bind(this)
        this.getAllTimes = this.getAllTimes.bind(this)
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
        this.setState({ extensions })
        return extensions


    }
    async getTimes() {
        this.setState({ timesLoading: true })
        let timesheet = await this.props.mongo.aggregate("timesheet", [
            {
                "$match": {
                    name: this.state.selected_name.label,
                    day: {
                        "$gte": this.state.from_date,
                        "$lte": this.state.to_date
                    }
                }
            },
            {
                "$sort": {
                    "name": 1,
                    "day": 1
                }
            }
        ])
        let totals = await this.props.mongo.aggregate("timesheet", [
            {
                "$match": {
                    name: this.state.selected_name.label,
                    day: {
                        "$gte": this.state.from_date,
                        "$lte": this.state.to_date
                    }
                }
            },
            {
                "$group": {
                    "_id": "$name",
                    "count": {
                        "$sum": "$hoursWorked"
                    }
                }
            },
            {
                "$sort": {
                    "_id": 1
                }
            }
        ])
        this.setState({ timesheet, totals, timesLoading: false })
    }
    async getAllTimes() {
        this.setState({ timesLoading: true })
        let timesheet = await this.props.mongo.aggregate("timesheet", [
            {
                "$match": {
                    day: {
                        "$gte": this.state.from_date,
                        "$lte": this.state.to_date
                    }
                }
            },
            {
                "$sort": {
                    "name": 1,
                    "day": 1
                }
            }
        ])
        let totals = await this.props.mongo.aggregate("timesheet", [
            {
                "$match": {
                    day: {
                        "$gte": this.state.from_date,
                        "$lte": this.state.to_date
                    }
                }
            },
            {
                "$group": {
                    "_id": "$name",
                    "count": {
                        "$sum": "$hoursWorked"
                    }
                }
            },
            {
                "$sort": {
                    "_id": 1
                }
            }
        ])

        let opens = {}
        for (let t in totals) {
            opens[totals[t]._id] = false
        }
        this.setState({ timesheet, totals, opens, timesLoading: false })
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
                                    <p className="text-white text-left">Agent Name:{this.state.selected_name ? this.state.selected_name.label : null}</p>
                                    <Select
                                        options={this.state.names}
                                        value={this.state.selected_name}
                                        onChange={(e) => { this.setState({ timesheet: [], selected_name: e }) }}
                                        isDisabled={this.state.all_agents}
                                    />
                                    <br />
                                    <p className="text-white text-left">
                                        <input
                                            type="checkbox"
                                            checked={this.state.all_agents}
                                            onChange={() => { this.setState({ timesheet: [], all_agents: !this.state.all_agents }) }}
                                        /> All Agents</p>
                                    <br />
                                    <p className="text-white text-left">From:</p>
                                    <Card>
                                        <ReactDateTime
                                            isValidDate={(sel) => {
                                                return new Date(sel).getTime() > new Date(new Date(new Date(new Date().setFullYear(2019)).setMonth(2)).setDate(30)).getTime()
                                            }}
                                            timeFormat={false}
                                            value={this.state.selected_date}
                                            onChange={(e) => { this.setState({ timesheet: [], from_date: new Date(new Date(e).setHours(0, 0, 0, 0)) }) }}
                                        />
                                    </Card>
                                    <p className="text-white text-left">To:</p>
                                    <Card>
                                        <ReactDateTime
                                            isValidDate={(sel) => {
                                                return new Date(sel).getTime() > new Date(new Date(new Date(new Date().setFullYear(2019)).setMonth(2)).setDate(30)).getTime()
                                            }}
                                            timeFormat={false}
                                            value={this.state.to_date}
                                            onChange={(e) => { this.setState({ timesheet: [], to_date: new Date(new Date(e).setHours(0, 0, 0, 0)) }) }}
                                        />
                                    </Card>
                                    <Button
                                        disabled={this.state.from_date === null || this.state.to_date === null || this.state.timesLoading || (!this.state.all_agents && !this.state.selected_name)}
                                        onClick={() => { this.state.all_agents ? this.getAllTimes() : this.getTimes() }}>See Times
                                    </Button>
                                    <br />
                                    <br />
                                    {
                                        this.state.totals.map((t, i) => {
                                            return (
                                                <div key={i}>
                                                    <hr style={{ borderBottom: "white solid 1px" }} />
                                                    <p className="text-white text-center" style={{ cursor: "pointer" }} onClick={() => {
                                                        let opens = this.state.opens;
                                                        opens[t._id] = !opens[t._id]
                                                        this.setState({ opens })
                                                    }}><strong>{t._id}</strong>{`\t`}{Math.round(1000 * t.count) / 1000} Hours</p>

                                                    <Collapse isOpen={this.state.opens[t._id]} >
                                                        <Card color="transparent">
                                                            <CardBody>
                                                                <Table>
                                                                    <thead>
                                                                        <tr>
                                                                            <th style={{ borderBottom: "white solid 1px" }}><p className="text-white text-center">Name</p></th>
                                                                            <th style={{ borderBottom: "white solid 1px" }}><p className="text-white text-center">Day</p></th>
                                                                            <th style={{ borderBottom: "white solid 1px" }}><p className="text-white text-center">In</p></th>
                                                                            <th style={{ borderBottom: "white solid 1px" }}><p className="text-white text-center">Out</p></th>
                                                                            <th style={{ borderBottom: "white solid 1px" }}><p className="text-white text-center">Hours</p></th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>

                                                                        {this.state.timesheet.map((cur, ind) => {
                                                                            if (cur.name !== t._id) return null
                                                                            return (
                                                                                <tr key={ind}>
                                                                                    <td style={{ borderBottom: "white solid 1px" }}><p className="text-white text-center">{cur.name}</p></td>
                                                                                    <td style={{ borderBottom: "white solid 1px" }}><p className="text-white text-center">{new Date(cur.day).toLocaleDateString()}</p></td>
                                                                                    <td style={{ borderBottom: "white solid 1px" }}><p className="text-white text-center">{new Date(cur.start).toLocaleTimeString()}</p></td>
                                                                                    <td style={{ borderBottom: "white solid 1px" }}><p className="text-white text-center">{new Date(cur.end).toLocaleTimeString()}</p></td>
                                                                                    <td style={{ borderBottom: "white solid 1px" }}><p className="text-white text-center">{Math.round(1000 * cur.hoursWorked) / 1000}</p></td>
                                                                                </tr>
                                                                            )
                                                                        })}

                                                                    </tbody>
                                                                </Table>
                                                            </CardBody>
                                                        </Card>

                                                    </Collapse>
                                                    <hr style={{ borderBottom: "white solid 1px" }} />
                                                    <br />
                                                </div>
                                            )
                                        })
                                    }

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