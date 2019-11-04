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
// import { Link } from "react-router-dom";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardText,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Col,
} from "reactstrap";

import Mongo from "../../mongo";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      auth: {},
      error: "",
      user:{
      },
      isLoggedIn: false
    };
    this.onLogin = this.onLogin.bind(this);
  }
  async componentDidMount() {
    document.body.classList.toggle("login-page");
    let agent = await this.props.mongo.getActiveUser(this.props.mongo.mongodb)
    console.log(agent)
  }
  onLogin(email, password){

    Mongo.handleLogin(email, password)
    .then((user) => {
      this.setState({user, isLoggedIn: user.isLoggedIn})
      this.props.history.push('/admin/dashboard')
    })
    .catch((err)=>{
      this.setState({error: err})
      setTimeout(()=>{
        this.setState({error:""})
      }, 3000)
    })
  }
  componentWillUnmount() {
    document.body.classList.toggle("login-page");
  }

  render() {
    return (
        <div className="content">
          <Container>
            <Col className="ml-auto mr-auto" lg="4" md="6">
              <Form className="form" >
                <Card className="card-login card-white">
                  <CardHeader>
                    <img
                      alt="logo"
                      className="center"
                      src={require("../../assets/img/logo.png")}
                      style={{padding: 10}}
                    />
                  </CardHeader>
                  <CardBody>
                    <InputGroup>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="tim-icons icon-email-85" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input placeholder="Email" type="email" value={this.state.email} onChange={(event) => this.setState({email: event.target.value})}/>
                    </InputGroup>
                    <InputGroup>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="tim-icons icon-lock-circle" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input placeholder="Password" type="password" value={this.state.password} onChange={(event) => this.setState({password: event.target.value})}/>
                    </InputGroup>
                  </CardBody>
                  <CardFooter>
                    <Button
                      block
                      className="mb-3"
                      color="primary"
                      href="#pablo"
                      onClick={e => {e.preventDefault(); this.onLogin(this.state.email.toLowerCase(), this.state.password)}}
                      size="lg"
                    >
                      Log In
                      
                    </Button>
                    <Card color="warning" hidden={this.state.error.length === 0} style={{padding: 10}}>
                      <CardText color="white">
                        {this.state.error.message}
                      </CardText>
                    </Card>
                    {/* <div className="pull-left">
                      <h6>
                        <a
                          className="link footer-link"
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          Create Account
                        </a>
                      </h6>
                    </div>
                    <div className="pull-right">
                      <h6>
                        <a
                          className="link footer-link"
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          Need Help?
                        </a>
                      </h6>
                    </div> */}
                  </CardFooter>
                </Card>
              </Form>
            </Col>
          </Container>
        </div>
      // </>
    );
  }
}

export default Login;
