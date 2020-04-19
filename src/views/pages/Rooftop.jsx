import React from "react";
// reactstrap components
import {
    Button,
    Card,
    CardImg,
    Container,
    CardBody,
    CardHeader,
    Row,
    Col,
    Table,
    Modal,
    ModalHeader,
    ModalBody,
    Form,
    Input

} from "reactstrap";
import Select from 'react-select'
class Rooftop extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            selected_sales_agent: null,
            departments: [],
            buckets: [],
            rooftops: {},
            rooftop_history: {},
            open_roofs: [], //for override,
            selected_change: null, //for override,
            changeRooftopModal: false,//for override,
            selected_new_rooftop: null //for  override

        }
        this._isMounted = false
        this.orderByStruggling = this.orderByStruggling.bind(this)
        this.getAllRooftops = this.getAllRooftops.bind(this)
        this.getRooftopHistory = this.getRooftopHistory.bind(this)
        this.getProjectionForDealer = this.getProjectionForDealer.bind(this)
        this.renderSalesBoard = this.renderSalesBoard.bind(this)
        this.renderServiceToSalesBoard = this.renderServiceToSalesBoard.bind(this)
        this.generateRooftop = this.generateRooftop.bind(this)
        this.changeRooftop = this.changeRooftop.bind(this)
    }
    async componentWillMount() {
        this._isMounted = true
    }


    async componentDidMount() {
        this._isMounted && await this.setState({ loading: true })
        let appCounts = await this.props.mongo.aggregate("all_appointments", [
            {
                "$match": {
                    "verified": {
                        "$gte": new Date(new Date().setHours(0, 0, 0, 0)).toISOString()
                    }
                }
            },
            {
                "$group": {
                    "_id": "$dealership",
                    "count": {
                        "$sum": 1
                    }
                }
            },
            {
                "$sort": {
                    "count": -1
                }
            }
        ])
        let departments = this._isMounted && await this.props.mongo.find("departments")
        let buckets = this._isMounted && await this.props.mongo.find("buckets")
        let dealerships = this._isMounted && await this.props.mongo.find("dealerships", { isActive: true })
        let agents = this._isMounted && await this.props.mongo.aggregate("agents", [
            {
                "$match": {
                    isActive: true
                }
            },
            {
                "$group": {
                    _id: "$_id",
                    name: { "$first": "$name" },
                    label: { "$first": "$name" },
                    value: { "$first": "$_id" },
                    skills: { "$first": "$skills" },
                    rooftopDepartment: {"$first": "$rooftopDepartment"}
                }
            },
            {
                "$sort": {
                    "name": 1
                }
            }
        ])
        this._isMounted && await this.setState({
            appCounts,
            departments,
            buckets,
            dealerships,
            agents
        })
        await this.getAllRooftops()
        await this.getRooftopHistory()
        let open_roofs = await this.props.mongo.aggregate("rooftop_history", [
            {
                "$match": {
                    startTime: {
                        "$gte": new Date(new Date().setHours(0, 0, 0, 0)).toISOString()
                    },
                    endTime: null
                }
            },
            {
                "$addFields": {
                    value: "$_id",
                    label: "$dealership",
                    agent_name: ""
                }
            }
        ])
        for (let o in open_roofs) {
            let ind = await dealerships.findIndex((d) => {
                return d.value === open_roofs[o].label
            })
            let ag = await agents.findIndex((a) => {
                return a._id === open_roofs[o].agent
            })
            if (ind === -1 || ag === -1) {
                continue;
            }
            open_roofs[o].agent_name = agents[ag].label
            open_roofs[o].label = `${agents[ag].label} - ${dealerships[ind].label} - ${open_roofs[o].bucket}`
        }
        this._isMounted && await this.setState({ open_roofs, loading: false })
    }


    componentWillUnmount() {
        this._isMounted = false
    }
    async generateRooftop() {
        this.setState({ loading: true })
        let roof = await this.props.mongo.iNeedARooftop(this.state.selected_sales_agent, this.state.rooftops)
        if (!roof) { return }
        //add rooftop to history
        let historyObj = {
            dealership: roof.dealership.value,
            department: roof.department,
            bucket: roof.bucket,
            agent: this.state.selected_sales_agent.value,
            startTime: new Date().toISOString()
        }
        await this.props.mongo.insertOne("rooftop_history", historyObj)
        await this.getAllRooftops()
        await this.getRooftopHistory()
        let open_roofs = await this.props.mongo.aggregate("rooftop_history", [
            {
                "$match": {
                    startTime: {
                        "$gte": new Date(new Date().setHours(0, 0, 0, 0)).toISOString()
                    },
                    endTime: null
                }
            },
            {
                "$addFields": {
                    value: "$_id",
                    label: "$dealership",
                    agent_name: ""
                }
            }
        ])
        for (let o in open_roofs) {
            let ind = await this.state.dealerships.findIndex((d) => {
                return d.value === open_roofs[o].label
            })
            let ag = await this.state.agents.findIndex((a) => {
                return a._id === open_roofs[o].agent
            })
            if (ind === -1 || ag === -1) {
                continue;
            }
            open_roofs[o].agent_name = this.state.agents[ag].label
            open_roofs[o].label = `${this.state.agents[ag].label} - ${this.state.dealerships[ind].label} - ${open_roofs[o].bucket}`
        }
        this.setState({ loading: false, selected_sales_agent: null, open_roofs })
    }
    async changeRooftop() {
        this.setState({ loading: true })
        let currentRooftop = this.state.selected_change
        let newRooftop = this.state.selected_new_rooftop
        //delete current rooftop
        await this.props.mongo.findOneAndDelete("rooftop_history", { _id: currentRooftop._id })
        // //close out current rooftop
        // let end = new Date().toISOString()
        // let timeSpentMinutes = new Date(end).getTime() - new Date(currentRooftop.startTime).getTime()
        // timeSpentMinutes = Math.round(10* (timeSpentMinutes / (1000 * 60)))/10
        // let appointmentCount = await this.props.mongo.count("all_appointments", {
        //     agent_id: currentRooftop.agent,
        //     verified: {
        //         "$gte": currentRooftop.startTime,
        //         "$lte": end,
        //     }
        // })
        // appointmentCount = appointmentCount.count

        // await this.props.mongo.findOneAndUpdate("rooftop_history", {_id: currentRooftop._id}, {
        //     endTime: end,
        //     timeSpentMinutes,
        //     appointmentCount
        // })
        //set new rooftop..
        await this.props.mongo.insertOne("rooftop_history", {
            dealership: newRooftop.dealership.value,
            department: newRooftop.department,
            bucket: newRooftop.bucket,
            agent: currentRooftop.agent,
            startTime: new Date().toISOString()
        })
        await this.getAllRooftops()
        await this.getRooftopHistory()
        let open_roofs = await this.props.mongo.aggregate("rooftop_history", [
            {
                "$match": {
                    startTime: {
                        "$gte": new Date(new Date().setHours(0, 0, 0, 0)).toISOString()
                    },
                    endTime: null
                }
            },
            {
                "$addFields": {
                    value: "$_id",
                    label: "$dealership",
                    agent_name: ""
                }
            }
        ])
        for (let o in open_roofs) {
            let ind = await this.state.dealerships.findIndex((d) => {
                return d.value === open_roofs[o].label
            })
            let ag = await this.state.agents.findIndex((a) => {
                return a._id === open_roofs[o].agent
            })
            if (ind === -1 || ag === -1) {
                continue;
            }
            open_roofs[o].agent_name = this.state.agents[ag].label
            open_roofs[o].label = `${this.state.agents[ag].label} - ${this.state.dealerships[ind].label} - ${open_roofs[o].bucket}`
        }
        await this.setState({ open_roofs, selected_change: null, selected_new_rooftop: null, changeRooftopModal: false, loading: false })

    }
    async getProjectionForDealer(dealership) {
        let now = new Date()
        let dayStart = new Date().setHours(7, 30, 0, 0)
        let dayLength = new Date().getDay() === 0 ? 8 : 12;
        let hours_elapsed = new Date(now).getTime() - new Date(dayStart).getTime()
        hours_elapsed = hours_elapsed / (1000 * 60 * 60)
        let countIndex = await this.state.appCounts.findIndex((ac) => {
            return ac._id === dealership.value
        })
        if (countIndex === -1) { return 0 }
        let count = this.state.appCounts[countIndex].count
        let projection = (count / hours_elapsed) * dayLength
        projection = Math.round(100 * projection) / 100
        return projection
    }
    async orderByStruggling(department) {
        let { buckets } = this.state;
        let matched_bucket = buckets[buckets.findIndex((b) => { return b.department === department })]
        if (!matched_bucket) return;
        let matched = await this.state.dealerships.filter((dealer) => {
            // if (dealer.salesRequired === true) return true;
            if (!dealer.requiredServices) return false
            return dealer.requiredServices.indexOf(department) !== -1
        })

        for (let dealer in matched) {
            if (matched[dealer].goal == 999) {
                matched[dealer].goal = 50
            }
            let projection = await this.getProjectionForDealer(matched[dealer])
            let distanceFromGoal = parseInt(matched[dealer].goal) - projection;
            matched[dealer].distanceFromGoal = distanceFromGoal;
        }
        let ret = []
        for (let m in matched) {
            for (let buck in matched_bucket.buckets) {
                ret.push({
                    department,
                    bucketIndex: buck,
                    bucket: matched_bucket.buckets[buck],
                    dealership: {
                        value: matched[m].value,
                        label: matched[m].label,
                        projectedDistanceFromGoal: Math.round(100 * matched[m].distanceFromGoal) / 100,
                        goal: matched[m].goal,
                        salesHours: matched[m].salesHours,
                        timezoneOffset: matched[m].timezoneOffset
                    },
                    label: matched[m].label + " - " + matched_bucket.buckets[buck],
                    value: m + "_" + buck
                })
            }
        }
        await ret.sort((a, b) => {
            return b.dealership.projectedDistanceFromGoal - a.dealership.projectedDistanceFromGoal || a.bucketIndex - b.bucketIndex
        })
        return ret
    }
    async getAllRooftops() {
        let { departments } = this.state
        let rooftops = {}
        for (let id in departments) {
            rooftops[departments[id].value] = await this.orderByStruggling(departments[id].value)
        }
        this._isMounted && await this.setState({ rooftops })
        console.log(rooftops)
        return rooftops
    }
    async getRooftopHistory() {
        let { rooftops, departments } = this.state;

        let rooftops_by_dept_dealer = {}
        for (let dept in departments) {
            if (!rooftops[departments[dept].value]) {
                continue;
            }
            let matching_dealers = await rooftops[departments[dept].value].filter((a) => {
                return a.department === departments[dept].value
            })
            rooftops_by_dept_dealer[departments[dept].value] = {}
            for (let dealer in matching_dealers) {
                if (!rooftops_by_dept_dealer[departments[dept].value][matching_dealers[dealer].dealership.value]) {
                    rooftops_by_dept_dealer[departments[dept].value][matching_dealers[dealer].dealership.value] = await rooftops[departments[dept].value].filter((top) => {
                        return top.dealership.value === matching_dealers[dealer].dealership.value
                    })
                }

            }
        }

        let rooftop_history = this._isMounted && await this.props.mongo.find("rooftop_history", {
            startTime: {
                "$gte": new Date(new Date().setHours(0, 0, 0, 0)).toISOString()
            }
        })
        for (let roof in rooftop_history) {
            // update the main return object..
            if (!rooftops_by_dept_dealer[rooftop_history[roof].department][rooftop_history[roof].dealership]) {
                continue;
            }
            let bucketIndex = rooftops_by_dept_dealer[rooftop_history[roof].department][rooftop_history[roof].dealership].findIndex((x) => {
                return x.bucket === rooftop_history[roof].bucket
            })
            if (bucketIndex === -1) continue
            rooftops_by_dept_dealer[rooftop_history[roof].department][rooftop_history[roof].dealership][bucketIndex].agent = rooftop_history[roof].agent
            rooftops_by_dept_dealer[rooftop_history[roof].department][rooftop_history[roof].dealership][bucketIndex].startTime = rooftop_history[roof].startTime
            rooftops_by_dept_dealer[rooftop_history[roof].department][rooftop_history[roof].dealership][bucketIndex].appointmentCount = rooftop_history[roof].appointmentCount
            rooftops_by_dept_dealer[rooftop_history[roof].department][rooftop_history[roof].dealership][bucketIndex].endTime = rooftop_history[roof].endTime
            rooftops_by_dept_dealer[rooftop_history[roof].department][rooftop_history[roof].dealership][bucketIndex].timeSpentMinutes = rooftop_history[roof].timeSpentMinutes
        }
        await this.setState({ rooftop_history: rooftops_by_dept_dealer })


    }
    renderSalesBoard() {

        let salesIndex = "5ddde79f1c9d4400008eb646"
        let history = this.state.rooftop_history[salesIndex]
        if (!history) { return null }
        // console.log(history)
        let bucketIndex = this.state.buckets.findIndex((buck) => {
            return buck.department === salesIndex
        })
        if (bucketIndex === -1) {
            return null
        }

        let buckets = this.state.buckets[bucketIndex].buckets
        return (
            <Table>
                <thead>
                    <tr>
                        <th style={{ border: "1px white solid" }}><p className="text-white text-center">Dealer Info</p></th>
                        {
                            buckets.map((b, i) => {
                                return <th key={i} style={{ border: "1px white solid" }}><p className="text-white text-center">{b}</p></th>
                            })
                        }
                    </tr>
                </thead>
                <tbody>
                    {(() => {
                        let ret = []
                        for (let h in history) {
                            let cols = []
                            for (let dealer in history[h]) {
                                // console.log(history[h][dealer].appointmentCount, "!")
                                if (dealer === "0") {
                                    cols.push(<td key={h} style={{ border: "1px white solid" }}>
                                        <p className="text-white text-center">{history[h][dealer].dealership.label}</p>
                                        <p className="text-white text-center">Projected Distance From Goal: {history[h][dealer].dealership.projectedDistanceFromGoal}</p>
                                    </td>)
                                }
                                cols.push(
                                    <td key={dealer + "_" + h} style={{ border: "1px white solid" }}>
                                        <p className="text-center" style={{ color: !history[h][dealer].agent ? "red" : "white" }}><strong>{!history[h][dealer].agent ? "empty" : this.state.agents.find((ag) => { return ag._id === history[h][dealer].agent }).name}</strong></p>
                                        <p className="text-white text-center">{!history[h][dealer].timeSpentMinutes ? null : history[h][dealer].timeSpentMinutes + " min"}</p>
                                        <p className="text-white text-center">{history[h][dealer].appointmentCount === undefined ? null : history[h][dealer].appointmentCount + " appts"}</p>
                                    </td>
                                )
                            }
                            ret.push(
                                <tr key={h}>
                                    {cols}
                                </tr>
                            )

                        }
                        return ret
                    })()}
                </tbody>
            </Table>
        )
    }
    renderServiceToSalesBoard() {
        let serviceToSalesIndex = "5ddde7aa1c9d4400008eb648"
        let dataMiningIndex = "5ddde7901c9d4400008eb644"
        let history = this.state.rooftop_history[serviceToSalesIndex]
        if (!history) { return null }
        let bucketIndex = this.state.buckets.findIndex((buck) => {
            return buck.department === serviceToSalesIndex
        })
        if (bucketIndex === -1) {
            return null
        }

        let buckets = this.state.buckets[bucketIndex].buckets
        return (
            <Table>
                <thead>
                    <tr>
                        <th style={{ border: "1px white solid" }}><p className="text-white text-center">Dealer Info</p></th>
                        {
                            buckets.map((b, i) => {
                                return <th key={i} style={{ border: "1px white solid" }}><p className="text-white text-center">{b}</p></th>
                            })
                        }
                    </tr>
                </thead>
                <tbody>
                    {(() => {
                        let ret = []
                                    for (let h in history) {
                                        let cols = []
                                        for (let dealer in history[h]) {
                                            // console.log(history[h][dealer].appointmentCount, "!")
                                            if (dealer === "0") {
                                                cols.push(<td key={h} style={{ border: "1px white solid" }}>
                                                    <p className="text-white text-center">{history[h][dealer].dealership.label}</p>
                                                    <p className="text-white text-center">Projected Distance From Goal: {history[h][dealer].dealership.projectedDistanceFromGoal}</p>
                                                </td>)
                                            }
                                            cols.push(
                                                <td key={dealer + "_" + h} style={{ border: "1px white solid" }}>
                                                    <p className="text-center" style={{ color: !history[h][dealer].agent ? "red" : "white" }}><strong>{!history[h][dealer].agent ? "empty" : this.state.agents.find((ag) => { return ag._id === history[h][dealer].agent }).name}</strong></p>
                                                    <p className="text-white text-center">{!history[h][dealer].timeSpentMinutes ? null : history[h][dealer].timeSpentMinutes + " min"}</p>
                                                    <p className="text-white text-center">{history[h][dealer].appointmentCount === undefined ? null : history[h][dealer].appointmentCount + " appts"}</p>
                                                </td>
                                            )
                                        }
                                        ret.push(
                                            <tr key={h}>
                                                {cols}
                                            </tr>
                                        )

                                    }
                        return ret
                    })()}
                </tbody>
            </Table>
        )
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

                        <Col className="ml-auto mr-auto text-center" md="12">
                            <hr />
                            <Card style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                <CardBody>
                                    <Select
                                        options={this.state.agents}
                                        value={this.state.selected_sales_agent}
                                        onChange={(e) => { this.setState({ selected_sales_agent: e }) }}
                                    />
                                    <Button
                                        color="neutral"
                                        disabled={!this.state.selected_sales_agent}
                                        onClick={async () => {
                                            await this.generateRooftop()

                                        }}>
                                        Generate Rooftop
                                </Button>
                                </CardBody>
                            </Card>
                            <hr />
                            <Card style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                <CardHeader>
                                    <h1 className="text-white text-center">Sales BDC</h1>
                                </CardHeader>
                                <br />
                                <Button
                                    color="warning"
                                    onClick={async () => {
                                        this.setState({ changeRooftopModal: true })
                                    }}>
                                    Change Rooftop
                                </Button>
                                <br />
                                {this.renderSalesBoard()}
                            </Card>
                            <Card style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                <CardHeader>
                                    <h1 className="text-white text-center">Service to Sales / Data-Mining</h1>
                                </CardHeader>
                                <br />
                                <Button
                                    color="warning"
                                    onClick={async () => {
                                        this.setState({ changeRooftopModal: true })
                                    }}>
                                    Change Rooftop
                                </Button>
                                <br />
                                {this.renderServiceToSalesBoard()}
                            </Card>
                            <Modal isOpen={this.state.changeRooftopModal} >
                                <ModalHeader toggle={() => { this.setState({ changeRooftopModal: !this.state.changeRooftopModal }) }}>
                                    Change Rooftop
                                        </ModalHeader>
                                <ModalBody>

                                    <p>Select Active Rooftop</p>
                                    <Select
                                        options={this.state.open_roofs}
                                        value={this.state.selected_change}
                                        onChange={(e) => { console.log(e); this.setState({ selected_change: e }) }}
                                    />
                                    <Form hidden={!this.state.selected_change}>
                                        <p>Agent Name</p>
                                        <Input readOnly value={!this.state.selected_change ? "" : this.state.selected_change.agent_name} />
                                        <p>Choose Rooftop</p>
                                        <Select
                                            options={this.state.rooftops["5ddde79f1c9d4400008eb646"]}
                                            value={this.state.selected_new_rooftop}
                                            onChange={(e) => { this.setState({ selected_new_rooftop: e }) }}
                                        />

                                    </Form>
                                    <Button color="neutral" onClick={() => {
                                        this.setState({ selected_change: null, selected_new_rooftop: null, changeRooftopModal: !this.state.changeRooftopModal })
                                    }}>Cancel</Button>
                                    <Button
                                        disabled={
                                            !this.state.selected_change || !this.state.selected_new_rooftop
                                        }
                                        color="success"
                                        onClick={() => {
                                            this.changeRooftop()
                                        }}>Confirm Changes</Button>
                                </ModalBody>
                            </Modal>
                        </Col>

                    </Row>
                </Container>
            </div>
        );
    }
}

export default Rooftop;