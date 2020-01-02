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
// react plugin used to create DropdownMenu for selecting items


// reactstrap components
import { Row, Col } from "reactstrap";

class CreateAppointment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step3Select: null,
      internal_msg: "",
      data: this.props.wizardData,
    };
    // this.generateInternalMessage = this.generateInternalMessage.bind(this)
  }
  componentDidMount() {
    this.generateInternalMessage()
  }
  componentWillReceiveProps() {
    this.generateInternalMessage()
  }
  makeTitleCase(name) {
    let title = name
    title = title.toLowerCase().split(' ')
    for (var i = 0; i < title.length; i++) {
      if (title[i].length < 1) continue;
      title[i] = title[i][0].toUpperCase() + title[i].slice(1);
    }
    title = title.join(" ")
    return title
  }
  generateInternalMessage() {
    let data = this.props.wizardData
    if (data.customer == undefined || data.appointment == undefined ||
      data.appointment.dealership == undefined ||
      data.appointment.department == undefined ||
      data.appointment.scenario == undefined) return
    else {
      let message = `${data.appointment.dealership.label}\n`
      message += `${this.makeTitleCase(data.customer.firstname)} ${this.makeTitleCase(data.customer.lastname)}\n`
      message += `(${data.customer.phone.substring(0, 3)}) ${data.customer.phone.substring(3, 6)} - ${data.customer.phone.substring(6, 10)}\n`
      let tempDate = new Date(data.appointment.date)
      message += tempDate.toLocaleDateString() + " " + tempDate.toLocaleString([], { hour: '2-digit', minute: '2-digit' }) + "\n"
      message += data.appointment.scenario.label + "\n"
      message += data.appointment.source != null && data.appointment.source.label.length > 0 && data.appointment.source.label !== "None" ? `Source: ${data.appointment.source.label}\n` : ""
      message += data.appointment.department.label !== "Service" ? `${data.appointment.department.label}` : "Service"
      return message
    }
  }

  generateCustomerMessage() {
    let data = this.props.wizardData
    if (data.customer == undefined || data.appointment == undefined ||
      data.appointment.dealership == undefined ||
      data.appointment.department == undefined ||
      data.appointment.scenario == undefined) return
    else {
      let message = `Hi ${this.makeTitleCase(data.customer.firstname)}, `
      if (data.appointment.department.label === "Service") {
        message += `I scheduled your Service appointment for ${data.appointment.scenario.label} at ${data.appointment.dealership.label} located at ${data.appointment.dealership.address}. `
      }
      else {
        message += `I scheduled your VIP appointment at ${data.appointment.dealership.label} located at ${data.appointment.dealership.address} for `
      }
      let tempDate = new Date(data.appointment.date)
      message += tempDate.toLocaleDateString() + " @ " + tempDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ". "
      message += data.appointment.department.label !== "Service" ? "We are excited to assist you! Please ask for the VIP manager at the receptionist desk." : "We are excited to assist you!"
      return message
      
    }
  }
  render() {
    return (
      <>
        <form>
          <Row className="justify-content-center">
            <Col sm="12">
              <h5 className="info-text">Review </h5>
            </Col>
            <Col sm="6">
              <h5 className="justify-content-center">Internal Text</h5>
              <blockquote className="blockquote" style={{ whiteSpace: "pre-wrap" }}>
                {this.generateInternalMessage()}</blockquote>
            </Col>
            <Col sm="6">
              <h5 className="justify-content-center">Customer Text</h5>
              <blockquote className="blockquote" style={{ whiteSpace: "pre-wrap" }}>
                {this.generateCustomerMessage()}</blockquote>
            </Col>
          </Row>
        </form>
      </>
    );
  }
}

export default CreateAppointment;
