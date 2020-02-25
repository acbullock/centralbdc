import React from "react";
// reactstrap components
import {
    Card,
    CardImg,
    Container,
    CardBody,
    Row,
    Col,
    CardTitle,
    Table,
    Progress

} from "reactstrap";

import gold from "../../assets/img/gold.png"
import silver from "../../assets/img/silver.png"
import bronze from "../../assets/img/bronze.png"
import deathRowLogo from "../../assets/img/deathrow.png"
import newZealandLogo from "../../assets/img/newzealand.png"
import dreamchaserLogo from "../../assets/img/dream-chasers.png"
import trendsetterLogo from "../../assets/img/trendsetters.png"
import defaultLogo from "../../assets/img/default-logo.png"
class GoalDashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            mtdApps: [],
            dealerships: [],
            dealerCounts: [],
            totalGoal: 0,
            totalCount: 0,
            totalPercentage: 0

        }
        this._isMounted = false
        this.refreshPage = this.refreshPage.bind(this)
        this.getMTDApps = this.getMTDApps.bind(this)
        this.getDealerships = this.getDealerships.bind(this)
        this.getDealerCounts = this.getDealerCounts.bind(this)
    }
    async componentWillMount() {
        this._isMounted = true
        this._isMounted && this.setState({ loading: true })
        this._isMounted && await this.getDealerships()
        this._isMounted && await this.getMTDApps()
        this.getDealerCounts()
        this._isMounted && this.setState({ loading: false })

    }
    componentDidMount() {
        this._isMounted = true
        setInterval(() => {
            this.refreshPage()
        }, 900000);
    }
    componentWillUnmount() {
        this._isMounted = false
    }
    async getDealerCounts() {
        let { dealerships } = this.state;
        let dealerCounts = []
        let now = new Date()
        let first = new Date(new Date(new Date().setDate(1)).setHours(0, 0, 0, 0))
        // let daysElapsed2 = now.getDate()
        for (let dealer in dealerships) {
            let dlrCount = 0;
            for (let app in this.state.mtdApps) {
                if (this.state.mtdApps[app].dealership === dealerships[dealer].value) {
                    dlrCount++
                }
            }
            let daysElapsed = new Date(dealerships[dealer].activated).getTime() > new Date(first).getTime() ? (now.getTime() - new Date(dealerships[dealer].activated).getTime()) / (1000 * 3600 * 24) : (now.getTime() - first.getTime()) / (1000 * 3600 * 24)
            dealerCounts.push({
                label: dealerships[dealer].label,
                goal: parseInt(dealerships[dealer].goal),
                goalMTD: Math.round(10 * parseInt(dealerships[dealer].goal) * daysElapsed) / 10,
                count: dlrCount,
                percentage: Math.round(1000 * dlrCount / (parseInt(dealerships[dealer].goal) * daysElapsed)) / 10,
                goalDistance: Math.round(10 * ((parseInt(dealerships[dealer].goal) * daysElapsed) - dlrCount)) / 10,
                activated: dealerships[dealer].activated
            })
        }
        for (let d in dealerCounts) {
            let color = "red";
            if (dealerCounts[d].percentage > 33) {
                color = "yellow"
            }
            if (dealerCounts[d].percentage >= 100) {
                color = "green"
            }
            dealerCounts[d].color = color

            if (new Date(dealerCounts[d].activated).getTime() > new Date(first).getTime()) {
                dealerCounts[d].isNew = true
            }
            else {
                dealerCounts[d].isNew = false
            }
        }

        this._isMounted && await dealerCounts.sort((a, b) => {
            return a.percentage - b.percentage
        })
        this._isMounted && this.setState({ dealerCounts })
        let totalGoal = 0;
        let totalCount = 0
        for (let d in dealerCounts) {
            if (dealerCounts[d].goal !== 999) {
                totalGoal += dealerCounts[d].goalMTD
                totalCount += dealerCounts[d].count
            }
        }
        let totalPercentage = Math.round(1000 * (totalCount / totalGoal)) / 10
        this._isMounted && this.setState({ totalCount, totalGoal: Math.round(10 * totalGoal) / 10, totalPercentage })
    }
    async getDealerships() {
        let dealerships = this._isMounted && await this.props.mongo.find("dealerships",
            {
                isActive: true,
                isSales: true
            },
            {
                projection: {
                    label: 1,
                    value: 1,
                    goal: 1,
                    activated: 1
                }
            }
        )
        this._isMounted && this.setState({ dealerships })
    }
    async getMTDApps() {
        let allApps = this._isMounted && await this.props.mongo.find("all_appointments",
            {
                dealership_department: {
                    "$ne": "Service"
                },
                verified: {
                    "$gte": new Date(new Date(new Date(new Date().setDate(1))).setHours(0, 0, 0, 0)).toISOString()
                }
            },
            {
                projection: {
                    "dealership": 1
                }
            }
        )
        this._isMounted && this.setState({ mtdApps: allApps })
    }
    refreshPage() {
        window.location.reload(false);
    }
    render() {
        if (this.state.loading) {
            return (
                <>
                    <div className="content">
                        <Container>
                            <Col className="ml-auto mr-auto text-center" md="6">
                                <CardImg alt="loading" top width="100%" src={this.props.utils.loading} />
                            </Col>
                        </Container>
                    </div>
                </>
            );
        }
        return (
            <div className="content">
                <Container>
                    <Row >
                        <Col lg="12">
                            <Card style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                <CardTitle>
                                    <h1 className="text-center text-white" style={{ margin: 20 }}>Dealership Goals MTD</h1>
                                    <h3 className="text-center text-white" style={{ marginBottom: 0 }}>Total Count MTD: <strong>{this.state.totalCount}</strong></h3>
                                    <h3 className="text-center text-white" style={{ marginBottom: 0 }}>Total Goal MTD: <strong>{this.state.totalGoal}</strong></h3>
                                    {(() => {
                                        let textColor = "red"
                                        if (this.state.totalPercentage > 33) {
                                            textColor = "yellow"
                                        }
                                        if (this.state.totalPercentage >= 100) {
                                            textColor = "green"
                                        }
                                        return <h3 className="text-center text-white">Total Percentage MTD:<span style={{ color: textColor }}> <strong>{this.state.totalPercentage}%</strong></span></h3>
                                    })()}
                                </CardTitle>
                                <CardBody>
                                    <Table>
                                        <thead>
                                            <tr>
                                                <th style={{ borderBottom: "solid 1px white" }} className="text-white text-center">Dealership</th>
                                                <th style={{ borderBottom: "solid 1px white" }} className="text-white text-center">Daily Goal</th>
                                                <th style={{ borderBottom: "solid 1px white" }} className="text-white text-center">MTD Count</th>
                                                <th style={{ borderBottom: "solid 1px white" }} className="text-white text-center">MTD Goal</th>
                                                <th style={{ borderBottom: "solid 1px white" }} className="text-white text-center">Percentage</th>
                                                <th style={{ borderBottom: "solid 1px white" }} className="text-white text-center">Distance from Goal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this._isMounted && this.state.dealerCounts.map((d, i) => {
                                                return (
                                                    <tr key={i}>
                                                        <td style={{ borderBottom: "solid 1px white" }}><p className="text-white text-center"><span hidden={!d.isNew} style={{ color: "#CD5C5C" }}><strong> NEW</strong></span> {d.label}</p></td>
                                                        <td style={{ borderBottom: "solid 1px white" }}><p className="text-white text-center">{d.goal}</p></td>
                                                        <td style={{ borderBottom: "solid 1px white" }}><p className="text-white text-center"><strong>{d.count}</strong></p></td>
                                                        <td style={{ borderBottom: "solid 1px white" }}><p className="text-white text-center"><strong>{d.goalMTD}</strong></p></td>
                                                        <td style={{ borderBottom: "solid 1px white" }}><Progress style={{ height: "20px", width: "150px", fontSize: "18px" }} color={d.color} value={d.percentage}><strong>{d.percentage}%</strong></Progress></td>
                                                        <td style={{ borderBottom: "solid 1px white" }}><p className="text-white text-center">{d.goalDistance}</p></td>
                                                    </tr>
                                                )
                                            })}
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

export default GoalDashboard;