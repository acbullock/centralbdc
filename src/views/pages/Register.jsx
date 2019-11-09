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
  Label,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col
} from "reactstrap";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      phone: "",
      fullName: "",
      adminChecked: false,
      approverChecked: false,
      error:""
    };
  }
  async componentDidMount() {
    document.body.classList.toggle("register-page");
    let user = this.props.mongo.getActiveUser(this.props.mongo.mongodb);
    if(user.userId === undefined){
      this.props.history.push("/auth/login")
    }
    else{
      let agent = await this.props.mongo.db.collection("agents").findOne({userId: user.userId});
      if(agent.account_type!=="admin"){
        this.props.history.push("/admin/dashboard")
      }
    }
  }
  componentWillUnmount() {
    document.body.classList.toggle("register-page");
  }
  async registerUser(){
    let {db} = this.props.mongo;
    await this.props.mongo.handleRegister(this.state.email, this.state.password)
    .then((res)=>{
      db.collection("agents").insertOne({
        email: this.state.email,
        phone: this.state.phone,
        name: this.state.fullName,
        account_type: this.state.adminChecked === true ?  "admin": "agent",
        appointments: [],
        isApprover: this.state.adminChecked === true || this.state.approverChecked === true,
      }).catch((err)=>{
        console.log(err)
      })
    })
    .catch((err)=>{this.setState({error:err})});
    
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
                        <Input placeholder="Full Name" type="text" value={this.state.fullName} onChange={(e)=>{e.preventDefault(); this.setState({fullName: e.target.value})}}/>
                      </InputGroup>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="tim-icons icon-email-85" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input placeholder="Email" type="email"   value={this.state.email} onChange={(e)=>{e.preventDefault(); this.setState({email: e.target.value})}} />
                      </InputGroup>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="tim-icons icon-mobile" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input placeholder="Phone" type="tel"   value={this.state.phone} onChange={(e)=>{e.preventDefault(); this.setState({phone: e.target.value})}} />
                      </InputGroup>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="tim-icons icon-lock-circle" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input placeholder="Password" type="password" value={this.state.password} onChange={(e)=>{e.preventDefault(); this.setState({password: e.target.value})}}/>
                      </InputGroup>
                      <FormGroup check className="text-left">
                        <Label check>
                          <Input type="checkbox" checked={this.state.adminChecked} onChange={()=>{ this.setState({adminChecked: !this.state.adminChecked})}}/>
                          <span className="form-check-sign" />User is ADMIN
                        </Label>
                      </FormGroup>
                      <FormGroup check className="text-left">
                        <Label check>
                          <Input type="checkbox" checked={this.state.approverChecked} onChange={()=>{ this.setState({approverChecked: !this.state.approverChecked})}}/>
                          <span className="form-check-sign" />User is an APPROVER
                        </Label>
                      </FormGroup>
                    </Form>
                  </CardBody>
                  <CardFooter>
                  <Button
                      className="btn-round float-left"
                      color="info"
                      href="#pablo"
                      onClick={e =>{ e.preventDefault(); this.props.history.push("/admin/dashboard")}}
                      size="lg"
                    >
                      Back To Dashboard
                    </Button>
                    <Button
                      className="btn-round float-right"
                      color="primary"
                      href="#pablo"
                      onClick={e => {e.preventDefault(); this.registerUser()}}
                      size="lg"
                    >
                      Create User
                    </Button>
                    <Card color="warning" hidden={this.state.error.length === 0} style={{padding: 10}}>
                      <CardText color="white">
                        {this.state.error.message}
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

export default Register;
