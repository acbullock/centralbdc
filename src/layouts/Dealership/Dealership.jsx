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
import { Col, Container, CardImg } from "reactstrap";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
// react plugin for creating notifications over the dashboard
import NotificationAlert from "react-notification-alert";

// core components
import DealershipNavbar from "../../components/Navbars/DealershipNavbar.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import DealershipSidebar from "../../components/Sidebar/DealershipSidebar.jsx";
// import FixedPlugin from "../../components/FixedPlugin/FixedPlugin.jsx";

import routes from "../../routes.js";

import logo from "../../assets/img/logo.png";
var ps;

class Dealership extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeColor: "primary",
      sidebarMini: true,
      opacity: 0,
      sidebarOpened: false,
      mongo: props.mongo,
      utils: props.utils,
      isAdmin: false,
      loading: false,
      agent: {},
      dealership_group: "",
      dealership: "",
    };
    this._isMounted = false
    // console.log(props.mongo.mongodb.proxy.service.requestClient.activeUserAuthInfo)
  }
  async componentWillMount() {
    this.setState({ loading: true })
    let user = await this.props.mongo.getActiveUser(this.props.mongo.mongodb)
    if (user.userId == undefined) {
      this.props.history.push("/authentication/login")
      return;
    }
    let agent = await this.props.mongo.findOne("dealership_users", { "userId": user.userId })
    if (agent == "") {
      this.props.history.push("/authentication/login")
      return;
    }
    this.setState({ agent: agent })

    if (this.refs.mainPanel != undefined && navigator.platform.indexOf("Win") > -1) {
      document.documentElement.className += " perfect-scrollbar-on";
      document.documentElement.classList.remove("perfect-scrollbar-off");
      ps = new PerfectScrollbar(this.refs.mainPanel);
      let tables = document.querySelectorAll(".table-responsive");
      for (let i = 0; i < tables.length; i++) {
        ps = new PerfectScrollbar(tables[i]);
      }
    }
    window.addEventListener("scroll", this.showNavbarButton);
    if (agent.isActive === false) {
      this.props.history.push("/authentication/login")
      return;
    }

    let dealer = await this.props.mongo.findOne("dealerships", { _id: this.state.agent.dealership })
    let group = await this.props.mongo.findOne("dealership_groups", { _id: dealer.group })
    group = group.label;
    dealer = dealer.label
    this.setState({ dealership_group: group, dealership: dealer, loading: false })
  }
  componentWillUnmount() {
    this._isMounted = false;
    if (navigator.platform.indexOf("Win") > -1) {
      if (ps !== undefined)
        ps.destroy();
      document.documentElement.className += " perfect-scrollbar-off";
      document.documentElement.classList.remove("perfect-scrollbar-on");
    }
    window.removeEventListener("scroll", this.showNavbarButton);
  }
  componentDidMount() {
    this._isMounted = true;
  }
  componentDidUpdate(e) {
    if (e.location.pathname !== e.history.location.pathname) {
      if (navigator.platform.indexOf("Win") > -1) {
        let tables = document.querySelectorAll(".table-responsive");
        for (let i = 0; i < tables.length; i++) {
          ps = new PerfectScrollbar(tables[i]);
        }
      }
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
      this.refs.mainPanel.scrollTop = 0;
    }
  }
  showNavbarButton = () => {
    if (
      document.documentElement.scrollTop > 50 ||
      document.scrollingElement.scrollTop > 50 ||
      this.refs.mainPanel.scrollTop > 50
    ) {
      this._isMounted && this.setState({ opacity: 1 });
    } else if (
      document.documentElement.scrollTop <= 50 ||
      document.scrollingElement.scrollTop <= 50 ||
      this.refs.mainPanel.scrollTop <= 50
    ) {
      this._isMounted && this.setState({ opacity: 0 });
    }
  };
  getRoutes = routes => {

    return routes.map((prop, key) => {
      if (prop.collapse) {
        return this.getRoutes(prop.views);
      }
      if (prop.layout === "/dealership") {
        let C = prop.component
        return (
          <Route
            path={prop.layout + prop.path}
            // component={prop.component}
            render={(props) => <C {...props}
              mongo={this.state.mongo} utils={this.state.utils} />}
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
  handleActiveClick = color => {
    this._isMounted && this.setState({ activeColor: color });
  };
  handleMiniClick = () => {
    let notifyMessage = "Sidebar mini ";
    if (document.body.classList.contains("sidebar-mini")) {
      this._isMounted && this.setState({ sidebarMini: false });
      notifyMessage += "deactivated...";
    } else {
      this._isMounted && this.setState({ sidebarMini: true });
      notifyMessage += "activated...";
    }
    let options = {};
    options = {
      place: "tr",
      message: notifyMessage,
      type: "primary",
      icon: "tim-icons icon-bell-55",
      autoDismiss: 7
    };
    this.refs.notificationAlert.notificationAlert(options);
    document.body.classList.toggle("sidebar-mini");
  };
  toggleSidebar = () => {
    this._isMounted && this.setState({
      sidebarOpened: !this.state.sidebarOpened
    });
    document.documentElement.classList.toggle("nav-open");
  };
  closeSidebar = () => {
    this._isMounted && this.setState({
      sidebarOpened: false
    });
    document.documentElement.classList.remove("nav-open");
  };
  render() {
    if (this.state.loading) {
      return (
        <>
          <div className="content">
            <Container>
              <Col className="ml-auto mr-auto text-center" md="6">
                {/* <Card color="transparent" > */}
                <CardImg top width="100%" src={this.props.utils.loading} />
                {/* </Card> */}
              </Col>
            </Container>
          </div>
        </>
      );
    }
    return (
      <div className="wrapper">
        <div className="rna-container">
          <NotificationAlert ref="notificationAlert" />
        </div>
        <div
          className="navbar-minimize-fixed"
          style={{ opacity: this.state.opacity }}
        >
          <button
            className="minimize-sidebar btn btn-link btn-just-icon"
            onClick={this.handleMiniClick}
          >
            <i className="tim-icons icon-align-center visible-on-sidebar-regular text-muted" />
            <i className="tim-icons icon-bullet-list-67 visible-on-sidebar-mini text-muted" />
          </button>
        </div>
        <DealershipSidebar
          {...this.props}
          routes={routes}
          activeColor={this.state.activeColor}
          logo={{
            outterLink: "https://www.centralbdc.com/",
            text: "CentralBDC",
            imgSrc: logo
          }}
          closeSidebar={this.closeSidebar}
        />
        <div
          className="main-panel"
          ref="mainPanel"
          data={this.state.activeColor}
        >
          <DealershipNavbar
            {...this.props}
            handleMiniClick={this.handleMiniClick}
            // brandText={this.getActiveRoute(routes)}
            // brandText={this.state.isAdmin ? "Admin Dashboard" : "Agent Dashboard"}
            brandText="Dealership Dashboard"
            sidebarOpened={this.state.sidebarOpened}
            toggleSidebar={this.toggleSidebar}
          />
          {/* <br />
          <br />
          <br />
          <h2 className="text-center"><strong>{this.state.dealership_group}</strong></h2> */}
          <Switch>{this.getRoutes(routes)}</Switch>
          {// we don't want the Footer to be rendered on full screen maps page
            this.props.location.pathname.indexOf("full-screen-map") !==
              -1 ? null : (
                <Footer fluid />
              )}
        </div>
        {/* <FixedPlugin
          activeColor={this.state.activeColor}
          sidebarMini={this.state.sidebarMini}
          handleActiveClick={this.handleActiveClick}
          handleMiniClick={this.handleMiniClick}
        /> */}
      </div>
    )
  }
}

export default Dealership;
