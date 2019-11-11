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
// nodejs library that concatenates classes
// import classNames from "classnames";
// react plugin used to create charts
import { Line, Pie } from "react-chartjs-2";
// react plugin for creating vector maps
import { VectorMap } from "react-jvectormap";

// reactstrap components
import {
  Button,
  // ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  // CardFooter,
  CardTitle,
  // DropdownToggle,
  // DropdownMenu,
  // DropdownItem,
  // UncontrolledDropdown,
  // Label,
  // FormGroup,
  // Input,
  // Progress,
  Table,
  Row,
  Col,
  // UncontrolledTooltip
} from "reactstrap";

// core components
import {
  chartExample1,
  chartExample2,
  chartExample3,
  chartExample4
} from "../variables/charts.jsx";

// var mapData = {
//   AU: 760,
//   BR: 550,
//   CA: 120,
//   DE: 1300,
//   FR: 540,
//   GB: 690,
//   GE: 200,
//   IN: 200,
//   RO: 600,
//   RU: 300,
//   US: 2920
// };

class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      bigChartData: "data1",
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
      agents: {},
      data: {},
      options: {},
      top5: [],
      mostRecent: {
        name: "no one",
        time: new Date(0), dealership: ""
      },
      isOld: true
    };
    this.getAppointmentData = this.getAppointmentData.bind(this)
  }
  async componentDidMount() {
    this.setState({ loading: true })
    let user = await this.props.mongo.getActiveUser(this.props.mongo.mongodb)
    this.setState({ user });
    let agents = await this.props.mongo.db.collection("agents")
    this.setState({ agents: agents })
    let agent = await agents.findOne({ userId: user.userId })
    this.setState({ agent, isAdmin: agent.account_type === "admin" })
    await this.getAppointmentData()
    await this.getChartData()
    await this.getTop5()
    await this.isOld()
    this.setState({ loading: false })
  }
  isOld(){
    this.setState({loading: true})
    let  time = this.state.mostRecent.time
    let twoHoursAgo = new Date(new Date().getTime() - (3600*1000 + 1800 * 1000))
    if(time.getTime() < twoHoursAgo.getTime()){
      
      this.setState({isOld: true})
    }
    else{
      
       this.setState({isOld: false})
    }
    this.setState({loading: false})
  }
  async getChartData() {
    // let allAgents = []
    this.setState({ loading: true })
    let allAgents = await this.state.agents.find().toArray()
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
      let approved_appointments = appointments.filter((a) => {

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

          if (approved_appointments[a].verified.getTime() >= currDay.getTime() && approved_appointments[a].verified.getTime() <= (currDay.getTime() + day)) {
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

    this.setState({ options, data, loading: false })

  }
  async getTop5() {
    this.setState({ loading: true })
    let allAgents = await this.state.agents.find().toArray()

    let nums = []
    for (let a in allAgents) {
      let user = {
        name: allAgents[a].name,
        count: 0
      }

      for (let b in allAgents[a].appointments) {
        if (allAgents[a].appointments[b].verified != undefined) {
          if (this.state.mostRecent.time.getTime() < allAgents[a].appointments[b].verified.getTime()) {
            this.setState({ mostRecent: { name: allAgents[a].name, time: allAgents[a].appointments[b].verified, dealership: allAgents[a].appointments[b].dealership_name } })
          }
          let curr = new Date()
          curr.setHours(0, 0, 0, 0)
          if (allAgents[a].appointments[b].verified.getTime() > curr.getTime() &&
            allAgents[a].appointments[b].verified.getTime() < (curr.getTime() + (24 * 3600 * 1000))) {
            user.count++;
          }



        }
      }
      nums.push(user)
    }
    await nums.sort((a, b) => {
      if (a.count > b.count) {
        return -1;
      }
      if (a.count < b.count) {
        return 1
      }
      return 0;
    })
    this.setState({ top5: nums.slice(0, 5), loading: false })

  }
  async getAppointmentData() {
    this.setState({ loading: true })
    let agents;
    if (this.state.isAdmin === true) {
      agents = await this.props.mongo.db.collection("agents").find({}).asArray();
    }
    else {
      agents = await this.props.mongo.db.collection("agents").findOne({ userId: this.state.user.userId });
    }
    // let agents = await this.props.mongo.db.collection("agents").find({}).asArray();
    if (this.state.isAdmin === true) {
      let appointments = []
      await agents.map((agent) => {
        let appt = { name: agent.name, appointments: agent.appointments }
        appointments.push(appt);
        return agent;
      });
      appointments = await appointments.sort(function (a, b) {
        return (b.appointments.length - a.appointments.length)
      });
      this.setState({ appointments, loading: false });
    }
    else {
      let appt = { name: agents.name, appointments: agents.appointments }
      let appointments = [];
      appointments.push(appt)
      this.setState({ appointments, loading: false })
    }


  }
  createdAppointmentsSince(appts, numDays) {
    let someDay = new Date();
    let ret = 0;
    someDay.setDate(someDay.getDate() + (-1 * numDays));
    for (let appt in appts) {
      if (appts[appt].verified >= someDay && appts[appt].isPending === false) {
        ret++;
      }
    }
    return ret;
  }
  pendingAppointmentsSince(appts, numDays) {
    let someDay = new Date();
    let ret = 0;
    someDay.setDate(someDay.getDate() + (-1 * numDays));
    for (let appt in appts) {
      if (appts[appt].created >= someDay && appts[appt].isPending === true) {
        ret++;
      }
    }

    return ret;
  }

  render() {
    return (
      <>
        <div className="content">
          <Row>
            <Col lg="6">
              <Card color={this.state.isOld? "red": "success"}  >
                <CardHeader>
                  <div className="tools float-right">
                    <Button
                      onClick={(e) => { e.preventDefault(); this.getChartData(); this.getTop5(); this.isOld() }}
                    >

                      <i className={this.state.loading ? "tim-icons icon-refresh-02 tim-icons-is-spinning" : "tim-icons icon-refresh-02 "} />
                      {/* <i className="tim-icons icon-refresh-02 tim-icons-is-spinning" /> */}
                    </Button>
                  </div>
                  <CardTitle tag="h3" >Most Recent Appointment</CardTitle>
                </CardHeader>
                <CardBody>

                  <h2>
                    {this.state.mostRecent.time.toLocaleString()}</h2>
                    <h4>
                  <small className="text-muted">

                    Dealershp: {this.state.mostRecent.dealership}<br/>
                    Agent: {this.state.mostRecent.name}</small></h4><br/>
                    
                </CardBody>
              </Card>
            </Col>
            <Col lg="6">
              <Card>
                <CardHeader>
                  <div className="tools float-right">
                    <Button
                      onClick={(e) => { e.preventDefault(); this.getTop5() }}
                    >

                      <i className={this.state.loading ? "tim-icons icon-refresh-02 tim-icons-is-spinning" : "tim-icons icon-refresh-02 "} />
                      {/* <i className="tim-icons icon-refresh-02 tim-icons-is-spinning" /> */}
                    </Button>
                  </div>
                  <CardTitle tag="h3">Top 5 Agents Today</CardTitle>
                </CardHeader>
                <CardBody>
                  <Table responsive>
                    <thead className="text-primary">
                      <tr>
                        {/* <th className="text-center"></th> */}
                        <th className="text-center">Agent Name</th>
                        <th className="text-center"># Approved Appointments</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.top5.map((agent, index) => {
                          return (
                            <tr key={index} className="text-center">
                              <td key={index + "-name"}>{agent.name}</td>
                              <td key={index + "-count"}>{agent.count}</td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
            <Col lg="12">

              <Card hidden={!this.state.isAdmin}>
                <CardHeader>
                  <div className="tools float-right">
                    <Button
                      onClick={(e) => { e.preventDefault(); this.getChartData() }}
                    >

                      <i className={this.state.loading ? "tim-icons icon-refresh-02 tim-icons-is-spinning" : "tim-icons icon-refresh-02 "} />
                      {/* <i className="tim-icons icon-refresh-02 tim-icons-is-spinning" /> */}
                    </Button>
                  </div>
                  <CardTitle tag="h3">Approved Appointments</CardTitle>
                </CardHeader>
                <CardBody >
                  {/* <div className="chart-area" > */}
                  <Line
                    data={this.state.data}
                    options={this.state.options}
                    // height={50}

                  />
                  {/* </div> */}
                </CardBody>
              </Card>
              <Card>
                <CardHeader>

                  <div className="tools float-right">
                    <Button
                      onClick={(e) => { e.preventDefault(); this.getAppointmentData() }}
                    >

                      <i className={this.state.loading ? "tim-icons icon-refresh-02 tim-icons-is-spinning" : "tim-icons icon-refresh-02 "} />
                    </Button>
                  </div>
                  {/* <div className="tools float-right">
                    <UncontrolledDropdown>
                      <DropdownToggle
                        caret
                        className="btn-icon"
                        color="link"
                        data-toggle="dropdown"
                        type="button"
                      >
                        <i className="tim-icons icon-settings-gear-63" />
                      </DropdownToggle>
                      <DropdownMenu right>
                        <DropdownItem
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          Action
                        </DropdownItem>
                        <DropdownItem
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          Another action
                        </DropdownItem>
                        <DropdownItem
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          Something else
                        </DropdownItem>
                        <DropdownItem
                          className="text-danger"
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          Remove Data
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </div> */}
                  <CardTitle tag="h3">Created Appointments</CardTitle>
                </CardHeader>
                <CardBody>
                  <Table responsive>
                    <thead className="text-primary">
                      <tr>
                        {/* <th className="text-center"></th> */}
                        <th>Agent Name</th>
                        <th>1 day</th>
                        <th>7 days</th>
                        <th>30 days</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.appointments.map((app, index) => {
                          return (
                            <tr key={index}>
                              {/* <td className="text-center">
                              <div className="photo">
                                <img
                                  alt="..."
                                  src={require("../assets/img/tania.jpg")}
                                />
                              </div>
                              </td> */}
                              <td key={index + "-name"}>{app.name}</td>
                              <td key={index + "-day"}>{this.createdAppointmentsSince(app.appointments, 1)}</td>
                              <td key={index + "-week"}>{this.createdAppointmentsSince(app.appointments, 7)}</td>
                              <td key={index + "-month"}>{this.createdAppointmentsSince(app.appointments, 30)}</td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
              <Card>
                <CardHeader>
                  <div className="tools float-right">
                    <Button
                      onClick={(e) => { e.preventDefault(); this.getAppointmentData(); }}
                    >

                      <i className={this.state.loading ? "tim-icons icon-refresh-02 tim-icons-is-spinning" : "tim-icons icon-refresh-02"} />
                    </Button>
                  </div>
                  {/* <div className="tools float-right">
                    <UncontrolledDropdown>
                      <DropdownToggle
                        caret
                        className="btn-icon"
                        color="link"
                        data-toggle="dropdown"
                        type="button"
                      >
                        <i className="tim-icons icon-settings-gear-63" />
                      </DropdownToggle>
                      <DropdownMenu right>
                        <DropdownItem
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          Action
                        </DropdownItem>
                        <DropdownItem
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          Another action
                        </DropdownItem>
                        <DropdownItem
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          Something else
                        </DropdownItem>
                        <DropdownItem
                          className="text-danger"
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          Remove Data
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </div> */}
                  <CardTitle tag="h3">Pending Appointments</CardTitle>

                </CardHeader>
                <CardBody>
                  <Table responsive>
                    <thead className="text-primary">
                      <tr>
                        {/* <th className="text-center"></th> */}
                        <th>Agent Name</th>
                        <th>1 day</th>
                        <th>7 days</th>
                        <th>30 days</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.appointments.map((app, index) => {
                          return (
                            <tr key={index}>
                              {/* <td className="text-center">
                              <div className="photo">
                                <img
                                  alt="..."
                                  src={require("../assets/img/tania.jpg")}
                                />
                              </div>
                              </td> */}
                              <td key={index + "-name"}>{app.name}</td>
                              <td key={index + "-day"}>{this.pendingAppointmentsSince(app.appointments, 1)}</td>
                              <td key={index + "-week"}>{this.pendingAppointmentsSince(app.appointments, 7)}</td>
                              <td key={index + "-month"}>{this.pendingAppointmentsSince(app.appointments, 30)}</td>
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
