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
  Card,
  CardBody,
  CardImg,
  Container,
  Row,
  Col
} from "reactstrap";


class AppointmentHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      agent: {},
      appointments: [],
      loading: false
    };

  }
  _isMounted = false
  async componentDidMount() {
    this.setState({ loading: true })
    this._isMounted = true
    this._isMounted && await this.setState({ agent: this.props.agent })
// 5dd961d7f802400017dd5716
    let appts = await this.props.mongo.aggregate("all_appointments", [
      {
        "$match": {
          "agent_id": this.props.agent._id,
          "verified": {
            "$gte": "2020-02-25T05:00:000Z"
          }
        }
      },
      {
        "$group": {
          "_id": {"agent_id": "$agent_id", "verified": "$verified"},
          "verified": {"$first": "$verified"},
          "internal_msg": {"$first": "$internal_msg"}
        }
      },
      {
        "$sort": {
          "verified": -1
        }
      }
    ])
    console.log(appts)
    // let appts = this.state.agent.appointments
    // this._isMounted && appts.sort((a, b) => {
    //   if (new Date(a.verified).getTime() > new Date(b.verified).getTime()) return -1
    //   if (new Date(a.verified).getTime() < new Date(b.verified).getTime()) return 1
    //   return 0
    // })
    let today = new Date()
    today.setHours(0, 0, 0, 0)
    appts = this._isMounted && appts.filter((a) => {
      return new Date(a.verified).getTime() > today.getTime()
    })

    this._isMounted && this.setState({ appointments: appts, loading: false })

  }
  componentWillUnmount() {
    this._isMounted = false

  }
  render() {
    if (this.state.loading) {
      return (
        <>
          <div className="content">
            <Container>
              <Col className="ml-auto mr-auto text-center" md="6">
                <Card color="transparent">
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
          <Container >
            <Row>
              <Col className="ml-auto mr-auto text-center" md="6">
                <h1 className="title">Appointment History for {this.state.agent.name}</h1>
                <h4 className="description">
                  These are the appointments you created <strong>today</strong>. (Most recent at the top)
                </h4>
              </Col>
            </Row>
            <br /><br /><br />
            <Row>
              <Col lg="6" md="12">
                <h2>Appointment Count: {this.state.appointments.length}</h2>
                <Card className="card-warning card-raised card-white" >

                  <CardBody >

                    {
                      this.state.appointments.map((appt, i) => {
                        return (
                          <div key={i} style={{ whiteSpace: "pre-wrap" }} >
                            <p>{appt.internal_msg}</p>
                            <p>{new Date(appt.verified).toLocaleDateString()} {new Date(appt.verified).toLocaleTimeString()}</p>
                            <hr />
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

export default AppointmentHistory;
