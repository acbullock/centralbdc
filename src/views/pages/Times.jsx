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
        this.SERVER = "http://guarded-castle-33109.herokuapp.com";
        this.RING_CENTRAL = "https://platform.ringcentral.com/restapi/v1.0";
    }
    async componentDidMount() {
        this._isMounted && this.setState({ loading: true })
        this._isMounted && this.setState({ loading: false })
    }
    componentWillMount() {
        this._isMounted = true
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
        //get Extensions..
        let extensions = await this.getExtensions()
        extensions = extensions.filter((a) => {
            return a.name.indexOf("S ") !== 0 && a.name.indexOf("D ") !== 0 && a.name.indexOf("Z ") !== 0
        })
        this.setState({ extensions })
        let day = new Date(this.state.selected_date).toISOString()
        let nextDay = new Date(this.state.selected_date).getTime() + (1000 * 3600 * 24)
        nextDay = new Date(nextDay).toISOString()
        let results = []
        let token_ids = ["5df2b825f195a16a1dbd4bf5", "5e583450576f3ada786de3c2", "5e5835a4576f3ada786de3c3"]
        for (let ext in extensions) {
            await this.timeout(2000)
            let tokenIndex = ext % 3
            let token = await axios.post(`${this.SERVER}/findOne`, { collection: "utils", query: { _id: token_ids[tokenIndex] } })
            token = token.data.voice_token;

            //get Earliest and latest time for that user on that day..
            let url = `${this.RING_CENTRAL}/account/~/extension/${extensions[ext].id}/call-log?dateFrom=${day}&dateTo=${nextDay}&access_token=${token}&perPage=1000`
            let curRecords = await axios.get(url)
            curRecords = curRecords.data.records
            if (curRecords.length < 1) {
                continue;
            }
            let obj = {
                name: extensions[ext].name,
                start: new Date(curRecords[curRecords.length - 1].startTime).toISOString(),
                end: new Date(curRecords[0].startTime).toISOString()
            }
            await results.push(obj)
            this.setState({ times: results })

        }

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
                                            onChange={(e) => { this.setState({ selected_date: new Date(new Date(e).setHours(0, 0, 0, 0)) }) }}
                                        />
                                    </Card>
                                    <Button
                                        disabled={this.state.selected_date === null || this.state.timesLoading}
                                        onClick={() => { this.getTimes() }}>See Times
                                    </Button>
                                    <Table hidden={this.state.times.length < 1}>
                                        <thead>
                                            <tr>
                                                <th><p className="text-white text-center">Name</p></th>
                                                <th><p className="text-white text-center">Date</p></th>
                                                <th><p className="text-white text-center">Start Time</p></th>
                                                <th><p className="text-white text-center">End Time</p></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.times.map((t, i) => {
                                                    return (
                                                        <tr key={i}>
                                                            <td><p className="text-white text-center">{t.name}</p></td>
                                                            <td><p className="text-white text-center">{new Date(this.state.selected_date).toLocaleDateString()}</p></td>
                                                            <td><p className="text-white text-center">{new Date(t.start).toLocaleTimeString()}</p></td>
                                                            <td><p className="text-white text-center">{new Date(t.end).toLocaleTimeString()}</p></td>
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
            </div>
        );
    }
}

export default Times;