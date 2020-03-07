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
            selected_date: null,
            times: []
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
        extensions.sort((a, b) => {
            if (a.name > b.name) return 1;
            if (a.name < b.name) return -1
            return 0
        })
        return extensions
    }
    async getTimes() {
        this.setState({ timesLoading: true })
        let times = await this.props.mongo.find("timesheet", { day: new Date(new Date(this.state.selected_date).setHours(0, 0, 0, 0)).toISOString() })
        await times.sort((a, b) => {
            if (a.name > b.name) return 1;
            if (a.name < b.name) return -1;
            return 0
        })
        this.setState({ times })
        this.setState({ timesLoading: false })
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
                                    <p className="text-white text-center" hidden={!this.state.timesLoading}>Still Loading</p>
                                </CardHeader>
                                <CardBody>
                                    <Card>
                                        <ReactDateTime
                                            timeFormat={false}
                                            value={this.state.selected_date}
                                            onChange={(e) => { this.setState({ times: [], selected_date: new Date(new Date(e).setHours(0, 0, 0, 0)) }) }}
                                        />
                                    </Card>
                                    <Button
                                        disabled={this.state.selected_date === null || this.state.timesLoading}
                                        onClick={() => { this.getTimes() }}>See Times
                                    </Button>
                                    <Button
                                        className='float-left'
                                        hidden={this.state.times.length < 1}
                                        onClick={async () => {
                                            await this.setState({ results: [], selected_date: new Date(new Date(this.state.selected_date).getTime() - (1000 * 3600 * 24)) })
                                            await this.getTimes()
                                        }}

                                    >
                                        Previous Day
                                        </Button>
                                    <Button
                                        className="float-right"
                                        hidden={this.state.times.length < 1}
                                        onClick={async () => {
                                            await this.setState({ results: [], selected_date: new Date(new Date(this.state.selected_date).getTime() + (1000 * 3600 * 24)) })
                                            await this.getTimes()
                                        }}

                                    >
                                        Next Day
                                        </Button>
                                    <Table hidden={this.state.times.length < 1}>
                                        <thead>
                                            <tr >
                                                <th style={{borderBottom: "1px solid white"}}><p className="text-white text-center">Name</p></th>
                                                <th style={{borderBottom: "1px solid white"}}><p className="text-white text-center">Date</p></th>
                                                <th style={{borderBottom: "1px solid white"}}><p className="text-white text-center">Start Time</p></th>
                                                <th style={{borderBottom: "1px solid white"}}><p className="text-white text-center">End Time</p></th>
                                                <th style={{borderBottom: "1px solid white"}}><p className="text-white text-center">Hours Worked</p></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.times.map((t, i) => {
                                                    return (
                                                        <tr key={i}>
                                                            <td style={{borderBottom: "1px solid white"}}><p className="text-white text-center">{t.name}</p></td>
                                                            <td style={{borderBottom: "1px solid white"}}><p className="text-white text-center">{new Date(this.state.selected_date).toLocaleDateString()}</p></td>
                                                            <td style={{borderBottom: "1px solid white"}}><p className="text-white text-center">{new Date(t.start).toLocaleTimeString()}</p></td>
                                                            <td style={{borderBottom: "1px solid white"}}><p className="text-white text-center">{new Date(t.end).toLocaleTimeString()}</p></td>
                                                            <td style={{borderBottom: "1px solid white"}}><p className="text-white text-center">{Math.round(100 * (new Date(t.end).getTime() - new Date(t.start) - (1000 * 3600)) / (1000 * 3600)) / 100}</p></td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </Table>
                                    <Button
                                        className='float-left'
                                        hidden={this.state.times.length < 1}
                                        onClick={async () => {
                                            await this.setState({ results: [], selected_date: new Date(new Date(this.state.selected_date).getTime() - (1000 * 3600 * 24)) })
                                            await this.getTimes()
                                        }}

                                    >
                                        Previous Day
                                        </Button>
                                    <Button
                                        className="float-right"
                                        hidden={this.state.times.length < 1}
                                        onClick={async () => {
                                            await this.setState({ results: [], selected_date: new Date(new Date(this.state.selected_date).getTime() + (1000 * 3600 * 24)) })
                                            await this.getTimes()
                                        }}

                                    >
                                        Next Day
                                        </Button>
                                </CardBody>

                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default Times;