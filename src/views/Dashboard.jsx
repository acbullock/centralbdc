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
// // react plugin used to create charts
// import { Line, Bar } from "react-chartjs-2";
// // react plugin for creating vector maps
// import { VectorMap } from "react-jvectormap";

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
// import {
//   chartExample1,
//   chartExample2,
//   chartExample3,
//   chartExample4
// } from "../variables/charts.jsx";

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
      isAdmin: false,
      appointments: []
    };
    this.getAppointmentData = this.getAppointmentData.bind(this)
  }
  componentDidMount() {
    let user = this.props.mongo.getActiveUser(this.props.mongo.mongodb);
    this.setState({ user });
    this.props.mongo.db.collection("agents")
      .findOne({ userId: user.userId })
      .then((res) => {
        this.setState({ agent: res, isAdmin: res.account_type === "admin" })
        this.getAppointmentData()
      })
      .catch((err => {
        console.log(err)
      }))
  }
  async getAppointmentData() {
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
      appointments = appointments.sort(function (a, b) {
        return (b.appointments.length - a.appointments.length)
      });
      console.log(appointments)
      this.setState({ appointments });
    }
    else {
      let appt = { name: agents.name, appointments: agents.appointments }
      let appointments = [];
      appointments.push(appt)
      this.setState({ appointments })
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
            <Col lg="12">
              <Card>
                <CardHeader>
                  <div className="tools float-right">
                    <Button className="btn-icon"
                      onClick={(e) => { e.preventDefault(); this.getAppointmentData() }}
                    >

                      <i className="tim-icons icon-refresh-01" />
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
                    <Button className="btn-icon"
                      onClick={(e) => { e.preventDefault(); this.getAppointmentData(); }}
                    >

                      <i className="tim-icons icon-refresh-01" />
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
            {/* <Col lg="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">Global Sales by Top Locations</CardTitle>
                  <p className="card-category">
                    All products that were shipped
                  </p>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col md="6">
                      <Table responsive>
                        <tbody>
                          <tr>
                            <td>
                              <div className="flag">
                                <img
                                  alt="..."
                                  src={require("../assets/img/US.png")}
                                />
                              </div>
                            </td>
                            <td>USA</td>
                            <td className="text-right">2.920</td>
                            <td className="text-right">53.23%</td>
                          </tr>
                          <tr>
                            <td>
                              <div className="flag">
                                <img
                                  alt="..."
                                  src={require("../assets/img/DE.png")}
                                />
                              </div>
                            </td>
                            <td>Germany</td>
                            <td className="text-right">1.300</td>
                            <td className="text-right">20.43%</td>
                          </tr>
                          <tr>
                            <td>
                              <div className="flag">
                                <img
                                  alt="..."
                                  src={require("../assets/img/AU.png")}
                                />
                              </div>
                            </td>
                            <td>Australia</td>
                            <td className="text-right">760</td>
                            <td className="text-right">10.35%</td>
                          </tr>
                          <tr>
                            <td>
                              <div className="flag">
                                <img
                                  alt="..."
                                  src={require("../assets/img/GB.png")}
                                />
                              </div>
                            </td>
                            <td>United Kingdom</td>
                            <td className="text-right">690</td>
                            <td className="text-right">7.87%</td>
                          </tr>
                          <tr>
                            <td>
                              <div className="flag">
                                <img
                                  alt="..."
                                  src={require("../assets/img/RO.png")}
                                />
                              </div>
                            </td>
                            <td>Romania</td>
                            <td className="text-right">600</td>
                            <td className="text-right">5.94%</td>
                          </tr>
                          <tr>
                            <td>
                              <div className="flag">
                                <img
                                  alt="..."
                                  src={require("../assets/img/BR.png")}
                                />
                              </div>
                            </td>
                            <td>Brasil</td>
                            <td className="text-right">550</td>
                            <td className="text-right">4.34%</td>
                          </tr>
                        </tbody>
                      </Table>
                    </Col>
                    <Col className="ml-auto mr-auto" md="6">
                      <VectorMap
                        map={"world_mill"}
                        backgroundColor="transparent"
                        zoomOnScroll={false}
                        containerStyle={{
                          width: "100%",
                          height: "300px"
                        }}
                        regionStyle={{
                          initial: {
                            fill: "#e4e4e4",
                            "fill-opacity": 0.9,
                            stroke: "none",
                            "stroke-width": 0,
                            "stroke-opacity": 0
                          }
                        }}
                        series={{
                          regions: [
                            {
                              values: mapData,
                              scale: ["#AAAAAA", "#444444"],
                              normalizeFunction: "polynomial"
                            }
                          ]
                        }}
                      />
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col> */}
          </Row>
        </div>
      </>
    );
  }
}

export default Dashboard;
