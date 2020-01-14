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
  FormGroup,
  Input,
  Label
} from "reactstrap";
import Select from 'react-select'
class DealershipDashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      thisMonth: "",
      todayCount: "",
      lastMonthCount: "",
      thisMonthCount: "",
      dealership: {},
      appointments: [],
      todayApps: [],
      tomorrowApps: [],
      thisMonthApps: [],
      lastMonthApps: [],
      dealerships: [],
      dealershipsInGroup: [],
      selected: {
        label: "",
        value: ""
      },
      showType: "sales"
    };

    this.getCallCountForMonth = this.getCallCountForMonth.bind(this)
    this.getStatsForDealer = this.getStatsForDealer.bind(this)
  }

  _isMounted = false;
  async componentDidMount() {
    this._isMounted = true
    this._isMounted && this.setState({ loading: true, thisMonthApps: "Loading..", lastMonthApps: "Loading..", thisMonthCount: "Loading..", lastMonthCount: "Loading.." })
    // let dealers = this._isMounted && await this.props.mongo.find("dealerships")
    // this.setState({dealerships: dealers})

    //get current user

    let user = this._isMounted && await this.props.mongo.getActiveUser(this.props.mongo.mongodb)
    let agent = this._isMounted && await this.props.mongo.findOne("dealership_users", { "userId": user.userId })
    let dealership = this._isMounted && await this.props.mongo.findOne("dealerships", { value: agent.dealership })
    this._isMounted && this.getStatsForDealer(dealership.value)

    this._isMounted && this.setState({ dealership: dealership, user, agent })
    this._isMounted && this.getDealershipsInGroup()
    // let appointments = this._isMounted && await this.props.mongo.findOne("appointments", { dealership: dealership.value })
    // appointments = appointments.appointments;
    // let thisMonthApps = appointments.filter((a) => {
    //   let x = new Date()
    //   x.setDate(1)
    //   x.setHours(0, 0, 0, 0)
    //   return new Date(a.verified).getTime() >= x.getTime()

    // })
    // let lastMonthApps = appointments.filter((a) => {
    //   let x = new Date()
    //   x.setMonth(x.getMonth() - 1)
    //   x.setDate(1)
    //   x.setHours(0, 0, 0, 0)

    //   let y = new Date()
    //   y.setDate(1)
    //   y.setHours(0, 0, 0, 0)

    //   return new Date(a.verified).getTime() >= x.getTime() && new Date(a.verified).getTime() <= y.getTime()
    // })

    // this.setState({
    //   thisMonthApps: thisMonthApps.length,
    //   lastMonthApps: lastMonthApps.length
    // });
    // let recordings = this._isMounted && await this.props.mongo.findOne("recordings", { dealership: dealership.value })
    // let lastMonthRecordings = recordings.lastMonthCount
    // let thisMonthRecordings = recordings.thisMonthCount

    // let thisMonth = new Date().toLocaleString("default", { month: "long" })
    // let lastMonth = new Date()
    // lastMonth.setMonth(new Date().getMonth() - 1);
    // lastMonth = lastMonth.toLocaleString("default", { month: "long" })
    // this._isMounted && await this.setState({
    //   loading: false,
    //   thisMonth: thisMonth,
    //   lastMonth: lastMonth
    // })
    //=====
    // let lastMonthYear = new Date()
    // lastMonthYear.setMonth(new Date().getMonth() - 1);
    // lastMonthYear = lastMonthYear.getFullYear()

    // let l = new Date()
    // l.setMonth(new Date().getMonth() - 1)

    // let lastMonthCount = this._isMounted && await this.getCallCountForMonth(dealership.dataMining.substring(1, dealership.dataMining.length - 1), l.getMonth() + 1, l.getFullYear())
    // lastMonthCount += this._isMounted && await this.getCallCountForMonth(dealership.sales.substring(1, dealership.sales.length - 1), l.getMonth() + 1, l.getFullYear())
    // let thisMonthCount = this._isMounted && await this.getCallCountForMonth(dealership.dataMining.substring(1, dealership.dataMining.length - 1), new Date().getMonth() + 1, new Date().getFullYear())
    // thisMonthCount += this._isMounted && await this.getCallCountForMonth(dealership.sales.substring(1, dealership.sales.length - 1), new Date().getMonth() + 1, new Date().getFullYear())

    // let lastMonthCount = 5;
    // let thisMonthCount = 10
    this._isMounted && this.setState({
      loading: false,

      // appointments: appointments,
      // lastMonthCount: lastMonthRecordings,
      agent: agent,
      // thisMonthCount: thisMonthRecordings
    })
  }
  async getDealershipsInGroup() {
    if (this.state.agent.access === "group") {
      let dealerships = this._isMounted && await this.props.mongo.find("dealerships")

      dealerships = dealerships.filter((d) => {
        // return d.isActive === true && d.group == this.state.dealership.group
        return d.group == this.state.dealership.group
      })
      dealerships.sort((a, b) => {
        if (a.label > b.label) return 1;
        if (a.label < b.label) return -1;
        return 0;
      })
      this._isMounted && this.setState({ dealershipsInGroup: dealerships })
    }
    else if (this.state.agent.access === "store") {
      this._isMounted && this.setState({ dealershipsInGroup: [this.state.dealership] })
    }
    else if (this.state.agent.access === "admin") {
      let dealerships = this._isMounted && await this.props.mongo.find("dealerships");
      // dealerships = dealerships.filter((d) => {
      //   return d.isActive === true
      // })
      dealerships.sort((a, b) => {
        if (a.label > b.label) return 1;
        if (a.label < b.label) return -1;
        return 0;
      })
      this._isMounted && this.setState({ dealershipsInGroup: dealerships })
    }

  }
  async getCallCountForMonth(phoneNumber, month, year) {
    this.setState({ loading: true })
    let stop = false;
    let page = 1;
    let voiceToken = this._isMounted && await this.props.mongo.findOne("utils", { _id: "5df2b825f195a16a1dbd4bf5" });
    voiceToken = voiceToken.voice_token;
    let records = []
    let currRecs = []
    while (!stop) {
      currRecs = this._isMounted && await this.props.mongo.callsForMonth(voiceToken, month, year, phoneNumber, page);
      records = this._isMounted && await records.concat(currRecs.records)
      if (!currRecs.paging) {
        stop = true;
        break;
      }
      if (!currRecs.paging.pageEnd) {
        stop = true;
        break;
      }
      stop = currRecs.paging.pageEnd["$numberDouble"] % 1000 !== 999;
      // console.log(currRecs.paging.pageEnd["$numberDouble"])
      page++
      await this.timeout(7000)
    }
    this._isMounted && this.setState({ loading: false })
    return records.length;
  }
  timeout(ms) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, ms);
    })
  }
  async getStatsForDealer(value) {
    this._isMounted && this.setState({ loading: true, thisMonthApps: "Loading..", lastMonthApps: "Loading..", thisMonthCount: "Loading..", lastMonthCount: "Loading..", tomorrowApps: "Loading..", todayApps: "Loading.." })

    let dealership = this._isMounted && await this.props.mongo.findOne("dealerships", { value })
    this._isMounted && this.setState({ dealership })
    let appointments = this._isMounted && await this.props.mongo.findOne("appointments", { dealership: dealership.value });
    let agents = this._isMounted && await this.props.mongo.find("agents");
    let agent_apps = [];
    for (let a in agents) {
      agent_apps = agent_apps.concat(agents[a].appointments)
    }
    agent_apps = agent_apps.filter((a) => {
      return a.dealership.value === dealership.value
    })

    appointments = appointments.appointments;
    console.log(appointments.length)
    appointments = appointments.concat(agent_apps);
    console.log(appointments.length)
    let todayApps = appointments.filter((a) => {
      let x = new Date();
      x.setHours(0, 0, 0, 0)
      let tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)
      return new Date(a.appointment_date).getTime() >= x.getTime() && new Date(a.appointment_date).getTime() < tomorrow.getTime()
    })
    let svcApps = todayApps.filter((a) => {
      return a.dealership_department === "Service"
    })
    let salesApps = todayApps.filter((a) => {
      return a.dealership_department !== "Service"
    })
    console.log("svc", svcApps.length)
    console.log("sales", salesApps.length)
    let tomorrowApps = appointments.filter((a) => {
      let x = new Date();
      x.setDate(x.getDate() + 1);
      x.setHours(0, 0, 0, 0)
      let next = new Date();
      next.setDate(next.getDate() + 2);
      next.setHours(0, 0, 0, 0)
      return new Date(a.appointment_date).getTime() >= x.getTime() && new Date(a.appointment_date).getTime() < next.getTime()
    })
    let svcApps2m = tomorrowApps.filter((a) => {
      return a.dealership_department === "Service"
    })
    let salesApps2m = tomorrowApps.filter((a) => {
      return a.dealership_department !== "Service"
    })
    let thisMonthApps = appointments.filter((a) => {
      let x = new Date()
      x.setDate(1)
      x.setHours(0, 0, 0, 0)
      return new Date(a.verified).getTime() >= x.getTime()

    })
    let thisMonthService = thisMonthApps.filter((a) => {
      return a.dealership_department === "Service"
    })
    let thisMonthSales = thisMonthApps.filter((a) => {
      return a.dealership_department !== "Service"
    })
    let lastMonthApps = appointments.filter((a) => {
      let x = new Date()
      x.setDate(1)
      x.setMonth(x.getMonth() - 1)
      x.setHours(0, 0, 0, 0)

      let y = new Date()
      y.setDate(1)
      y.setHours(0, 0, 0, 0)

      return new Date(a.verified).getTime() >= x.getTime() && new Date(a.verified).getTime() <= y.getTime()
    })
    let lastMonthService = lastMonthApps.filter((a) => {
      return a.dealership_department === "Service"
    })
    let lastMonthSales = lastMonthApps.filter((a) => {
      return a.dealership_department !== "Service"
    })
    this._isMounted && this.setState({
      todayApps: todayApps.length,
      tomorrowApps: tomorrowApps.length,
      thisMonthApps: thisMonthApps.length,
      lastMonthApps: lastMonthApps.length,
      todayServiceApps: svcApps.length,
      todaySalesApps: salesApps.length,
      tomorrowServiceApps: svcApps2m.length,
      tomorrowSalesApps: salesApps2m.length,
      thisMonthServiceApps: thisMonthService.length,
      thisMonthSalesApps: thisMonthSales.length,
      lastMonthServiceApps: lastMonthService.length,
      lastMonthSalesApps: lastMonthSales.length
    });
    let recordings = this._isMounted && await this.props.mongo.findOne("recordings", { dealership: dealership.value })
    let lastMonthRecordings = recordings.lastMonthCount
    let thisMonthRecordings = recordings.thisMonthCount

    let thisMonth = new Date().toLocaleString("default", { month: "long" })
    let lastMonth = new Date()
    lastMonth = new Date(lastMonth.setDate(1))
    lastMonth = new Date(lastMonth.setMonth(new Date().getMonth() - 1));
    lastMonth = lastMonth.toLocaleString("default", { month: "long" })
    this._isMounted && await this.setState({
      loading: false,
      thisMonth: thisMonth,
      lastMonth: lastMonth
    })
    this._isMounted && this.setState({
      loading: false,

      appointments: appointments,
      lastMonthCount: lastMonthRecordings,
      // agent: agent,
      thisMonthCount: thisMonthRecordings
    })

  }
  componentWillUnmount() {
    this._isMounted = false
  }


  render() {
    return (

      <>
        <div className="content">
          <label>Select Dealership:</label>
          <Select
            options={this.state.dealershipsInGroup}
            onChange={(e) => { this.getStatsForDealer(e.value) }}
          />
          <br />
          <Card className="card-raised card-white" color="transparent">
            <CardHeader color="#1d67a8">
              <CardTitle className="text-center">
                <legend><h1 style={{ color: "#1d67a8" }}>{this.state.dealership.label}</h1></legend>
                <FormGroup>
                  <Label md="3">
                    <Input name="showTypeSales" type="radio" value="sales" checked={this.state.showType === "sales"} onChange={(e) => { this.setState({ showType: e.target.value }) }} />{' '} <h3 style={{ marginLeft: "75px", color: "#1d67a8" }}><strong>Sales</strong></h3> </Label>
                  <Label md="3">
                    <Input name="showTypeService" type="radio" value="service" checked={this.state.showType === "service"} onChange={(e) => { this.setState({ showType: e.target.value }) }} />{' '} <h3 style={{ marginLeft: "100px", color: "#1d67a8" }}><strong>Service</strong></h3> </Label>
                </FormGroup >
              </CardTitle>
            </CardHeader>
            <hr />
            <Row style={{ justifyContent: "center" }}>
              <legend className="text-center">Upcoming Appointments</legend>
              <Col sm="4">
                <Card className="card-raised card-white" color="success" style={{ background: "linear-gradient(0deg, #1d67a8 0%, #000000 100%)" }}>
                  <CardHeader>
                    <CardTitle tag="h3" >
                      <p style={{color: "white"}}>Today's Appointments</p>
                    </CardTitle>
                  </CardHeader>
                  <CardBody className="text-center">
                    <h1 style={{color: "white"}}>{(() => {
                      if (this.state.todayApps === "Loading..") {
                        return <strong>Loading..</strong>
                      }
                      else {
                        return <strong>{this.state.showType == "sales" ? this.state.todaySalesApps : this.state.todayServiceApps}</strong>;
                      }
                    })()}</h1>
                  </CardBody>
                </Card>
              </Col>
              <Col sm="4">
                <Card className="card-raised card-white" color="success" style={{ background: "linear-gradient(0deg, #1d67a8 0%, #000000 100%)" }}>
                  <CardHeader>
                    <div className="tools float-right">
                    </div>
                    <CardTitle tag="h3" >
                      <p style={{color: "white"}}>Tomorrow's Appointments</p>
                    </CardTitle>
                  </CardHeader>
                  <CardBody className="text-center">
                    <h1 style={{color: "white"}}>{(() => {
                      if (this.state.tomorrowApps === "Loading..") {
                        return <strong>Loading..</strong>
                      }
                      else {
                        return <strong>{this.state.showType == "sales" ? this.state.tomorrowSalesApps : this.state.tomorrowServiceApps}</strong>;
                      }
                    })()}</h1>
                  </CardBody>
                </Card>

              </Col>
            </Row>
            <hr />
            {/* <hr /> */}
            <Row style={{ justifyContent: "center" }}>
              <legend className="text-center">Month-to-Date</legend>

              <Col sm="4">
                <Card className="card-raised card-white" style={{ background: "linear-gradient(0deg, #1d67a8 0%, #000000 100%)" }}>
                  <CardHeader>
                    <CardTitle tag="h3" >
                      <p style={{ color: "white" }}><strong>Total Calls: {this.state.thisMonth}</strong></p>
                    </CardTitle>
                  </CardHeader>
                  <CardBody className="text-center">
                    <h1 style={{ color: "white" }}><strong>{isNaN(this.state.thisMonthCount) ? "Loading.." : 2 * this.state.thisMonthCount}</strong></h1>

                  </CardBody>
                </Card>

              </Col>
              <Col sm="4">
                <Card className="card-raised card-white" style={{ background: "linear-gradient(0deg, #1d67a8 0%, #000000 100%)" }}>
                  <CardHeader>
                    <div className="tools float-right">
                    </div>
                    <CardTitle tag="h3" >
                      <p style={{color: "white"}}><strong>Total Appts: {this.state.thisMonth}</strong></p>
                    </CardTitle>
                  </CardHeader>
                  <CardBody className="text-center">
                    <h1 style={{color: "white"}}>{(() => {
                      if (this.state.thisMonthApps === "Loading..") {
                        return <strong>Loading..</strong>
                      }
                      else {
                        return <strong>{this.state.showType == "sales" ? this.state.thisMonthSalesApps : this.state.thisMonthServiceApps}</strong>;
                      }
                    })()}</h1>
                  </CardBody>
                </Card>

              </Col>
            </Row>
            <hr />
            <Row style={{ justifyContent: "center" }}>
              <legend className="text-center">Last Month</legend>
              <Col sm="4">
                <Card className="card-raised card-white" style={{ background: "linear-gradient(0deg, #1d67a8 0%, #000000 100%)" }}>
                  <CardHeader>
                    <CardTitle tag="h3" >
                      <p style={{ color: "white" }}><strong>Total Calls: {this.state.lastMonth}</strong></p>
                    </CardTitle>
                  </CardHeader>
                  <CardBody className="text-center">
                    <h1 style={{ color: "white" }}><strong>{isNaN(this.state.lastMonthCount) ? "Loading.." : 2 * this.state.lastMonthCount}</strong></h1>

                  </CardBody>
                </Card>

              </Col>
              <Col sm="4">
                <Card className="card-raised card-white" style={{ background: "linear-gradient(0deg, #1d67a8 0%, #000000 100%)" }}>
                  <CardHeader>
                    <CardTitle tag="h3" ><p style={{color: "white"}}><strong>Total Appts: {this.state.lastMonth}</strong></p></CardTitle>
                  </CardHeader>
                  <CardBody className="text-center">
                    <h1 style={{color:"white"}}>{(() => {
                      if (this.state.lastMonthApps === "Loading..") {
                        return <strong>Loading..</strong>
                      }
                      else {
                        return <strong>{this.state.showType == "sales" ? this.state.lastMonthSalesApps : this.state.lastMonthServiceApps}</strong>;
                      }
                    })()}</h1>
                  </CardBody>
                </Card>

              </Col>
            </Row>

          </Card>

        </div>
      </>
    );
  }
}

export default DealershipDashboard;
