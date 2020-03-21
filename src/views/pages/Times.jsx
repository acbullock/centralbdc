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
            all_agents: false,
            salaries: []
        }
        this.getTimes = this.getTimes.bind(this)
        this.getAllTimes = this.getAllTimes.bind(this)
        this.getExtensions = this.getExtensions.bind(this)
        this.getPay = this.getPay.bind(this)
        this._isMounted = false
        this.SERVER = "https://guarded-castle-33109.herokuapp.com";
        this.RING_CENTRAL = "https://platform.ringcentral.com/restapi/v1.0";
        this.INACTIVE = [
            // "Ben Shamsizadeh",
            // "Benjamin Shamsizadeh",
            // "Benjamin Backup",
            // "Cristhian Bedregal",
            // "Jesse Shephard",
            // "Stephanie Taboada",
            // // "Giovanni West",
            // "Morgan Conway",
            // "Justin Byron",
            // "Joseph Callejo",
            // "Mike Hampton",
            // "Jason Miller",
            // "Austin Skumanich",
            // // "Lexie Orr",
            // "Marc Vertus",
            // "Raina Bastien",
            // "Amanda Schwartzmeyer",
            // "Andrew Bastkowski",
            // // "Astrid Poliszuk",
            // "Brianna Stewart",
            // "Celine Morales",
            // "Corey Watson",
            // // "Chelsea Morel",
            // // "David Lowenstein",
            // "Dennis Martinez",
            // "Harvey Harvey",
            // "Jaime Marcado",
            // // "JC Guerrero",
            // "Jeremy Woods",
            // "Gordon Jupiter",
            // "Kathelina Montoya",
            // "Marquis Ulysse",
            // "Larry Willis",
            // "Donny Howell",
            // "Sebastian Gargurevich",
            // // "Sandie Frank",
            // "Mike Rivera",
            // // "Yessli Pena",
            // "Zaire Ivory",
            // "Alissa Altidort",
            // "Victoria Montoya",
            // "TJ Kirrane",
            // // "Tiffany Henderson",
            // "Taina Cruz",
            // "Mercedes Stringer",
            // "Marquianda Bonner",
            // "Peter Francillon",
            // // "Salwa Al-Dasouqi",
            // "Stephanie Silva",
            // "Stephen Manning",
            // "Mica Egalite",
            // "Shae Mardy",
            // "Rovnisha Saddler",
            // "Jasmine Montes",
            // "Brian King",
            // "Jesse Sosa",
            // "Jean Sufralien",
            // "Joey Gordon",
            // "Kira Brooks",
            // "Bruna Biffani",
            // "Chris Jeffries",
            // "David White",
            // "Alysa Blackstock",
            // "Janielle Cutner",
            // "Kayla Mcneill",
            // "Michael Joseph",
            // "Amalia Arocho",
            // "Alex Bauer",
            // "Stevens Jocelyn",
            // "Priscilla Sanders",
            // "Imani Bradford",
            // "Kaya Steadman",
            // //cant find anyway..
            // "Alexis Lamers",
            // "Emanuela Beaucejour",
            // "Jimmy Colatti",
            // "Matthew Beauka ",
            // "Myrdjina Jacques",
            // "Sean Mills",
            // "Wister Ludieu",
            // "Angelo Jolteus",
            // "Devin Jackson",
            // "Presky Cius",
            // "Wesley Bradford",
            // "Dominique George",
            // "Federico Santamaria",
            // "Gianni Gonzalez",
            // "Jacob Ho",
            // "Adlin Exantus",
            // "Barbara Santos",
            // "JAMILLAH BUIE"
        ]
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
        names = await names.filter((n) => {
            return this.INACTIVE.indexOf(n._id) === -1
        })


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
    getPay(sal, hours) {
        if (!sal || !hours) return null
        let minwage = 8.46
        if (hours > 40) {
            if (sal > (minwage * hours)) {
                let hourly = sal / hours
                return `Overtime Pay: $${Math.round(100 * (.5 * hourly * (hours - 40))) / 100}`
            }
            else {
                let pay = (minwage * hours) + (.5 * minwage * (hours - 40))

                return `Overtime Pay $${Math.round(100 * (pay - sal)) / 100}`
            }
        }
        else {
            //make sure they at least got min wage..
            let hourly = sal / hours
            if (hourly >= minwage) {
                return `Overtime Pay: $0.00`
            }
            else {
                let diff = minwage - hourly
                return `Overtime Pay: $${Math.round(100 * diff * hours) / 100}`
            }
        }
    }
    async getTimes() {
        this.setState({ timesLoading: true })
        let timesheet = await this.props.mongo.aggregate("timesheet", [
            {
                "$match": {
                    name: this.state.selected_name.label,
                    day: {
                        "$gte": new Date(new Date(this.state.from_date).setHours(0, 0, 0, 0)),
                        "$lte": new Date(new Date(this.state.to_date).setHours(0, 0, 0, 0))
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
                        "$gte": new Date(new Date(this.state.from_date).setHours(0, 0, 0, 0)),
                        "$lte": new Date(new Date(this.state.to_date).setHours(0, 0, 0, 0))
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
                        "$gte": new Date(new Date(this.state.from_date).setHours(0, 0, 0, 0)),
                        "$lte": new Date(new Date(this.state.to_date).setHours(0, 0, 0, 0))
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
                        "$gte": new Date(new Date(this.state.from_date).setHours(0, 0, 0, 0)),
                        "$lte": new Date(new Date(this.state.to_date).setHours(0, 0, 0, 0))
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
                                        onChange={(e) => { this.setState({ totals: [], salaries: [], timesheet: [], selected_name: e }) }}
                                        isDisabled={this.state.all_agents}
                                    />
                                    <br />
                                    <p className="text-white text-left">
                                        <input
                                            type="checkbox"
                                            checked={this.state.all_agents}
                                            onChange={() => { this.setState({ timesheet: [], salaries: [], totals: [], all_agents: !this.state.all_agents }) }}
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
                                            onChange={(e) => {
                                                this.setState({
                                                    timesheet: [], totals: [], salaries: [],
                                                    from_date: new Date(new Date(e).setHours(0, 0, 0, 0)),
                                                    to_date: new Date(new Date(new Date(e).setHours(0, 0, 0, 0)).getTime() + (24 * 6 * 3600000))
                                                })

                                            }}
                                        />
                                    </Card>
                                    <p className="text-white text-left">To:</p>
                                    <Card>
                                        <ReactDateTime
                                            inputProps={{ disabled: true }}
                                            timeFormat={false}
                                            value={this.state.to_date}
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
                                            if (this.INACTIVE.indexOf(t._id) !== -1) return null
                                            return (
                                                <div key={i}>
                                                    {/* <hr style={{ borderBottom: "white solid 1px" }} /> */}
                                                    <p className="text-white text-center" style={{ cursor: "pointer" }} onClick={() => {
                                                        let opens = this.state.opens;
                                                        opens[t._id] = !opens[t._id]
                                                        this.setState({ opens })
                                                    }}><strong>{t._id}</strong>{`\t`}{Math.round(1000 * t.count) / 1000} Hours</p>
                                                    <p className="text-white text-center">Weekly Salary: {`\t`}
                                                        <input
                                                            type="text"
                                                            // value={this.state.salaries[i]}
                                                            onChange={(e) => {
                                                                let sals = this.state.salaries
                                                                sals[i] = parseFloat(e.target.value)
                                                                this.setState({ salaries: sals })
                                                            }}
                                                        /></p>
                                                    <p className="text-white text-center">{this.getPay(this.state.salaries[i], Math.round(1000 * t.count) / 1000)}</p>
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
                                                                            <th style={{ borderBottom: "white solid 1px" }}><p className="text-white text-center">Break</p></th>
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
                                                                                    <td style={{ borderBottom: "white solid 1px" }}><p className="text-white text-center">{cur.break.breakMinutes} min.</p></td>
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