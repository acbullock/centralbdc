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
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardImg,
  CardTitle,
  ListGroupItem,
  ListGroup,
  Progress,
  Input,
  Label,
  Container,
  Row,
  Col
} from "reactstrap";
import Select from "react-select"

class DealershipHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            agent: {},
            appointments:[],
            loading: true,
            currDealer: {},
            dealerAppts: [],
            numDays:0
        };

    }
    _isMounted = false
  async componentDidMount() {
      this._isMounted = true
    let agents = this._isMounted && await this.props.mongo.find("agents")
    let dealerships = this._isMounted && await this.props.mongo.find("dealerships")
    dealerships.sort((a,b)=>{
        if (a.label > b.label) return 1
        if(a.label < b.label) return -1
        return 0
    })
    let appts = []
    for(let a in agents){
        for (let b in agents[a].appointments){
            appts.push(agents[a].appointments[b])
        }
    }
    this._isMounted && appts.sort((a,b)=>{
        if(new Date(a.verified).getTime() > new Date(b.verified).getTime()) return -1
        if(new Date(a.verified).getTime() < new Date(b.verified).getTime()) return 1
        return 0
    })
    // appts = appts.filter((a)=>{
    //     let today = new Date()
    //     today.setHours(0,0,0,0)
    //     return new Date(a.verified).getTime() > today.getTime()
    // })
    

    this.setState({appointments: appts, dealerships: dealerships, loading:false})

  }
  async refreshList(){
      let appts = []
      this.setState({loading: true})
      appts = await this.state.appointments.filter((d)=>{
          
          return d.dealership.label == this.state.currDealer.label
      })
      let today = new Date()
    today.setHours(0,0,0,0)
    let day = new Date(today.getTime() - (24*3600000 * this.state.numDays))
    appts = appts.filter((a)=>{
        return new Date(a.verified).getTime() > day.getTime()
    })
      for(let z in appts){
        appts[z].agent_name = await this.getAgentFromId(appts[z].agent_id)
    }

    
      this.setState({dealerAppts: appts, loading: false})
  }
  async getAgentFromId(id){
      let agent = await this.props.mongo.findOne("agents", {_id: id})
      return agent.name
  }
  componentWillUnmount() {
      this._isMounted = false
    
  }
  render() {
    return (
      <>
        <div className="content">
          <Container >
            <Row>
              <Col className="ml-auto mr-auto text-center" md="6">
                <h1 className="title">Dealership History</h1>
                <h1 hidden={!this.state.loading}>Loading</h1>
                <Label>Dealership</Label>
                <Select
                    isDisabled={this.state.loading}
                    options={this.state.dealerships}
                    onChange={async (e)=>{await this.setState({currDealer: e}); this.refreshList()}}
                />
                <br/>
                <Label>
                    Number of Days in the Past (choose 0 for today only)
                </Label>
                <Input
                    type="number"
                    onChange={(e)=>{this.setState({numDays: e.target.value}); this.refreshList()}}
                />
              </Col>
            </Row>
            <br/><br/><br/>
            <Row>
              <Col lg="6" md="12">
              <h2>Appointment Count: {this.state.dealerAppts.length}</h2>
                <Card className="card-warning card-raised card-white" >
                
                  <CardBody >
                  
                    {
                        this.state.dealerAppts.map((appt, i) =>{
                            return (
                                <div key={i} style={{whiteSpace: "pre-wrap"}} >
                                    <p>Agent Name: <strong>{appt.agent_name}</strong></p>
                                    <p>{appt.internal_msg}</p>
                                    <p><strong>{new Date(appt.verified).toLocaleDateString()} {new Date(appt.verified).toLocaleTimeString()}</strong></p>
                                    <hr/>
                                </div>
                            )
                        })
                    }
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </>
    );
  }
}

export default DealershipHistory;
