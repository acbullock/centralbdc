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
  CardHeader,
  CardBody,
  CardFooter,
  CardText,
  // CardTitle,
  // Label,
  // FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col
} from "reactstrap";

class RemoveUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      loading: false
    };
  }
  async componentDidMount() {
    document.body.classList.toggle("register-page");
    
  }
  componentWillUnmount() {
    document.body.classList.toggle("register-page");
  }
  async unregisterUser(){
    this.setState({loading: true})
    let {db} = this.props.mongo;
    await this.props.mongo.handleRemoveUser(this.state.email)
    this.setState({email:""})
    this.setState({loading: false})
    this.props.history.push("/admin/dashboard")
    // await this.props.mongo.handleRegister(this.state.email, this.state.password)
    // .then((res)=>{
    //   db.collection("agents").insertOne({
    //     email: this.state.email,
    //     phone: this.state.phone,
    //     name: this.state.fullName,
    //     account_type: this.state.adminChecked === true ?  "admin": "agent",
    //     appointments: [],
    //     isApprover: this.state.adminChecked === true || this.state.approverChecked === true,
    //   }).catch((err)=>{
    //     console.log(err)
    //   })
    // })
    // .catch((err)=>{this.setState({error:err})});
    
  }
  render() {
    return (
      <>
        <div className="content">
          <Container>
            <Row>

              <Col className="mr-auto center" md="6">
                <Card className="card-register card-white">
                  <CardHeader>
                    <img
                      alt="logo"
                      src={require("../../assets/img/logo.png")}
                      style={{padding: 10}}
                    />
                  </CardHeader>
                  <CardBody>
                    <Form className="form">
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="tim-icons icon-single-02" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input placeholder="User Email" type="email" value={this.state.email} onChange={(e)=>{e.preventDefault(); this.setState({email: e.target.value})}}/>
                      </InputGroup>
                      
                    </Form>
                  </CardBody>
                  <CardFooter>
                  {/* <Button
                      className="btn-round float-left"
                      color="info"
                      href="#pablo"
                      onClick={e =>{ e.preventDefault(); this.props.history.push("/admin/dashboard")}}
                      size="lg"
                    >
                      Back To Dashboard
                    </Button> */}
                    <Button
                      className="btn-round float-right"
                      color="danger"
                      href="#pablo"
                      onClick={e => {e.preventDefault(); this.unregisterUser()}}
                      size="lg"
                    >
                      Remove User
                    </Button>
                    <Card color="warning" style={{padding: 10}}>
                      <CardText color="white">
                        WARNING: This will remove all this user's data from the database and cannot be undone.
                      </CardText>
                    </Card>
                  </CardFooter>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </>
    );
  }
}

export default RemoveUser;
