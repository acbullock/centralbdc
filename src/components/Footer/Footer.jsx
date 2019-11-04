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
/*eslint-disable*/
import React from "react";
import { Container, Row } from "reactstrap";
// used for making the prop types of this component
import PropTypes from "prop-types";

class Footer extends React.Component {
  render() {
    return (
      <footer
        className={"footer" + (this.props.default ? " footer-default" : "")}
      >
        <Container fluid={this.props.fluid ? true : false}>
          
          <ul className="nav">
            <li className="nav-item">
              <a className="nav-link" href="https://www.centralbdc.com">
                CentralBDC
              </a>
            </li>{" "}
            {/* <li className="nav-item">
              <a
                className="nav-link"
                href="https://www.creative-tim.com/presentation"
              >
                About us
              </a>
            </li>{" "}
            <li className="nav-item">
              <a className="nav-link" href="https://blog.creative-tim.com">
                Blog
              </a>
            </li> */}
          </ul>
          <div className="copyright">
            © <a style={{color:"#1d8cf8"}} href="https://centralbdc.com" target="_blank">
              CentralBDC
            </a>{" " +new Date().getFullYear()}
            
          </div>
        </Container>
      </footer>
    );
  }
}

Footer.propTypes = {
  default: PropTypes.bool,
  fluid: PropTypes.bool
};

export default Footer;
