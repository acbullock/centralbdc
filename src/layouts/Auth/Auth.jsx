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
import { Route, Switch } from "react-router-dom";

import AuthNavbar from "../../components/Navbars/AuthNavbar.jsx";
import Footer from "../../components/Footer/Footer.jsx";

import routes from "../../routes.js";


class Pages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeColor: "blue",
      sidebarMini: true,
      opacity: 0,
      sidebarOpened: false,
      mongo: props.mongo,
      utils: props.utils,
    };
  }
  
  getRoutes = routes => {

    return routes.map((prop, key) => {
      if (prop.collapse) {
        return this.getRoutes(prop.views);
      }
      if (prop.layout === "/auth") {
        let C = prop.component
        return (
          <Route
            path={prop.layout + prop.path}
            // component={prop.component}
            render={(props) => <C {...props} 
            mongo={this.state.mongo}
            utils={this.state.utils}
            />}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  getActiveRoute = routes => {
    let activeRoute = "Default Brand Text";
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveRoute = this.getActiveRoute(routes[i].views);
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute;
        }
      } else {
        if (
          window.location.pathname.indexOf(
            routes[i].layout + routes[i].path
          ) !== -1
        ) {
          return routes[i].name;
        }
      }
    }
    return activeRoute;
  };
  getFullPageName = routes => {
    let pageName = this.getActiveRoute(routes);
    switch (pageName) {
      case "Pricing":
        return "pricing-page";
      case "Login":
        return "login-page";
      case "Register":
        return "register-page";
      case "Lock Screen":
        return "lock-page";
      default:
        return "Default Brand Text";
    }
  };
  async componentWillMount(){
    let user = await this.props.mongo.getActiveUser(this.props.mongo.mongodb)
    if(!user.userId){
      this.props.history.push("/auth/login")
    }
  }
  componentDidMount() {
    document.documentElement.classList.remove("nav-open");
    // if(this.props.mongo.mongodb.proxy.service.requestClient.activeUserAuthInfo.userId !== undefined){
    //   this.props.history.push("/admin/dashboard")
    // }
  }
  render() {
    return (
      <>
        <AuthNavbar brandText={this.getActiveRoute(routes) + " Page"} />
        <div className="wrapper wrapper-full-page" ref="fullPages">
          <div className={"full-page " + this.getFullPageName(routes)}>
            <Switch>{this.getRoutes(routes)}</Switch>
            <Footer fluid />
          </div>
        </div>
      </>
    );
  }
}

export default Pages;
