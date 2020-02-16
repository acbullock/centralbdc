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

// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
// reactstrap components
import {
  Button,
  Card,
  CardImg,
  Container,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Tooltip
} from "reactstrap";
import Select from "react-select"
class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      mtdTooltip: false,
      bigChartData: "data1",
      barData: {},
      user: {
        userId: ""
      },
      agent: {

      },
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
      payment: 0
    };
    this.getAppointmentData = this.getAppointmentData.bind(this)
    this.getBreakDown = this.getBreakDown.bind(this)
    this.getMtdTop5 = this.getMtdTop5.bind(this)
    this.getProjection = this.getProjection.bind(this)
    this.calculatePay = this.calculatePay.bind(this)
  }
  _isMounted = false;
  async componentDidMount() {
    this._isMounted = true
    this._isMounted && this.setState({ loading: true })
    let agent = this.props.agent
    if (agent.department === "service" && agent.account_type !== "admin") {
      this._isMounted = false;
      this.props.history.push("/admin/service_dashboard")
    }
    else {
      let agents = this._isMounted && await this.props.mongo.find("agents",
        {
          isActive: true,
          department: "sales"
        },
        {
          projection: {
            personalRecord: 1,
            inboundToday: 1,
            outboundToday: 1,
            callCountLastUpdated: 1,
            "fileBinary": 1,
            name: 1,
            department: 1,
            "appointments.verified": 1,
          }
        })

      agents = this._isMounted && agents.map((a, i) => {
        return Object.assign(a, { label: a.name, value: i })
      })

      // agents = this._isMounted && agents.filter((a) => {
      //   return a.department === "sales" || a.account_type === "admin"
      // })
      // this._isMounted && agents.sort((a, b) => {
      //   if (a.label > b.label) return 1;
      //   if (a.label < b.label) return -1;
      //   return 0;
      // })
      if (agent.account_type !== "admin") {
        let index = this._isMounted && agents.findIndex((a) => { return a._id === agent._id })
        let selected = agents[index]
        this._isMounted && this.getBreakDown(agent)
        this._isMounted && this.setState({ selected_agent: selected })
      }
      for (let a in agents) {
        let imageUrl = ""
        if (agents[a].fileBinary !== undefined) {
          imageUrl = this._isMounted && await this.props.utils.imageUrlFromBuffer(this.props.utils.toArrayBuffer(agents[a].fileBinary.data))
        }
        agents[a].imageUrl = imageUrl;
      }
      if (agent.fileBinary !== undefined) {
        let imageUrl = this._isMounted && await this.props.utils.imageUrlFromBuffer(this.props.utils.toArrayBuffer(agent.fileBinary.data))
        agent.imageUrl = imageUrl
      }
      this._isMounted && this.setState({ agent, agents, isAdmin: agent.account_type === "admin" })
      this._isMounted && await this.getAppointmentData()
      // this._isMounted && await this.getChartData()
      // this._isMounted && await this.getBarChartData()
      this._isMounted && await this.getCountData()
      this._isMounted && await this.getTop5()
      this._isMounted && await this.getMtdTop5()
      this._isMounted && this.setState({ loading: false })
    }
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

  async getChartData() {
    // let allAgents = []
    this._isMounted && this.setState({ loading: true })
    // let allAgents = this._isMounted && await this.state.agents.find().toArray()
    let allAgents = this.state.agents
    const data = (canvas) => {
      var ctx = canvas.getContext("2d");

      var gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
      gradientStroke.addColorStop(0, '#80b6f4');
      gradientStroke.addColorStop(1, '#FFFFFF');

      var gradientFill = ctx.createLinearGradient(0, 170, 0, 50);
      gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
      gradientFill.addColorStop(1, "rgba(249, 99, 59, 0.40)");


      let appointments = []
      for (let agent in allAgents) {
        for (let a in allAgents[agent].appointments) {
          appointments.push(allAgents[agent].appointments[a])
        }
      }
      let approved_appointments = this._isMounted && appointments.filter((a) => {

        return a.verified != undefined
      })
      let recentLabels = []
      let recentData = []
      for (let i = 14; i >= 0; i--) {
        let now = new Date()
        now.setHours(0, 0, 0, 0)
        let day = 24 * 3600 * 1000
        let currDay = new Date(now.getTime() - (i * day))
        recentLabels.push(currDay.toLocaleDateString())
        let count = 0;
        for (let a in approved_appointments) {

          if (new Date(approved_appointments[a].verified).getTime() >= currDay.getTime() && new Date(approved_appointments[a].verified).getTime() <= (currDay.getTime() + day)) {
            count++;

          }
        }
        recentData.push(count)

      }
      return {
        labels: recentLabels,
        datasets: [{
          label: "Approved Count\n",
          borderColor: "#f96332",
          pointBorderColor: "#FFF",
          pointBackgroundColor: "#f96332",
          pointBorderWidth: 2,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 1,
          pointRadius: 4,
          fill: true,
          backgroundColor: gradientFill,
          borderWidth: 2,
          data: recentData
        }]
      }
    };
    const options = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      tooltips: {
        bodySpacing: 4,
        mode: "nearest",
        intersect: 0,
        position: "nearest",
        xPadding: 10,
        yPadding: 10,
        caretPadding: 10,
      },
      responsive: 1,
      scales: {
        yAxes: [{
          display: 1,
          ticks: {
            display: true
          },
          gridLines: {
            zeroLineColor: "transparent",
            drawTicks: false,
            display: true,
            drawBorder: false
          }
        }],
        xAxes: [{
          display: 1,
          ticks: {
            display: false
          },
          gridLines: {
            zeroLineColor: "transparent",
            drawTicks: false,
            display: false,
            drawBorder: false
          }
        }]
      },
      layout: {
        padding: { left: 15, right: 15, top: 15, bottom: 15 }
      }


    };

    this._isMounted && this.setState({ options, data, loading: false })

  }
  async getBarChartData() {
    // let allAgents = []
    this._isMounted && this.setState({ loading: true })
    // let allAgents = this._isMounted && await this.state.agents.find().toArray()
    let allAgents = this.state.agents
    let dealerships = this._isMounted && await this.props.mongo.find("dealerships", {}, { projection: { label: 1, value: 1 } })
    this._isMounted && dealerships.sort((a, b) => {
      if (a.label > b.label) return 1;
      if (a.label < b.label) return -1
      return 0
    })
    const data = (canvas) => {
      var ctx = canvas.getContext("2d");

      var gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
      gradientStroke.addColorStop(0, '#80b6f4');
      gradientStroke.addColorStop(1, '#FFFFFF');

      var gradientFill = ctx.createLinearGradient(0, 170, 0, 50);
      gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
      gradientFill.addColorStop(1, "rgba(249, 99, 59, 0.40)");


      let appointments = []
      for (let agent in allAgents) {
        for (let a in allAgents[agent].appointments) {
          appointments.push(allAgents[agent].appointments[a])
        }
      }
      let approved_appointments = this._isMounted && appointments.filter((a) => {
        let today = new Date()
        today.setHours(0, 0, 0, 0)
        return new Date(a.verified).getTime() >= today.getTime()

      })
      let dealerLabels = []
      let dealerData = []
      for (let d in dealerships) {
        dealerLabels.push(dealerships[d].label)
      }
      for (let i in dealerLabels) {
        let count = 0;
        for (let a in approved_appointments) {

          if (approved_appointments[a].dealership.label == dealerLabels[i]) {
            count++;

          }
        }
        dealerData.push(count)

      }
      return {
        labels: dealerLabels,
        datasets: [{
          label: "Appointment Count\n",
          borderColor: "#f96332",
          pointBorderColor: "#FFF",
          pointBackgroundColor: "#f96332",
          pointBorderWidth: 2,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 1,
          pointRadius: 4,
          fill: true,
          backgroundColor: gradientFill,
          borderWidth: 2,
          data: dealerData
        }]
      }
    };
    const options = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      tooltips: {
        bodySpacing: 4,
        mode: "nearest",
        intersect: 0,
        position: "nearest",
        xPadding: 10,
        yPadding: 10,
        caretPadding: 10,
      },
      responsive: 1,
      scales: {
        yAxes: [{
          display: 1,
          ticks: {
            display: true
          },
          gridLines: {
            zeroLineColor: "transparent",
            drawTicks: false,
            display: true,
            drawBorder: false
          }
        }],
        xAxes: [{
          display: 1,
          ticks: {
            display: false
          },
          gridLines: {
            zeroLineColor: "transparent",
            drawTicks: false,
            display: false,
            drawBorder: false
          }
        }]
      },
      layout: {
        padding: { left: 15, right: 15, top: 15, bottom: 15 }
      }


    };

    this._isMounted && this.setState({ barOptions: options, barData: data, loading: false })

  }
  async getCountData() {
    this.setState({ loading: true })
    let agents = this.state.agents
    let todays_appts = []
    let today = new Date()
    today.setHours(0, 0, 0, 0)
    for (let a in agents) {
      todays_appts = this._isMounted && todays_appts.concat(agents[a].appointments)
    }
    this._isMounted && this.setState({ todays_appts: todays_appts, loading: false })

  }
  async getTop5() {
    this._isMounted && this.setState({ loading: true })
    // let allAgents = this._isMounted && await this.state.agents.find().toArray()
    let allAgents = this.state.agents
    let nums = []
    for (let a in allAgents) {
      let user = {
        name: allAgents[a].name,
        count: 0,
        imageUrl: allAgents[a].imageUrl
      }

      for (let b in allAgents[a].appointments) {
        if (allAgents[a].appointments[b].verified != undefined) {
          let curr = new Date()
          curr.setHours(0, 0, 0, 0)
          if (new Date(allAgents[a].appointments[b].verified).getTime() >= curr.getTime() &&
            new Date(allAgents[a].appointments[b].verified).getTime() < (curr.getTime() + (24 * 3600 * 1000))) {
            user.count++;
          }
        }
      }
      nums.push(user)
    }
    this._isMounted && await nums.sort((a, b) => {
      if (a.count > b.count) {
        return -1;
      }
      if (a.count < b.count) {
        return 1
      }
      return 0;
    })
    this._isMounted && this.setState({ top5: nums, loading: false })

  }
  async getMtdTop5() {
    this._isMounted && this.setState({ loading: true, mtdloadnew: true })
    //will need to get rid of this when appts are no longer a part of agent record
    let allAgents = this.state.agents;
    let allApps = []
    let apps = []
    let totalApps = this._isMounted && await this.props.mongo.find("all_appointments", { dealership_department: { "$ne": "Service" }, verified: { "$gte": new Date(new Date(new Date().setDate(1)).setHours(0, 0, 0, 0)) } }, { projection: {  agent_id: 1 } })
    for (let a in allAgents) {
      apps = allAgents[a].appointments;
      allApps = this._isMounted && totalApps.filter((aps) => { return aps.agent_id === allAgents[a]._id })
      allApps = this._isMounted && allApps.concat(apps)
      let nums = this.state.mtdTop5;
      let first = new Date(new Date(new Date().setDate(1)).setHours(0, 0, 0, 0))
      let currApps = allApps
      let user = {
        name: allAgents[a].name,
        count: currApps.length,
        imageUrl: allAgents[a].imageUrl,
        mtdProj: Math.round(10 * 26 * (currApps.length / ((new Date().getTime() - first.getTime()) / (1000 * 60 * 60 * 24)))) / 10
      }
      if (allAgents[a]._id === this.state.agent._id)
        this.calculatePay(Math.round(user.mtdProj))
      nums.push(user)

      this._isMounted && await nums.sort((a, b) => {
        if (a.count > b.count) {
          return -1;
        }
        if (a.count < b.count) {
          return 1
        }
        return 0;
      })
      this._isMounted && this.setState({ mtdTop5: nums })
    }
    this._isMounted && this.setState({ loading: false, mtdloadnew: false })
  }
  async getAppointmentData() {
    this._isMounted && this.setState({ loading: true })
    let agents;
    if (this.state.isAdmin === true) {
      // agents = this._isMounted && await this.props.mongo.db.collection("agents").find({}).asArray();
      agents = this.state.agents

    }
    else {
      // agents = this._isMounted && await this.props.mongo.db.collection("agents").findOne({ userId: this.state.user.userId });
      agents = this.state.agent
    }
    // let agents = this._isMounted && await this.props.mongo.db.collection("agents").find({}).asArray();
    if (this.state.isAdmin === true) {
      let appointments = []
      this._isMounted && await agents.map((agent) => {

        let appt = { name: agent.name, appointments: agent.appointments }
        appointments.push(appt);
        return agent;
      });
      appointments = this._isMounted && await appointments.sort(function (a, b) {
        return (b.appointments.length - a.appointments.length)
      });
      this._isMounted && this.setState({ appointments, loading: false });
    }
    else {
      let appt = { name: agents.name, appointments: agents.appointments }
      let appointments = [];
      appointments.push(appt)
      this._isMounted && this.setState({ appointments, loading: false })
    }
  }
  getMonday(d) {
    d = new Date(d);
    d.setHours(0, 0, 0, 0)
    var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }
  createdAppointmentsSince(appts, numDays) {
    let ct = 0
    let curr = new Date()
    curr.setHours(0, 0, 0, 0)
    if (numDays == 0) {
      for (let appt in appts) {
        if (new Date(appts[appt].verified).getTime() >= curr.getTime()) {
          ct++;
        }
      }
      return ct;
    }
    if (numDays == 7) {
      let monday = this.getMonday(new Date())
      for (let appt in appts) {
        if (new Date(appts[appt].verified).getTime() >= monday.getTime()) {
          ct++;
        }
      }
      return ct;
    }
    if (numDays == 30) {
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
  getBreakDown(agent) {
    let appointments = agent.appointments
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
      let count = this._isMounted && appointments.filter((a) => {
        return new Date(a.verified).getTime() >= start.getTime() && new Date(a.verified).getTime() < end.getTime()
      })
      if (count.length == 2) {
        color = "yellow"
      }
      if (count.length > 2) {
        color = "green"
      }
      counts[i + 7] = { count: count.length, color }
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
                    options={this.state.agent.account_type == "admin" ? this.state.agents : this.state.agents.filter((a) => { return a.label === this.state.agent.name })}
                    value={this.state.agent.account_type == "admin" ? this.state.selected_agent : this.state.agents.filter((a) => { return a.label === this.state.agent.name })[0]}
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
                        <td><p style={this.state.counts[7] == undefined ? {} : { color: this.state.counts[7].color }}><strong>{this.state.counts[7] == undefined ? 0 : this.state.counts[7].count}</strong></p></td>
                        <td><p style={this.state.counts[8] == undefined ? {} : { color: this.state.counts[8].color }}><strong>{this.state.counts[8] == undefined ? 0 : this.state.counts[8].count}</strong></p></td>
                        <td><p style={this.state.counts[9] == undefined ? {} : { color: this.state.counts[9].color }}><strong>{this.state.counts[9] == undefined ? 0 : this.state.counts[9].count}</strong></p></td>
                        <td><p style={this.state.counts[10] == undefined ? {} : { color: this.state.counts[10].color }}><strong>{this.state.counts[10] == undefined ? 0 : this.state.counts[10].count}</strong></p></td>
                        <td><p style={this.state.counts[11] == undefined ? {} : { color: this.state.counts[11].color }}><strong>{this.state.counts[11] == undefined ? 0 : this.state.counts[11].count}</strong></p></td>
                        <td><p style={this.state.counts[12] == undefined ? {} : { color: this.state.counts[12].color }}><strong>{this.state.counts[12] == undefined ? 0 : this.state.counts[12].count}</strong></p></td>
                        <td><p style={this.state.counts[13] == undefined ? {} : { color: this.state.counts[13].color }}><strong>{this.state.counts[13] == undefined ? 0 : this.state.counts[13].count}</strong></p></td>
                        <td><p style={this.state.counts[14] == undefined ? {} : { color: this.state.counts[14].color }}><strong>{this.state.counts[14] == undefined ? 0 : this.state.counts[14].count}</strong></p></td>
                        <td><p style={this.state.counts[15] == undefined ? {} : { color: this.state.counts[15].color }}><strong>{this.state.counts[15] == undefined ? 0 : this.state.counts[15].count}</strong></p></td>
                        <td><p style={this.state.counts[16] == undefined ? {} : { color: this.state.counts[16].color }}><strong>{this.state.counts[16] == undefined ? 0 : this.state.counts[16].count}</strong></p></td>
                        <td><p style={this.state.counts[17] == undefined ? {} : { color: this.state.counts[17].color }}><strong>{this.state.counts[17] == undefined ? 0 : this.state.counts[17].count}</strong></p></td>
                        <td><p style={this.state.counts[18] == undefined ? {} : { color: this.state.counts[18].color }}><strong>{this.state.counts[18] == undefined ? 0 : this.state.counts[18].count}</strong></p></td>
                        <td><p style={this.state.counts[19] == undefined ? {} : { color: this.state.counts[19].color }}><strong>{this.state.counts[19] == undefined ? 0 : this.state.counts[19].count}</strong></p></td>
                        <td><p style={this.state.counts[20] == undefined ? {} : { color: this.state.counts[20].color }}><strong>{this.state.counts[20] == undefined ? 0 : this.state.counts[20].count}</strong></p></td>
                        <td><p style={this.state.counts[21] == undefined ? {} : { color: this.state.counts[21].color }}><strong>{this.state.counts[21] == undefined ? 0 : this.state.counts[21].count}</strong></p></td>
                        <td><p style={this.state.counts["total"] == undefined ? {} : { color: this.state.counts["total"].color }}><strong>{this.state.counts["total"] == undefined ? 0 : this.state.counts["total"].count}</strong></p></td>
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
                        <td><strong>{this.state.selected_agent.outboundToday == undefined || this.state.selected_agent.inboundToday == undefined ? 0 : this.state.selected_agent.outboundToday + this.state.selected_agent.inboundToday}</strong></td>
                        <td><strong>{this.getProjection(this.state.selected_agent.outboundToday == undefined || this.state.selected_agent.inboundToday == undefined ? 0 : this.state.selected_agent.outboundToday + this.state.selected_agent.inboundToday)}</strong></td>
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
                  <img src={(this.state.agent.imageUrl == undefined || this.state.agent.imageUrl.length < 1) ? 'https://dummyimage.com/100x100/1d67a8/ffffff&text=No+Image' : this.state.agent.imageUrl} className="rounded-circle" height="100" width="100" />
                </CardHeader>
                <CardBody>
                  {

                    this._isMounted && this.state.top5.map((a, i) => {
                      let namecount = {
                        name: this.state.agent.name,
                        count: 0
                      }
                      if (i > 0) return null;
                      let rank = 1
                      for (let agent in this.state.top5) {
                        if (this.state.top5[agent].count > this.state.agent.appointments.length) {
                          rank++;
                        }
                        else {
                          break;
                        }
                      }
                      return (
                        <div key={i}>
                          <h4 style={{ color: "white" }}>Appointment Count: <strong>{this.state.agent.appointments.length}</strong></h4>
                          <h4 hidden={true} className="text-white">Daily Projection: <strong>{this.getProjection(this.state.agent.appointments.length)}</strong></h4>
                          <h4 style={{ color: "white" }}>Call Center Rank: <strong>#{rank}</strong></h4>
                        </div>
                      );
                    })
                  }
                </CardBody>
              </Card>
            </Col>
            <Col lg="6">
              <Card className="text-center card-raised card-white" color="primary" style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                <CardHeader>
                  <CardTitle tag="h3"><p style={{ color: "white" }}><strong>MTD Performance Report for </strong></p><p style={{ color: "white" }}><strong>{this.state.agent.name}</strong>{this.state.mtdloadnew ? " (still loading)" : null}</p></CardTitle>
                  <img src={(this.state.agent.imageUrl == undefined || this.state.agent.imageUrl.length < 1) ? 'https://dummyimage.com/100x100/1d67a8/ffffff&text=No+Image' : this.state.agent.imageUrl} className="rounded-circle" height="100" width="100" />
                  {/* style={{ background: 'url("https://dummyimage.com/100x100/1d67a8/ffffff&text=No+Image")' }}  */}
                </CardHeader>
                <CardBody>
                  <CardImg top width="100%" hidden={!this.state.mtdtop5loading} src={this.props.utils.loading} style={{ backgroundColor: "white" }} />

                  {

                    this._isMounted && this.state.mtdTop5.map((a, i) => {
                      let bonus = 0;
                      let thisAgent = this._isMounted && this.state.mtdTop5.filter((ag) => {
                        return ag.name === this.state.agent.name
                      })
                      thisAgent = thisAgent[0];
                      if (thisAgent === undefined) {
                        return null;
                      }
                      if (i > 0) return null;
                      let rank = 1
                      for (let agent in this.state.mtdTop5) {
                        if (this.state.mtdTop5[agent].count > thisAgent.count) {
                          rank++;
                        }
                        else {
                          break;
                        }
                      }
                      if (parseInt(rank) === 1) {
                        bonus += 2500
                      }
                      else if (parseInt(rank) === 2) {
                        bonus += 2000
                      }
                      else if (parseInt(rank) === 3) {
                        bonus += 1500
                      }
                      else if (parseInt(rank) === 4) {
                        bonus += 1000
                      }
                      else if (parseInt(rank) === 5) {
                        bonus += 500
                      }
                      return (
                        <div key={i}>
                          <h4 style={{ color: "white" }}>Appointment Count: <strong>{thisAgent.count}</strong></h4>
                          {/* <h4 className="text-white">MTD Projection: <strong>{thisAgent.mtdProj} = <span style={{ color: "green" }}>${this.state.payment + bonus}</span></strong></h4> */}
                          <h4 hidden={true} id="mtdProjection" className="text-white">MTD Projection: <strong>{thisAgent.mtdProj}</strong></h4>
                          {/* <Tooltip isOpen={this.state.mtdTooltip} target="mtdProjection" toggle={() => { this._isMounted && this.setState({ mtdTooltip: !this.state.mtdTooltip }) }}>This estimate is based on working 26 days in the month.</Tooltip>  */}
                          <h4 style={{ color: "white" }}>Call Center Rank: <strong>#{rank}</strong></h4>
                        </div>
                      );
                    })
                  }
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
                              <td style={{ borderBottom: "1px solid white" }}><p style={{ color: "white" }}><strong>{index + 1}</strong></p></td>
                              <td style={{ borderBottom: "1px solid white" }}><img src={(agent.imageUrl == undefined || agent.imageUrl.length < 1) ? 'https://dummyimage.com/100x100/1d67a8/ffffff&text=No+Image' : agent.imageUrl} className="rounded-circle" height="50" width="50" /></td>
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
                              <td style={{ borderBottom: "1px solid white" }}><img src={(agent.imageUrl == undefined || agent.imageUrl.length < 1) ? 'https://dummyimage.com/100x100/1d67a8/ffffff&text=No+Image' : agent.imageUrl} className="rounded-circle" height="50" width="50" /></td>
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
                      {
                        this._isMounted && this.state.agents.map((agent, index) => {
                          if (agent.appointments.length === 0 || agent.appointments.length <= agent.personalRecord || agent.account_type !== "agent") return null;
                          return (
                            <tr key={index} className="text-center" style={{ borderTop: "1px solid white" }}>
                              <td style={{ borderBottom: "1px solid white" }}><img src={(agent.imageUrl == undefined || agent.imageUrl.length < 1) ? 'https://dummyimage.com/50x50/1d67a8/ffffff&text=No+Image' : agent.imageUrl} className="rounded-circle" height="50" width="50" /></td>
                              <td style={{ borderBottom: "1px solid white" }}><p style={{ color: "white" }}><strong>{agent.name}</strong></p></td>
                              <td style={{ borderBottom: "1px solid white" }}><p style={{ color: "white" }}><strong>{agent.appointments.length}</strong></p></td>
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
        </div>
      </>
    );
  }
}

export default Dashboard;
