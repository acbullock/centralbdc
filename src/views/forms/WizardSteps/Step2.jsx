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
import { Row, Col, Card, CardBody, FormGroup, Form, CardHeader } from "reactstrap";
import Select from "react-select";
import ReactDatetime from "react-datetime";

// core components
Date.prototype.addHours = function (h) {
  this.setTime(this.getTime() + (h * 60 * 60 * 1000));
  return this;
}
class CreateAppointment extends React.Component {
  top100Films = [
    { title: "hello" }, { title: "world" }

  ]
  constructor(props) {
    super(props);
    this.state = {
      dealership: null,
      department: null,
      scenario: null,
      date: null,
      check: "none",
      source: null,
      dealerships: [],
      sources: [],
      scenarios: [],
      departments: [],
      agent: {},
      timeConstraints: { minutes: { step: 15 } },
      curDate: null
    };

  }
  async componentWillMount() {
    this.setState({ date: new Date().setHours(new Date().getHours() + 1, 0, 0, 0) })
    let { mongo } = this.props.wizardData
    let user = await mongo.getActiveUser(mongo.mongodb);

    let agent = await mongo.findOne("agents", { userId: user.userId })
    if (agent.department === "service") {
      let scenarios = await mongo.find("scenarios", { type: "Service" })
      this.setState({ department: "service", scenarios })
    }
    await this.setState({ agent })

    // let dealerships = await mongo.getCollection("dealerships")
    // let sources = await mongo.getCollection("sources")
    // sources = await sources.find({}).toArray()
    let sources = await mongo.find("sources")
    sources.sort((a, b) => {
      if (a.label < b.label) {
        return -1
      }
      if (a.label > b.label) {
        return 1
      }
      return 0
    })
    // dealerships = await dealerships.find({}).toArray()
    let dealerships = await mongo.find("dealerships")
    dealerships = dealerships.filter((d) => {
      let pos = false;
      let department = this.state.agent.department;
      if (department === "service") {
        pos = d.isService === true;
      }
      else if (department === "sales") {
        pos = d.isSales === true;
      }
      return pos && d.isActive === true
    })
    dealerships.sort((a, b) => {
      if (a.label < b.label) {
        return -1
      }
      if (a.label > b.label) {
        return 1
      }
      return 0
    })
    let departments = await mongo.find("departments")
    departments.sort((a, b) => {
      if (a.label < b.label) {
        return -1
      }
      if (a.label > b.label) {
        return 1
      }
      return 0
    })
    departments = departments.filter((d) => {
      return d.label !== "Service"
    })
    if (agent.department === "service") {
      this.setState({ department: { label: "Service", value: "1" } })
    }
    this.setState({ dealerships, sources, departments })
  }

  isValidated() {
    if (new Date().getTime() > (new Date(this.state.date).getTime())+(1000*60*60*3)) return false;
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    let curDay = days[new Date(this.state.date).getDay()]
    if (this.state.agent.department === "sales") {
      let curHrs = this.state.dealership.salesHours.filter((d) => { return d.day === curDay })
      curHrs = curHrs[0];
      if (curHrs.isClosed === true) return false
      //create a date with today's date but open/close times
      let curOpen = new Date(new Date(this.state.date).setHours(new Date(curHrs.open).getHours(), new Date(curHrs.open).getMinutes(), 0, 0));
      let curClose = new Date(new Date(this.state.date).setHours(new Date(curHrs.close).getHours(), new Date(curHrs.close).getMinutes(), 0, 0))
      if (new Date(this.state.date).getTime() < curOpen.getTime() ||
        new Date(this.state.date).getTime() > curClose.getTime()) {
        return false
      }
    }
    else if (this.state.agent.department === "service") {
      let curHrs = this.state.dealership.serviceHours.filter((d) => { return d.day === curDay })
      curHrs = curHrs[0];
      if (curHrs.isClosed === true) return false
      //create a date with today's date but open/close times
      let curOpen = new Date(new Date(this.state.date).setHours(new Date(curHrs.open).getHours(), new Date(curHrs.open).getMinutes(), 0, 0));
      let curClose = new Date(new Date(this.state.date).setHours(new Date(curHrs.close).getHours(), new Date(curHrs.close).getMinutes(), 0, 0))
      if (new Date(this.state.date).getTime() < curOpen.getTime() ||
        new Date(this.state.date).getTime() > curClose.getTime()) {
        return false
      }
    }

    if (this.state.date == "Invalid Date") {
      return false
    }
    // if (this.state.date < (new Date().getTime())){
    //   console.log("!@#")
    //   return false
    // }
    if (this.state.agent.department === "sales" && this.state.date > (new Date().getTime() + (4 * 24 * 3600 * 1000))) {
      return false
    }


    if (this.state.dealership == undefined ||
      this.state.department == undefined ||
      this.state.scenario == undefined)
      return false;

    if (this.state.agent.department === "sales" && this.state.dealership.label.length > 0 &&
      this.state.department.label.length > 0 &&
      this.state.scenario.label.length > 0)
      return true;
    if (this.state.agent.department === "service" && this.state.dealership.label.length > 0 &&
      this.state.scenario.label.length > 0)
      return true;
  }

  render() {
    return (
      <>
        <h5 className="info-text">Appointment Details</h5>
        <Row className="justify-content-center">
          <Col md="4">
            <Card className="card-raised card-white text-center" hidden={!this.state.dealership} color="primary" style={{ background: "linear-gradient(0deg, #000000 0%, #3469a6 100%)" }}>
              <h3 style={{ color: "white" }} ><strong>{this.state.dealership == undefined ? "" : this.state.dealership.label} Hours</strong></h3>
              {/* <hr style={{ borderBottom: "solid 1px white" }} /> */}
              {(() => {
                let selected_date = (new Date(this.state.date).getDay() + 6) % 7

                if (this.state.agent.department === "sales" && this.state.dealership !== null) {
                  return this.state.dealership.salesHours.map((d, i) => {
                    if (d.isClosed === true) {
                      if (i == selected_date) {
                        return <p key={i} style={{ color: "white" }}><strong>{d.day}: Closed</strong></p>
                      }
                      else {
                        return <p key={i} style={{ color: "white" }}>{d.day}: Closed</p>
                      }
                    }
                    else {
                      if (i == selected_date) {
                        return (<p key={i} style={{ color: "white" }}><strong>{d.day}: {new Date(d.open).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} - {new Date(d.close).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</strong></p>);
                      }
                      else {
                        return (<p key={i} style={{ color: "white" }}>{d.day}: {new Date(d.open).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} - {new Date(d.close).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</p>);

                      }
                    }

                  })

                }
                else if (this.state.agent.department === "service" && this.state.dealership !== null) {
                  return this.state.dealership.serviceHours.map((d, i) => {
                    if (d.isClosed === true) {
                      if (i == selected_date) {
                        return <p key={i} style={{ color: "white" }}><strong>{d.day}: Closed</strong></p>
                      }
                      else {
                        return <p key={i} style={{ color: "white" }}>{d.day}: Closed</p>
                      }

                    }
                    else {
                      if (i == selected_date) {
                        return (<p key={i} style={{ color: "white" }}><strong>{d.day}: {new Date(d.open).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} - {new Date(d.close).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</strong></p>);
                      }
                      else {
                        return (<p key={i} style={{ color: "white" }}>{d.day}: {new Date(d.open).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} - {new Date(d.close).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</p>);
                      }

                    }

                  })
                }
                return null

              })()}

            </Card>



          </Col>
          <Col md={this.state.dealership == undefined ? 12 : 8}>
            <Card>
              {/* <CardHeader>
                  <CardTitle>Appointment Date/Time</CardTitle>
                </CardHeader> */}
              <CardBody>

                <FormGroup>
                  <Select
                    className="react-select primary"
                    // className={classnames(this.state.firstnameState) primary}
                    classNamePrefix="react-select"
                    name="dealership"
                    value={this.state.dealership}
                    onChange={(value) => {
                      this.setState({ dealership: value })
                    }}
                    options={this.state.dealerships}
                    placeholder="Dealership (required)"
                  /><br />
                  <ReactDatetime
                    isValidDate={(current) => {
                      let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
                      let x = new Date(current);
                      let dayX = days[x.getDay()]
                      if (this.state.dealership) {
                        if (this.state.agent.department == "sales") {
                          dayX = this.state.dealership.salesHours.filter((d) => { return d.day === dayX })
                          dayX = dayX[0]
                          // this.setState({ timeConstraints: { hours: { min: new Date(new Date(dayX.open).getHours()), max: new Date(new Date(dayX.close).getHours() - 1), step: 1 }, minutes: { step: 15 } } })
                        }
                        else if (this.state.agent.department == "service") {
                          dayX = this.state.dealership.serviceHours.filter((d) => { return d.day === dayX })
                          dayX = dayX[0]
                          // this.setState({ timeConstraints: { hours: { min: new Date(new Date(dayX.open).getHours()), max: new Date(new Date(dayX.close).getHours() - 1), step: 1 }, minutes: { step: 15 } } })
                        }
                      }


                      let now = new Date(new Date().getTime() - (24 * 3600000))
                      let nowAnd3Days = new Date(now.getTime() + (4 * 24 * 60 * 60 * 1000))
                      if (this.state.agent.department === "service") {
                        return x > now && dayX.isClosed !== true
                      }
                      return x < nowAnd3Days && x > now && dayX.isClosed !== true
                    }}
                    timeConstraints={this.state.timeConstraints}
                    // timeConstraints={{  minutes: { step: 15 } }}
                    inputProps={{
                      disabled: !this.state.dealership,
                      className: "form-control",
                      placeholder: "Appointment date/time",
                      name: "date"
                    }}
                    value={this.state.date}
                    onChange={(value) => {
                      if(new Date(value).getTime() !== new Date(value).getTime()){
                        value = new Date(new Date().setHours(new Date().getHours() +1, 0,0,0))
                      }
                      let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
                      let x = new Date(value)
                      let dayX = days[x.getDay()]
                      if (this.state.dealership) {
                        if (this.state.agent.department == "sales") {
                          dayX = this.state.dealership.salesHours.filter((d) => { return d.day === dayX })
                          dayX = dayX[0]
                          this.setState({
                            timeConstraints: { hours: { min: new Date(dayX.open).getHours(), max: new Date(dayX.close).getHours(), step: 1 }, minutes: { step: 15 } }
                          })
                        }
                        else if (this.state.agent.department == "service") {
                          dayX = this.state.dealership.serviceHours.filter((d) => { return d.day === dayX })
                          dayX = dayX[0]
                          this.setState({
                            timeConstraints: { hours: { min: new Date(dayX.open).getHours(), max: new Date(dayX.close).getHours(), step: 1 }, minutes: { step: 15 } }
                          })
                        }
                      }
                      this.setState({ date: new Date(new Date(value)) })
                    }
                    }
                    className="primary"
                  /><br />
                  <FormGroup hidden={this.state.agent.department === "service"}>
                    <Select

                      className="react-select primary"
                      classNamePrefix="react-select"
                      name="department"
                      value={this.state.department}
                      onChange={async (e) => {
                        await this.setState({ department: e });
                        await this.setState({ scenario: null })
                        let scenarios = await this.props.wizardData.mongo.find("scenarios")
                        scenarios = await scenarios.filter((s) => {
                          return s.type == this.state.department.label
                        })
                        await this.setState({ scenarios })
                      }}
                      options={this.state.departments}
                      placeholder="Department (required)"
                    />
                  </FormGroup>
                  <br />
                  <Select
                    isDisabled={this.state.department == null && this.state.agent.department === "sales"}
                    className="react-select primary"
                    classNamePrefix="react-select"
                    name="scenarios"
                    value={this.state.scenario}
                    onChange={value => this.setState({ scenario: value })}
                    options={this.state.scenarios}
                    placeholder="Scenario (required)"
                  /><br />
                  <FormGroup hidden={this.state.agent.department === "service"}>
                    <Select
                      className="react-select primary"
                      classNamePrefix="react-select"
                      name="source"
                      value={this.state.source}
                      onChange={value => this.setState({ source: value })}
                      // options={[{value: "val2", label:"Hyundai USA"}, {value: "val1", label:"Data-Mining"}, {value:"", label:"None"}]}
                      options={this.state.sources}
                      placeholder="Source (optional)"
                    />
                  </FormGroup>


                </FormGroup>


              </CardBody>

            </Card>
          </Col>
        </Row>
      </>
    );
  }
}

export default CreateAppointment;
