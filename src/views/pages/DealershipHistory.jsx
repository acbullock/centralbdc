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
            dealerAppts: []
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

    this.setState({appointments: appts, dealerships: dealerships, loading:false})

  }
  async refreshList(e){
      let appts = []
      this.setState({loading: true})
      appts = await this.state.appointments.filter((d)=>{
          
          return d.dealership.label == e.label
      })
      this.setState({dealerAppts: appts, loading: false})
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
                <Select
                    isDisabled={this.state.loading}
                    options={this.state.dealerships}
                    onChange={(e)=>{this.setState({currDealer: e}); this.refreshList(e)}}
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
                                    <p>{appt.internal_msg}</p>
                                    <p>{new Date(appt.verified).toLocaleDateString()} {new Date(appt.verified).toLocaleTimeString()}</p>
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
