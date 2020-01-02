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
import { Row, Col, Card, CardBody, FormGroup, Form } from "reactstrap";
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
      date: new Date().addHours(24).setHours(8, 0),
      check: "none",
      source: null,
      dealerships: [],
      sources: [],
      scenarios: [],
      departments: [],
      agent: {},
      timeConstraints: {}
    };

  }
  async componentWillMount() {
    let { mongo } = this.props.wizardData
    let user = await mongo.getActiveUser(mongo.mongodb);

    let agent = await mongo.findOne("agents", { userId: user.userId })
    let timeConstraints = {}
    if (agent.department === "sales") {
      timeConstraints = { hours: { min: 8, max: 20, step: 1 }, minutes: { step: 15 } }
    }
    else if (agent.department === "service") {
      let scenarios = await mongo.find("scenarios", { type: "Service" })
      this.setState({ department: "service", timeConstraints, scenarios })
      timeConstraints = { hours: { min: 5, max: 22, step: 1 }, minutes: { step: 15 } }
    }
    await this.setState({ agent, timeConstraints })

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
    if(agent.department === "service"){
      this.setState({department: {label: "Service", value: "1"}})
    }
    this.setState({ dealerships, sources, departments })
  }

  isValidated() {
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
    let dup = new Date(this.state.date)
    dup.setHours(8, 0)
    if (this.state.agent.department === "sales" && dup.getTime() > new Date(this.state.date).getTime()) {
      console.log("1")
      return false
    }
    dup.setHours(20, 30)
    if (dup.getTime() < new Date(this.state.date).getTime()) {
      console.log("12")
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
          <Col md="12">
            <Card>
              {/* <CardHeader>
                  <CardTitle>Appointment Date/Time</CardTitle>
                </CardHeader> */}
              <CardBody>
                <FormGroup>

                  <ReactDatetime
                    // input={false}
                    isValidDate={(current) => {
                      let x = new Date(current);
                      let now = new Date(new Date().getTime() - (24 * 3600000))
                      let nowAnd3Days = new Date(now.getTime() + (4 * 24 * 60 * 60 * 1000))
                      if (this.state.agent.department === "service") {
                        return x > now
                      }
                      return x < nowAnd3Days && x > now
                    }}
                    timeConstraints={this.state.timeConstraints}
                    // timeConstraints={{  minutes: { step: 15 } }}
                    inputProps={{
                      className: "form-control",
                      placeholder: "Appointment date/time",
                      name: "date"
                    }}
                    value={this.state.date}
                    onChange={(value) => {
                      this.setState({ date: new Date(value) })
                    }
                    }
                    className="primary"
                  /><br />
                  <Select
                    className="react-select primary"
                    // className={classnames(this.state.firstnameState) primary}
                    classNamePrefix="react-select"
                    name="dealership"
                    value={this.state.dealership}
                    onChange={value => { console.log(value); this.setState({ dealership: value }) }}
                    options={this.state.dealerships}
                    placeholder="Dealership (required)"
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
