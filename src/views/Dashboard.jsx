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
      options: {}
    };
    this.getAppointmentData = this.getAppointmentData.bind(this)
  }
  async componentDidMount() {
    this.setState({ loading: true })
    let user = await this.props.mongo.getActiveUser(this.props.mongo.mongodb)
    this.setState({ user });
    let agents = await this.props.mongo.db.collection("agents")
    this.setState({agents: agents})
    let agent = await agents.findOne({ userId: user.userId })
    this.setState({ agent, isAdmin: agent.account_type === "admin" })
    await this.getAppointmentData()
    await this.getChartData()
    this.setState({ loading: false })
  }
  async getChartData() {
    // let allAgents = []
    this.setState({loading: true})
    let allAgents =await  this.state.agents.find().toArray()
    const data = (canvas) => {
      var ctx = canvas.getContext("2d");

      var gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
      gradientStroke.addColorStop(0, '#80b6f4');
      gradientStroke.addColorStop(1, '#FFFFFF');

      var gradientFill = ctx.createLinearGradient(0, 170, 0, 50);
      gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
      gradientFill.addColorStop(1, "rgba(249, 99, 59, 0.40)");
      
      
      let appointments = []
      for(let agent in allAgents){
        for(let a in allAgents[agent].appointments){
          appointments.push(allAgents[agent].appointments[a])
        }
      }
      let approved_appointments = appointments.filter((a)=>{
        
        return a.verified != undefined
      })
      // console.log(approved_appointments)
      let recentLabels = []
      let recentData = []
      for(let i =14; i>=0; i--){
        let now = new Date()
        now.setHours(0,0,0,0)
        let day = 24*3600*1000
        let currDay = new Date(now.getTime() - (i*day))
        recentLabels.push(currDay.toLocaleDateString())
        let count = 0;
         for(let a in approved_appointments){

          if(approved_appointments[a].verified.getTime() >= currDay.getTime() && approved_appointments[a].verified.getTime() <= (currDay.getTime() + day) ){
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
    
    this.setState({options, data, loading: false})
    
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
  setBgChartData = name => {
    this.setState({
      bigChartData: name
    });
  };
  render() {
    return (
      <>
        <div className="content">
          {/* <Row>
            <Col xs="12">
              <Card className="card-chart">
                <CardHeader>
                  <Row>
                    <Col className="text-left" sm="6">
                      <h4 className="card-category">{this.state.agent.name}</h4>
                      <h5 className="card-category">Type: {this.state.agent.account_type}</h5>
                      <CardTitle tag="h2">Performance</CardTitle>
                    </Col>
                    <Col sm="6">
                      <ButtonGroup
                        className="btn-group-toggle float-right"
                        data-toggle="buttons"
                      >
                        <Button
                          color="info"
                          id="0"
                          size="sm"
                          tag="label"
                          className={classNames("btn-simple", {
                            active: this.state.bigChartData === "data1"
                          })}
                          onClick={() => this.setBgChartData("data1")}
                        >
                          <input defaultChecked name="options" type="radio" />
                          <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                            Accounts
                          </span>
                          <span className="d-block d-sm-none">
                            <i className="tim-icons icon-single-02" />
                          </span>
                        </Button>
                        <Button
                          color="info"
                          id="1"
                          size="sm"
                          tag="label"
                          className={classNames("btn-simple", {
                            active: this.state.bigChartData === "data2"
                          })}
                          onClick={() => this.setBgChartData("data2")}
                        >
                          <input name="options" type="radio" />
                          <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                            Purchases
                          </span>
                          <span className="d-block d-sm-none">
                            <i className="tim-icons icon-gift-2" />
                          </span>
                        </Button>
                        <Button
                          color="info"
                          id="2"
                          size="sm"
                          tag="label"
                          className={classNames("btn-simple", {
                            active: this.state.bigChartData === "data3"
                          })}
                          onClick={() => this.setBgChartData("data3")}
                        >
                          <input name="options" type="radio" />
                          <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                            Sessions
                          </span>
                          <span className="d-block d-sm-none">
                            <i className="tim-icons icon-tap-02" />
                          </span>
                        </Button>
                      </ButtonGroup>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div className="chart-area">
                    <Line
                      data={chartExample1[this.state.bigChartData]}
                      options={chartExample1.options}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg="3" md="6">
              <Card className="card-stats">
                <CardBody>
                  <Row>
                    <Col xs="5">
                      <div className="info-icon text-center icon-warning">
                        <i className="tim-icons icon-chat-33" />
                      </div>
                    </Col>
                    <Col xs="7">
                      <div className="numbers">
                        <p className="card-category">Number</p>
                        <CardTitle tag="h3">150GB</CardTitle>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <hr />
                  <div className="stats">
                    <i className="tim-icons icon-refresh-01" /> Update Now
                  </div>
                </CardFooter>
              </Card>
            </Col>
            <Col lg="3" md="6">
              <Card className="card-stats">
                <CardBody>
                  <Row>
                    <Col xs="5">
                      <div className="info-icon text-center icon-primary">
                        <i className="tim-icons icon-shape-star" />
                      </div>
                    </Col>
                    <Col xs="7">
                      <div className="numbers">
                        <p className="card-category">Followers</p>
                        <CardTitle tag="h3">+45k</CardTitle>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <hr />
                  <div className="stats">
                    <i className="tim-icons icon-sound-wave" /> Last Research
                  </div>
                </CardFooter>
              </Card>
            </Col>
            <Col lg="3" md="6">
              <Card className="card-stats">
                <CardBody>
                  <Row>
                    <Col xs="5">
                      <div className="info-icon text-center icon-success">
                        <i className="tim-icons icon-single-02" />
                      </div>
                    </Col>
                    <Col xs="7">
                      <div className="numbers">
                        <p className="card-category">Users</p>
                        <CardTitle tag="h3">150,000</CardTitle>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <hr />
                  <div className="stats">
                    <i className="tim-icons icon-trophy" /> Customers feedback
                  </div>
                </CardFooter>
              </Card>
            </Col>
            <Col lg="3" md="6">
              <Card className="card-stats">
                <CardBody>
                  <Row>
                    <Col xs="5">
                      <div className="info-icon text-center icon-danger">
                        <i className="tim-icons icon-molecule-40" />
                      </div>
                    </Col>
                    <Col xs="7">
                      <div className="numbers">
                        <p className="card-category">Errors</p>
                        <CardTitle tag="h3">12</CardTitle>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <hr />
                  <div className="stats">
                    <i className="tim-icons icon-watch-time" /> In the last
                    hours
                  </div>
                </CardFooter>
              </Card>
            </Col>
            <Col lg="4">
              <Card className="card-chart">
                <CardHeader>
                  <h5 className="card-category">Total Shipments</h5>
                  <CardTitle tag="h3">
                    <i className="tim-icons icon-bell-55 text-primary" />{" "}
                    763,215
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <div className="chart-area">
                    <Line
                      data={chartExample2.data}
                      options={chartExample2.options}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg="4">
              <Card className="card-chart">
                <CardHeader>
                  <h5 className="card-category">Daily Sales</h5>
                  <CardTitle tag="h3">
                    <i className="tim-icons icon-delivery-fast text-info" />{" "}
                    3,500€
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <div className="chart-area">
                    <Bar
                      data={chartExample3.data}
                      options={chartExample3.options}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg="4">
              <Card className="card-chart">
                <CardHeader>
                  <h5 className="card-category">Completed Tasks</h5>
                  <CardTitle tag="h3">
                    <i className="tim-icons icon-send text-success" /> 12,100K
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <div className="chart-area">
                    <Line
                      data={chartExample4.data}
                      options={chartExample4.options}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row> */}
          <Row>
            {/* <Col lg="12">
            <Card className="card-chart card-chart-pie">
                <CardHeader>
                  <h5 className="card-category">Simple Pie Chart</h5>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col xs="6">
                      <div className="chart-area">
                        <Pie
                          data={this.state.data}
                          options={this.state.options}
                        />
                      </div>
                    </Col>
                    <Col xs="6">
                      <CardTitle tag="h4">
                        <i className="tim-icons icon-trophy text-success" />{" "}
                        10.000$
                      </CardTitle>
                      <p className="category">A total of $54000</p>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col> */}
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
                    height={50}
                    
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
