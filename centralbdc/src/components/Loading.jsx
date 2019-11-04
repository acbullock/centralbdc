import React from "react";
// used for making the prop types of this component
import PropTypes from "prop-types";


// import defaultImage from "../../assets/img/image_placeholder.jpg";
// import defaultAvatar from "../../assets/img/placeholder.jpg";
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardText,
    CardImg,
    // CardTitle,
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Container,
    Col,
  } from "reactstrap";

class Loading extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        isLoading: true
    };
    this.toggleLoading = this.toggleLoading.bind(this);
  }
  toggleLoading() {
    this.setState({isLoading: !this.state.isLoading});
  }
  render() {
    return (
      <Card className="card-login">
          <CardImg  src={require("../assets/img/loading.gif")} alt="Loading" hidden={!this.state.isLoading}>

          </CardImg>
      </Card>
    );
  }
}


export default Loading;
