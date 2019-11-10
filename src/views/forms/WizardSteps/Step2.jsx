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
import { Row, Col, Card,  CardBody, FormGroup } from "reactstrap";
import Select from "react-select";
import ReactDatetime from "react-datetime";

// core components
import apptvars from "../apptvars.js"
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
      date: new Date().addHours(4).setMinutes(0),
      check: "none",
      source: null,
      dealerships:[]
    };
    
  }
  async componentWillMount(){
    let {mongo} = this.props.wizardData
    let dealerships = await mongo.getCollection("dealerships")
    dealerships = await dealerships.find({}).toArray()
    dealerships.sort((a,b)=>{
      if(a.label < b.label){
        return -1
      }
      if (a.label > b.label){
        return 1
      }
      return 0
    })
    this.setState({dealerships})
  }
  
  isValidated(){
    console.log(this.state.dealership)
    if(this.state.dealership == undefined ||
      this.state.department == undefined ||
      this.state.scenario == undefined)
      return false;
    if(this.state.dealership.label.length > 0 && 
      this.state.department.label.length > 0 &&
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
                    timeConstraints={{ hours: { min: 9, max: 18, step: 1 }, minutes: { step: 15 } }}
                    inputProps={{
                      className: "form-control primary",
                      placeholder: "Appointment date/time",
                      name: "date"
                    }}
                    value={this.state.date}
                    onChange={value =>
                      this.setState({ date: value })
                    }
                    className="primary"
                  /><br />
                  <Select
                    className="react-select primary"
                    // className={classnames(this.state.firstnameState) primary}
                    classNamePrefix="react-select"
                    name="dealership"
                    value={this.state.dealership}
                    onChange={value => {console.log(value); this.setState({dealership:value})}}
                    options={this.state.dealerships}
                    placeholder="Dealership (required)"
                  /><br />
                  <Select
                    className="react-select primary"
                    classNamePrefix="react-select"
                    name="department"
                    value={this.state.department}
                    onChange={e => this.setState({ department: e})}
                    options={apptvars.departments}
                    placeholder="Department (required)"
                  /><br />
                  <Select
                    className="react-select primary"
                    classNamePrefix="react-select"
                    name="scenarios"
                    value={this.state.scenario}
                    onChange={value=> this.setState({scenario: value})}
                    options={apptvars.scenarios}
                    placeholder="Scenario (required)"
                  /><br/>
                 <Select
                    className="react-select primary"
                    classNamePrefix="react-select"
                    name="source"
                    value={this.state.source}
                    onChange={value=> this.setState({source: value})}
                    options={[{value: "val2", label:"Hyundai USA"}, {value: "val1", label:"Data-Mining"}, {value:"", label:"None"}]}
                    placeholder="Source (optional)"
                  />
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
