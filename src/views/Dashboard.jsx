/*!

=========================================================
* Black Dashboard PRO React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-pro-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
// reactstrap components
import {
  Card,
  CardImg,
  Container,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col
} from "reactstrap";
import Select from "react-select"
const defaultLogo = "https://centralbdc-bwpmi.mongodbstitch.com/profile-images/default-logo.png"
class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      mtdTooltip: false,
      bigChartData: "data1",
      barData: {},
      agent: this.props.agent,
      labels: [],
      datasets: [],
      isAdmin: false,
      appointments: [],
      loading: false,
      agents: [],
      dealerships: [],
      data: {},
      options: {},
      top5: [],
      mtdTop5: [],
      todays_appts: [],
      elements: [],
      selected_agent: { label: "", value: "" },
      counts: {},
      mtdtop5loading: false,
      mtdloadnew: false,
      payment: 0,
      agentRank: 0
    };
    this.getBreakDown = this.getBreakDown.bind(this)
    this.getMtdTop5 = this.getMtdTop5.bind(this)
    this.getProjection = this.getProjection.bind(this)
    this.calculatePay = this.calculatePay.bind(this)
  }
  _isMounted = false;
  async componentWillMount() {
    let agent = this.props.agent
    if (agent.department === "service" && agent.account_type !== "admin") {
      this._isMounted = false;
      this.props.history.push("/admin/service_dashboard")
      return;
    }
  }
  async componentDidMount() {
    this._isMounted = true
    this._isMounted && this.setState({ loading: true })


    let agents = this._isMounted && await this.props.mongo.find("agents",
      {
        isActive: true,
        department: "sales"
      },
      {
        projection: {
          _id: 1,
          name: 1,
          callCountLastUpdated: 1,
          inboundToday: 1,
          outboundToday: 1,
          personalRecord: 1
        }
      })

    agents = this._isMounted && agents.map((a, i) => {
      return Object.assign(a, { label: a.name, value: i })
    })


    this._isMounted && agents.sort((a, b) => {
      if (a.label > b.label) return 1;
      if (a.label < b.label) return -1;
      return 0;
    })
    let agent = this.props.agent
    if (agent.account_type !== "admin") {
      let index = this._isMounted && agents.findIndex((a) => { return a._id === agent._id })
      let selected = agents[index]
      this._isMounted && this.getBreakDown(agent)
      this._isMounted && this.setState({ selected_agent: selected })
    }
    this._isMounted && this.setState({ agent, agents, isAdmin: agent.account_type === "admin" })
    this._isMounted && await this.getTop5()
    this._isMounted && await this.getMtdTop5()
    this._isMounted && this.setState({ loading: false })
  }
  componentWillUnmount() {
    this._isMounted = false
    // window.stop()
  }

  calculatePay(count) {
    if (isNaN(parseInt(count))) {
      this._isMounted && this.setState({ errorText: "Appointment Count must be a number" });
      return
    }
    let payment = 2000 //base
    if (count <= 400) {

      payment += 0
    }
    else if (count > 400 && count < 600) {
      payment += (4 * (count - 400))
    }
    else if (count >= 600 && count < 800) {
      payment += (5 * (count - 400))
    }
    else if (count >= 800 && count < 1000) {
      payment += (6 * (count - 400))
    }
    else if (count >= 1000 && count < 1200) {
      payment += (7 * (count - 400))
    }
    else if (count >= 1200) {
      payment += (9 * (count - 400))
    }
    this._isMounted && this.setState({ payment })
  }
  async getTop5() {
    this._isMounted && this.setState({ loading: true })
    let groupedAppts = await this.props.mongo.aggregate("all_appointments", [
      {
        "$match": {
          "dealership_department": {
            "$ne": "Service"
          },
          "verified": {
            "$gte": new Date(new Date().setHours(0, 0, 0, 0)).toISOString()
          }
        }
      },
      {
        "$group": {
          "_id": "$agent_id",
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

    let agents = await this.props.mongo.find("agents", { isActive: true, department: "sales" }, { projection: { userId: 1, name: 1, _id: 1 } })
    let agentsRanked = []
    let lastVal = -1
    let curRank = 0;
    for (let a in groupedAppts) {

      if (groupedAppts[a].count !== lastVal) {
        lastVal = groupedAppts[a].count;
        curRank++;
      }
      let agentIndex = agents.findIndex((ap) => {
        return ap._id === groupedAppts[a]._id
      })
      if (agentIndex === -1) continue;
      let user = {
        count: groupedAppts[a].count,
        name: agents[agentIndex].name,
        userId: agents[agentIndex].userId,
        _id: agents[agentIndex]._id,
        rank: curRank
      }
      agentsRanked.push(user)
    }
    console.log(agentsRanked)
    this._isMounted && this.setState({ top5: agentsRanked, loading: false })

  }
  async getMtdTop5() {
    this._isMounted && this.setState({ loading: true })
    let groupedAppts = await this.props.mongo.aggregate("all_appointments", [
      {
        "$match": {
          "dealership_department": {
            "$ne": "Service"
          },
          "verified": {
            "$gte": new Date(new Date(new Date().setDate(1)).setHours(0, 0, 0, 0)).toISOString()
          }
        }
      },
      {
        "$group": {
          "_id": "$agent_id",
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

    let agents = await this.props.mongo.find("agents", { isActive: true, department: "sales" }, { projection: { userId: 1, name: 1, _id: 1 } })
    let agentsRanked = []
    let lastVal = -1
    let curRank = 0;
    for (let a in groupedAppts) {
      if (groupedAppts[a].count !== lastVal) {
        lastVal = groupedAppts[a].count;
        curRank++;
      }
      let agentIndex = agents.findIndex((ap) => {
        return ap._id === groupedAppts[a]._id
      })
      if (agentIndex === -1) continue;
      let user = {
        count: groupedAppts[a].count,
        name: agents[agentIndex].name,
        userId: agents[agentIndex].userId,
        _id: agents[agentIndex]._id,
        rank: curRank
      }
      agentsRanked.push(user)
    }
    this._isMounted && this.setState({ mtdTop5: agentsRanked, loading: false })
  }

  getMonday(d) {
    d = new Date(d);
    d.setHours(0, 0, 0, 0)
    var day = d.getDay(),
      diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }
  createdAppointmentsSince(appts, numDays) {
    let ct = 0
    let curr = new Date()
    curr.setHours(0, 0, 0, 0)
    if (numDays === 0) {
      for (let appt in appts) {
        if (new Date(appts[appt].verified).getTime() >= curr.getTime()) {
          ct++;
        }
      }
      return ct;
    }
    if (numDays === 7) {
      let monday = this.getMonday(new Date())
      for (let appt in appts) {
        if (new Date(appts[appt].verified).getTime() >= monday.getTime()) {
          ct++;
        }
      }
      return ct;
    }
    if (numDays === 30) {
      let date = new Date()
      var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      for (let appt in appts) {
        if (new Date(appts[appt].verified).getTime() >= firstDay.getTime()) {
          ct++;
        }
      }
      return ct;
    }
    return 0
    // let someDay = new Date();
    // let ret = 0;
    // someDay.setDate(someDay.getDate() + (-1 * numDays));
    // for (let appt in appts) {
    //   if (new Date(appts[appt].verified).getTime() >= someDay.getTime() && appts[appt].isPending === false) {
    //     ret++;
    //   }
    // }
    // return ret;
  }
  pendingAppointmentsSince(appts, numDays) {
    let someDay = new Date();
    let ret = 0;
    someDay.setDate(someDay.getDate() + (-1 * numDays));
    for (let appt in appts) {
      if (new Date(appts[appt].created).getTime() >= someDay.getTime() && appts[appt].isPending === true) {
        ret++;
      }
    }

    return ret;
  }
  async getBreakDown(agent) {
    let appointments = await this.props.mongo.find("all_appointments", {
      agent_id: agent._id,
      verified: {
        "$gte": new Date(new Date().setHours(0, 0, 0, 0)).toISOString()
      }
    }, { projection: { verified: 1 } })
    let start = new Date()
    let end = new Date();
    let now = new Date();
    let counts = {

    }
    start.setHours(7, 0, 0, 0)
    end.setHours(8, 0, 0, 0)

    for (let i = 0; i < 15; i++) {

      if (now.getTime() < start.getTime()) {
        counts[i + 7] = { count: "", color: "red" }
        continue;
      }
      let color = "red";
      // let count = this._isMounted && appointments.filter((a) => {
      //   return new Date(a.verified).getTime() >= start.getTime() && new Date(a.verified).getTime() < end.getTime()
      // })

      let count = 0
      for (let a in appointments) {
        if (new Date(appointments[a].verified).getTime() >= start.getTime() && new Date(appointments[a].verified).getTime() < end.getTime()) {
          count++
        }
      }
      if (count === 2) {
        color = "yellow"
      }
      if (count > 2) {
        color = "green"
      }
      counts[i + 7] = { count: count, color }
      start = new Date(end);
      end.setHours(end.getHours() + 1, 0, 0, 0)
    }
    counts["total"] = { count: appointments.length, color: "black" }
    this._isMounted && this.setState({ counts })
  }
  getProjection(curr) {
    let now = new Date();
    let isSunday = now.getDay() === 0;
    let hrs = isSunday === true ? 8 : 12
    let start = isSunday === true ? new Date(new Date().setHours(10, 0, 0, 0)) : new Date(new Date().setHours(8, 0, 0, 0));
    if (isSunday === true) {
      if (now.getHours() > 18) {
        return curr
      }
    }
    else {
      if (now.getHours() > 20) {
        return curr
      }
    }
    let elapsed = (now.getTime() - start.getTime()) / (1000 * 60 * 60)
    return Math.round(10 * curr / elapsed * hrs) / 10

  }
  render() {

    if (this.state.loading) {
      return (
        <>
          <div className="content">
            <Container>
              <Col className="ml-auto mr-auto text-center" md="6">
                {/* <Card color="transparent" > */}
                <CardImg top width="100%" src={this.props.utils.loading} />
                {/* </Card> */}
              </Col>
            </Container>
          </div>
        </>
      );
    }
    return (

      <>
        <div className="content">

          <Row style={{ justifyContent: "center" }}>
            <Col lg="12">
              <Card className="card-raised card-white" color="primary" style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                <CardHeader>
                  <CardTitle tag="h3"><p style={{ color: "white" }}><strong>Agent Hourly Breakdown</strong></p></CardTitle>
                </CardHeader>
                <CardBody>
                  <Select
                    options={this.state.agent.account_type === "admin" ? this.state.agents : this.state.agents.filter((a) => { return a.label === this.state.agent.name })}
                    value={this.state.agent.account_type === "admin" ? this.state.selected_agent : this.state.agents.filter((a) => { return a.label === this.state.agent.name })[0]}
                    onChange={(e) => {
                      this._isMounted && this.setState({ selected_agent: e })
                      this.getBreakDown(e)
                    }}
                  />
                  <br />
                  <Table style={{ backgroundColor: "lightgrey" }} bordered striped hidden={this.state.selected_agent.label.length < 1} className="text-center">
                    <thead className="text-primary">
                      <tr>
                        <th></th>
                        <th>7 - 8</th>
                        <th>8 - 9</th>
                        <th>9 - 10</th>
                        <th>10 - 11</th>
                        <th>11 - 12</th>
                        <th>12 - 1</th>
                        <th>1 - 2</th>
                        <th>2 - 3</th>
                        <th>3 - 4</th>
                        <th>4 - 5</th>
                        <th>5 - 6</th>
                        <th>6 - 7</th>
                        <th>7 - 8</th>
                        <th>8 - 9</th>
                        <th>9 - 10</th>
                        <th>Total</th>
                        <th>Projection</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Appointments</td>
                        <td><p style={this.state.counts[7] === undefined ? {} : { color: this.state.counts[7].color }}><strong>{this.state.counts[7] === undefined ? 0 : this.state.counts[7].count}</strong></p></td>
                        <td><p style={this.state.counts[8] === undefined ? {} : { color: this.state.counts[8].color }}><strong>{this.state.counts[8] === undefined ? 0 : this.state.counts[8].count}</strong></p></td>
                        <td><p style={this.state.counts[9] === undefined ? {} : { color: this.state.counts[9].color }}><strong>{this.state.counts[9] === undefined ? 0 : this.state.counts[9].count}</strong></p></td>
                        <td><p style={this.state.counts[10] === undefined ? {} : { color: this.state.counts[10].color }}><strong>{this.state.counts[10] === undefined ? 0 : this.state.counts[10].count}</strong></p></td>
                        <td><p style={this.state.counts[11] === undefined ? {} : { color: this.state.counts[11].color }}><strong>{this.state.counts[11] === undefined ? 0 : this.state.counts[11].count}</strong></p></td>
                        <td><p style={this.state.counts[12] === undefined ? {} : { color: this.state.counts[12].color }}><strong>{this.state.counts[12] === undefined ? 0 : this.state.counts[12].count}</strong></p></td>
                        <td><p style={this.state.counts[13] === undefined ? {} : { color: this.state.counts[13].color }}><strong>{this.state.counts[13] === undefined ? 0 : this.state.counts[13].count}</strong></p></td>
                        <td><p style={this.state.counts[14] === undefined ? {} : { color: this.state.counts[14].color }}><strong>{this.state.counts[14] === undefined ? 0 : this.state.counts[14].count}</strong></p></td>
                        <td><p style={this.state.counts[15] === undefined ? {} : { color: this.state.counts[15].color }}><strong>{this.state.counts[15] === undefined ? 0 : this.state.counts[15].count}</strong></p></td>
                        <td><p style={this.state.counts[16] === undefined ? {} : { color: this.state.counts[16].color }}><strong>{this.state.counts[16] === undefined ? 0 : this.state.counts[16].count}</strong></p></td>
                        <td><p style={this.state.counts[17] === undefined ? {} : { color: this.state.counts[17].color }}><strong>{this.state.counts[17] === undefined ? 0 : this.state.counts[17].count}</strong></p></td>
                        <td><p style={this.state.counts[18] === undefined ? {} : { color: this.state.counts[18].color }}><strong>{this.state.counts[18] === undefined ? 0 : this.state.counts[18].count}</strong></p></td>
                        <td><p style={this.state.counts[19] === undefined ? {} : { color: this.state.counts[19].color }}><strong>{this.state.counts[19] === undefined ? 0 : this.state.counts[19].count}</strong></p></td>
                        <td><p style={this.state.counts[20] === undefined ? {} : { color: this.state.counts[20].color }}><strong>{this.state.counts[20] === undefined ? 0 : this.state.counts[20].count}</strong></p></td>
                        <td><p style={this.state.counts[21] === undefined ? {} : { color: this.state.counts[21].color }}><strong>{this.state.counts[21] === undefined ? 0 : this.state.counts[21].count}</strong></p></td>
                        <td><p style={this.state.counts["total"] === undefined ? {} : { color: this.state.counts["total"].color }}><strong>{this.state.counts["total"] === undefined ? 0 : this.state.counts["total"].count}</strong></p></td>
                        <td><strong>{this.state.counts["total"] === undefined ? 0 : this.getProjection(this.state.counts["total"].count)}</strong></td>
                      </tr>
                      <tr>
                        <td>Calls</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td><strong>{this.state.selected_agent.outboundToday === undefined || this.state.selected_agent.inboundToday === undefined ? 0 : this.state.selected_agent.outboundToday + this.state.selected_agent.inboundToday}</strong></td>
                        <td><strong>{this.getProjection(this.state.selected_agent.outboundToday === undefined || this.state.selected_agent.inboundToday === undefined ? 0 : this.state.selected_agent.outboundToday + this.state.selected_agent.inboundToday)}</strong></td>
                      </tr>

                    </tbody>
                  </Table>
                  <p style={{ color: "white" }} hidden={this.state.selected_agent.label.length < 1}>Call Count Last Updated: <strong>{new Date(this.state.selected_agent.callCountLastUpdated).toLocaleTimeString()}</strong></p>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row style={{ justifyContent: "center" }}>
            <Col lg="6">
              <Card className="text-center card-raised card-white" style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                <CardHeader>
                  <CardTitle tag="h3"><p style={{ color: "white" }}><strong>Daily Performance Report for </strong></p><p style={{ color: "white" }}><strong>{this.state.agent.name}</strong></p></CardTitle>
                  <img alt="profile" src={`https://centralbdc-bwpmi.mongodbstitch.com/profile-images/${this.state.agent.userId}.jpeg`} onError={(e) => { e.target.src = defaultLogo }} className="rounded-circle" height="100" width="100" />
                </CardHeader>
                <CardBody>
                  {(() => {
                    let agentIndex = this.state.top5.findIndex((u) => { return u._id === this.props.agent._id })
                    if (agentIndex === -1) return null
                    return (
                      <div >
                        <h4 style={{ color: "white" }}>Appointment Count: <strong>{this.state.top5[agentIndex].count}</strong></h4>
                        <h4 hidden={true} className="text-white">Daily Projection: <strong>{this.getProjection(this.state.agent.appointments.length)}</strong></h4>
                        <h4 style={{ color: "white" }}>Call Center Rank: <strong>#{this.state.top5[agentIndex].rank}</strong></h4>
                      </div>
                    );
                  })()}
                </CardBody>
              </Card>
            </Col>
            <Col lg="6">
              <Card className="text-center card-raised card-white" color="primary" style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                <CardHeader>
                  <CardTitle tag="h3"><p style={{ color: "white" }}><strong>MTD Performance Report for </strong></p><p style={{ color: "white" }}><strong>{this.state.agent.name}</strong>{this.state.mtdloadnew ? " (still loading)" : null}</p></CardTitle>
                  <img alt="profile" src={`https://centralbdc-bwpmi.mongodbstitch.com/profile-images/${this.state.agent.userId}.jpeg`} onError={(e) => { e.target.src = defaultLogo }} className="rounded-circle" height="100" width="100" />
                  {/* style={{ background: 'url("https://dummyimage.com/100x100/1d67a8/ffffff&text=No+Image")' }}  */}
                </CardHeader>
                <CardBody>
                  <CardImg top width="100%" hidden={!this.state.mtdtop5loading} src={this.props.utils.loading} style={{ backgroundColor: "white" }} />
                  {(() => {
                    let agentIndex = this.state.mtdTop5.findIndex((u) => { return u._id === this.props.agent._id })
                    console.log(agentIndex)
                    if (agentIndex === -1) return null
                    return (
                      <div >
                        <h4 style={{ color: "white" }}>Appointment Count: <strong>{this.state.mtdTop5[agentIndex].count}</strong></h4>
                        {/* <h4 hidden={true} className="text-white">Daily Projection: <strong>{this.getProjection(this.state.agent.appointments.length)}</strong></h4> */}
                        <h4 style={{ color: "white" }}>Call Center Rank: <strong>#{this.state.mtdTop5[agentIndex].rank}</strong></h4>
                      </div>
                    );
                  })()}
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row style={{ justifyContent: "center" }}>
            <Col lg="6">
              <Card className="card-raised card-white" style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                <CardHeader>
                  <div className="tools float-right">
                    {/* <Button
                      onClick={(e) => { e.preventDefault(); this.getTop5() }}
                    >

                      <i className={this.state.loading ? "tim-icons icon-refresh-02 tim-icons-is-spinning" : "tim-icons icon-refresh-02 "} />
                      
                    </Button> */}
                  </div>
                  <CardTitle tag="h3"><p style={{ color: "white" }}><strong>Top 10 Agents Today</strong></p></CardTitle>
                </CardHeader>
                <CardBody>
                  <Table >
                    <thead className="text-primary" >
                      <tr>
                        <th style={{ borderBottom: "1px solid white" }} className="text-center"><p style={{ color: "white" }}>Rank</p></th>
                        <th style={{ borderBottom: "1px solid white" }}></th>
                        <th style={{ borderBottom: "1px solid white" }} className="text-center"><p style={{ color: "white" }}>Agent Name</p></th>
                        <th style={{ borderBottom: "1px solid white" }} className="text-center"><p style={{ color: "white" }}># Approved Appointments</p></th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this._isMounted && this.state.top5.map((agent, index) => {
                          if (index > 9) return null;
                          return (
                            <tr key={index} className="text-center" style={{ borderTop: "1px solid white" }}>
                              <td style={{ borderBottom: "1px solid white" }}><p style={{ color: "white" }}><strong>{agent.rank}</strong></p></td>
                              <td style={{ borderBottom: "1px solid white" }}><img alt="profile" src={`https://centralbdc-bwpmi.mongodbstitch.com/profile-images/${agent.userId}.jpeg`} onError={(e) => { e.target.src = defaultLogo }} className="rounded-circle" height="50" width="50" /></td>
                              <td style={{ borderBottom: "1px solid white" }}><p style={{ color: "white" }}><strong>{agent.name}</strong></p></td>
                              <td style={{ borderBottom: "1px solid white" }}><p style={{ color: "white" }}><strong>{agent.count}</strong></p></td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
            <Col lg="6">
              <Card className="card-raised card-white" color="primary" style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                <CardHeader>
                  <CardTitle tag="h3"><p style={{ color: "white" }}><strong>Top 10 Agents MTD</strong>{this.state.mtdloadnew ? " (still loading)" : null}</p></CardTitle>
                </CardHeader>
                <CardBody>
                  <CardImg top width="100%" src={this.props.utils.loading} hidden={!this.state.mtdtop5loading} style={{ backgroundColor: "white" }} />
                  <Table style={this.state.mtdtop5loading ? { display: "none" } : {}}>
                    <thead className="text-primary" >
                      <tr >
                        <th style={{ borderBottom: "1px solid white" }} className="text-center"><p style={{ color: "white" }}>Rank</p></th>
                        <th style={{ borderBottom: "1px solid white" }}></th>
                        <th style={{ borderBottom: "1px solid white" }} className="text-center"><p style={{ color: "white" }}>Agent Name</p></th>
                        <th style={{ borderBottom: "1px solid white" }} className="text-center"><p style={{ color: "white" }}># Approved Appointments</p></th>
                      </tr>
                    </thead>
                    <tbody>

                      {
                        this._isMounted && this.state.mtdTop5.map((agent, index) => {
                          if (index > 9) return null;
                          return (
                            <tr key={index} className="text-center" >
                              <td style={{ borderBottom: "1px solid white" }}><p style={{ color: "white" }}><strong>{index + 1}</strong></p></td>
                              <td style={{ borderBottom: "1px solid white" }}><img alt="profile" src={`https://centralbdc-bwpmi.mongodbstitch.com/profile-images/${agent.userId}.jpeg`} onError={(e) => { e.target.src = defaultLogo }} className="rounded-circle" height="50" width="50" /></td>
                              <td style={{ borderBottom: "1px solid white" }}><p style={{ color: "white" }}><strong>{agent.name}</strong></p></td>
                              <td style={{ borderBottom: "1px solid white" }}><p style={{ color: "white" }}><strong>{agent.count}</strong></p></td>
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
          <Row style={{ justifyContent: "center" }}>
            <Col lg="12">
              <Card className="card-raised card-white" style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                <CardHeader>
                  <CardTitle tag="h3"><p style={{ color: "white" }}><strong>Record Breakers </strong><i style={{ color: "yellow" }} className="tim-icons icon-trophy" /></p></CardTitle>
                </CardHeader>
                <CardBody>
                  <Table  >
                    <thead className="text-primary" >
                      <tr>
                        <th style={{ borderBottom: "1px solid white" }}></th>
                        <th style={{ borderBottom: "1px solid white" }} className="text-center"><p style={{ color: "white" }}>Agent Name</p></th>
                        <th style={{ borderBottom: "1px solid white" }} className="text-center"><p style={{ color: "white" }}>Appointment Count</p></th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        let arr = []
                        for (let a in this.state.agents) {
                          let index = this.state.top5.findIndex((ap) => {
                            return ap._id === this.state.agents[a]._id
                          })
                          if (index === -1) continue
                          if (this.state.top5[index].count <= this.state.agents[a].personalRecord) continue
                          arr.push((
                            <tr key={index} className="text-center" style={{ borderTop: "1px solid white" }}>
                              <td style={{ borderBottom: "1px solid white" }}><img alt="profile" src={`https://centralbdc-bwpmi.mongodbstitch.com/profile-images/${this.state.agents[a].userId}.jpeg`} onError={(e) => { e.target.src = defaultLogo }} className="rounded-circle" height="50" width="50" /></td>
                              <td style={{ borderBottom: "1px solid white" }}><p style={{ color: "white" }}><strong> {this.state.agents[a].name}</strong></p></td>
                              <td style={{ borderBottom: "1px solid white" }}><p style={{ color: "white" }}><strong>{this.state.top5[index].count}</strong></p></td>
                            </tr>
                          ))
                        }
                        return arr;
                      })()}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Dashboard;
