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
} from "reactstrap";

class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
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
      agents: {},
      dealerships: [],
      data: {},
      options: {},
      top5: [],
      mostRecent: {
        name: "no one",
        time: new Date(0), dealership: ""
      },
      isOld: true,
      todays_appts:[],
      todays_dealer_counts:[],
      elements: []
    };
    this.getAppointmentData = this.getAppointmentData.bind(this)
    
  }
  _isMounted = false;
  async componentDidMount() {
    this._isMounted = true
    this._isMounted && this.setState({ loading: true })
    let user = this._isMounted && await this.props.mongo.getActiveUser(this.props.mongo.mongodb)
    if(user.userId == undefined){
      this.props.history.push("/auth/login")
    }
    this._isMounted && this.setState({ user })
    let agent = this._isMounted && await this.props.mongo.findOne("agents", {"userId": user.userId})
    let agents = this._isMounted && await this.props.mongo.find("agents")
    this._isMounted && this.setState({ agent, agents, isAdmin: agent.account_type === "admin" })
    this._isMounted && await this.getAppointmentData()
    this._isMounted && await this.getChartData()
    // this._isMounted && await this.getBarChartData()
    this._isMounted && await this.getCountData()
    this._isMounted && await this.renderCount()
    this._isMounted && await this.getTop5()
    this._isMounted && await this.isOld()
    this._isMounted && this.setState({ loading: false })
  }
  componentWillUnmount(){
    this._isMounted = false
  }


  isOld(){
    this._isMounted && this.setState({loading: true})
    let  time = this.state.mostRecent.time
    let twoHoursAgo = new Date(new Date().getTime() - (3600*1000 + 1800 * 1000))
    if(new Date(time).getTime() < twoHoursAgo.getTime()){
      
      this._isMounted && this.setState({isOld: true})
    }
    else{
      
      this._isMounted && this.setState({isOld: false})
    }
    this._isMounted && this.setState({loading: false})
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
    let dealerships = await this.props.mongo.find("dealerships")
    dealerships.sort((a,b)=>{
      if(a.label > b.label) return 1;
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
      let approved_appointments = appointments.filter((a) => {
        let today = new Date()
        today.setHours(0,0,0,0)
        return new Date(a.verified).getTime() >= today.getTime()
        
      })
      let dealerLabels = []
      let dealerData = []
      for (let d in dealerships){
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
  async getCountData(){
    this.setState({loading: true})
    let agents = this.state.agents
    let dealerships = this._isMounted && await this.props.mongo.find("dealerships");
    let todays_appts = []
    let today = new Date()
    today.setHours(0,0,0,0)
    for(let a in agents){
      for(let b in agents[a].appointments){
        if(new Date(agents[a].appointments[b].verified).getTime() > today.getTime()){
          todays_appts.push(agents[a].appointments[b])
        }
      }
    }
    let todays_dealer_counts = []
    let newObj = {}
    for(let d in dealerships){
      newObj = {label: dealerships[d].label, count: 0}
      todays_dealer_counts[dealerships[d].label] = 0;
      for(let a in todays_appts){
        if(todays_appts[a].dealership.label == dealerships[d].label){
          newObj.count++;
          
        }
      }
      todays_dealer_counts.push(newObj)
    }
    this._isMounted && this.setState({todays_appts: todays_appts, todays_dealer_counts: todays_dealer_counts, loading: false})
    
  }
  async renderCount(){
    let elements = []
    
    let counts = this.state.todays_dealer_counts
    counts.sort((a,b)=>{
      if(a.count > b.count) return -1
      if(a.count < b.count) return 1
      return 0
    })
    for(let a in counts){
      if(counts[a].label != undefined && counts[a].count != undefined)
        elements.push(<p>{counts[a].label}: {counts[a].count}</p>)
    }
    
    // for(let d in dealerships){
    //   elements.push(<p key={dealerships[d]._id}>{dealerships[d].label}: {this.state.todays_dealer_counts[dealerships[d].label]}</p>)
    // }
    this.setState({elements: elements})
    // return elements
    
    
  }
  async getTop5() {
    this._isMounted && this.setState({ loading: true })
    // let allAgents = this._isMounted && await this.state.agents.find().toArray()
    let allAgents = this.state.agents
    let nums = []
    for (let a in allAgents) {
      let user = {
        name: allAgents[a].name,
        count: 0
      }

      for (let b in allAgents[a].appointments) {
        if (allAgents[a].appointments[b].verified != undefined) {
          if (new Date(this.state.mostRecent.time).getTime() < new Date(allAgents[a].appointments[b].verified).getTime()) {
            this._isMounted && this.setState({ mostRecent: { name: allAgents[a].name, time: allAgents[a].appointments[b].verified, dealership: allAgents[a].appointments[b].dealership } })
          }
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
    this._isMounted && this.setState({ top5: nums.slice(0, 5), loading: false })

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
    // let agents = await this.props.mongo.db.collection("agents").find({}).asArray();
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
    d.setHours(0,0,0,0)
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }
  createdAppointmentsSince(appts, numDays) {
    let ct = 0
    let curr = new Date()
    curr.setHours(0, 0, 0, 0)
    if(numDays == 0){
        for (let appt in appts){
          if (new Date(appts[appt].verified).getTime() >= curr.getTime()){
            ct++;
          }
        }
        return ct;
    }
    if(numDays == 7){
      let monday = this.getMonday(new Date())
      for (let appt in appts){
        if (new Date(appts[appt].verified).getTime() >= monday.getTime()){
          ct++;
        }
      }
      return ct;
    }
    if( numDays == 30){
      let date = new Date()
      var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      for (let appt in appts){
        if (new Date(appts[appt].verified).getTime() >= firstDay.getTime()){
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

  render() {
    if (this.state.loading) {
      return (
          <>
              <div className="content">
                  <Container>
                      <Col className="ml-auto mr-auto text-center" md="6">
                          <Card color="transparent" >
                              <CardImg top width="100%" src={this.props.utils.loading} />
                          </Card>
                      </Col>
                  </Container>
              </div>
          </>
      );
  }
    return (

      <>
        <div className="content">
        
          <Row>
            <Col lg="6">
              <Card color={this.state.isOld? "red": "success"} >
                <CardHeader>
                  <div className="tools float-right">
                    {/* <Button
                      onClick={(e) => { e.preventDefault(); this.getChartData(); this.getTop5(); this.isOld() }}
                    >

                      <i className={this.state.loading ? "tim-icons icon-refresh-02 tim-icons-is-spinning" : "tim-icons icon-refresh-02 "} />
                      
                    </Button> */}
                  </div>
                  <CardTitle tag="h3" >Most Recent Appointment</CardTitle>
                </CardHeader>
                <CardBody>

                  <h2>
                    {new Date(this.state.mostRecent.time).toLocaleString()}</h2>
                    <h4>
                  <small className="text-muted">

                    Dealershp: {this.state.mostRecent.dealership.label}<br/>
                    Agent: {this.state.mostRecent.name}</small></h4><br/>
                    
                </CardBody>
              </Card>
            </Col>
            <Col lg="6">
              <Card>
                <CardHeader>
                  <div className="tools float-right">
                    {/* <Button
                      onClick={(e) => { e.preventDefault(); this.getTop5() }}
                    >

                      <i className={this.state.loading ? "tim-icons icon-refresh-02 tim-icons-is-spinning" : "tim-icons icon-refresh-02 "} />
                      
                    </Button> */}
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
                    {/* <Button
                      onClick={(e) => { e.preventDefault(); this.getChartData() }}
                    >

                      <i className={this.state.loading ? "tim-icons icon-refresh-02 tim-icons-is-spinning" : "tim-icons icon-refresh-02 "} />
                      
                    </Button> */}
                  </div>
                  <CardTitle tag="h3">Approved Appointments</CardTitle>
                </CardHeader>
                <CardBody >
                  
                  <Line
                    data={this.state.data}
                    options={this.state.options}
                    height={100}

                  />
                </CardBody>
              </Card>
              {/* <Card hidden={!this.state.isAdmin}>
                <CardHeader>
                  <CardTitle tag="h3">Approved Appointments <strong>today</strong></CardTitle>
                </CardHeader>
                <CardBody >
                 <Bar
                    data={this.state.barData}
                    width={100}
                    height={50}
                    // options={{ maintainAspectRatio: false }}
                    options={this.state.barOptions}
                  />
                </CardBody>
              </Card> */}
              
              <Card>
                <CardHeader>

                  {/* <div className="tools float-right">
                    <Button
                      onClick={(e) => { e.preventDefault(); this.getAppointmentData() }}
                    >

                      <i className={this.state.loading ? "tim-icons icon-refresh-02 tim-icons-is-spinning" : "tim-icons icon-refresh-02 "} />
                    </Button>
                  </div> */}
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
                        <th>Today</th>
                        <th>This Week</th>
                        <th>This Month</th>
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
                              <td key={index + "-day"}>{this.createdAppointmentsSince(app.appointments, 0)}</td>
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
              {/* <Card>
                <CardHeader>
                  <div className="tools float-right">
                    <Button
                      onClick={(e) => { e.preventDefault(); this.getAppointmentData(); }}
                    >

                      <i className={this.state.loading ? "tim-icons icon-refresh-02 tim-icons-is-spinning" : "tim-icons icon-refresh-02"} />
                    </Button>
                  </div>
                  
                  <CardTitle tag="h3">Pending Appointments</CardTitle>

                </CardHeader>
                <CardBody>
                  <Table responsive>
                    <thead className="text-primary">
                      <tr>
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
              </Card> */}
            </Col>
            <Col lg="6">
            <Card hidden={!this.state.isAdmin || !["lexliveslife@gmail.com", "marc@centralbdc.com"].includes(this.state.agent.email)}>
                <CardHeader>
                <CardTitle tag="h3">Today's Appointments <strong>total: {this.state.todays_appts.length}</strong></CardTitle>
                </CardHeader>
                <CardBody >
                <Table responsive>
                    <thead className="text-primary">
                      <tr>
                        {/* <th className="text-center"></th> */}
                        <th className="text-center">Dealership Name</th>
                        <th className="text-center">Appointment Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.todays_dealer_counts.map((d, index) => {
                          return (
                            <tr key={index} className="text-center">
                              <td key={index + "-name"}>{d.label}</td>
                              <td key={index + "-count"}>{d.count}</td>
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
