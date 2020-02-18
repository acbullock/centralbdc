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
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
// react plugin for creating notifications over the dashboard
import NotificationAlert from "react-notification-alert";

// core components
import AdminNavbar from "../../components/Navbars/AdminNavbar.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
// import FixedPlugin from "../../components/FixedPlugin/FixedPlugin.jsx";

import routes from "../../routes.js";

import logo from "../../assets/img/logo.png";
var ps;

class Admin extends React.Component {
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
      agent: null
    };
    this._isMounted = false
    this.getAgent = this.getAgent.bind(this)
    // console.log(props.mongo.mongodb.proxy.service.requestClient.activeUserAuthInfo)
  }
  getAgent = async () => {

    let user = this._isMounted && await this.props.mongo.getActiveUser(this.props.mongo.mongodb);
    let agent = this._isMounted && await this.props.mongo.find("agents", { userId: user.userId, isActive: true }, { projection: { skills: 1, name: 1, email: 1, department: 1, account_type: 1, "appointments.verified": 1, fileBinary: 1 } })
    agent = agent[0]
    return { agent, user }
  }
  async componentDidMount() {
    this._isMounted = true;
    let agentUser = this._isMounted && await this.getAgent();
    let user = agentUser.user
    if (user.userId === undefined || agentUser.agent === undefined) {
      this.state.agent = null
      this.props.history.push("/auth/login")
      return;
    }
    this._isMounted && this.setState({ agent: agentUser.agent, isAdmin: agentUser.agent.account_type === "admin", user: agentUser.user })

    if (navigator.platform.indexOf("Win") > -1) {
      document.documentElement.className += " perfect-scrollbar-on";
      document.documentElement.classList.remove("perfect-scrollbar-off");
      ps = new PerfectScrollbar(this.refs.mainPanel);
      let tables = document.querySelectorAll(".table-responsive");
      for (let i = 0; i < tables.length; i++) {
        ps = new PerfectScrollbar(tables[i]);
      }
    }
    this._isMounted && window.addEventListener("scroll", this.showNavbarButton);
  }
  componentWillUnmount() {
    this._isMounted = false;
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
      document.documentElement.className += " perfect-scrollbar-off";
      document.documentElement.classList.remove("perfect-scrollbar-on");
    }
    this._isMounted && window.removeEventListener("scroll", this.showNavbarButton);
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
    if (!this.refs.mainPanel) {
      return
    }
    if (this._isMounted) {
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
    }
  };
  getRoutes = routes => {

    return this._isMounted && routes.map((prop, key) => {
      if (prop.collapse) {
        return this.getRoutes(prop.views);
      }
      if (prop.layout === "/admin") {
        let C = prop.component
        if (!this.state.agent) return null
        return (
          <Route
            path={prop.layout + prop.path}
            // component={prop.component}
            render={(props) => <C {...props}
              mongo={this.state.mongo} utils={this.state.utils} agent={this.state.agent} />}
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
    if (this.state.agent === null || this.state.user === undefined) return null
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
        <Sidebar
          {...this.props}
          routes={routes}
          activeColor={this.state.activeColor}
          logo={{
            outterLink: "https://www.centralbdc.com/",
            text: "CentralBDC",
            imgSrc: logo
          }}
          user={this.state.user}
          agent={this.state.agent}
          closeSidebar={this.closeSidebar}
        />
        <div
          className="main-panel"
          ref="mainPanel"
          data={this.state.activeColor}
        >
          <AdminNavbar
            {...this.props}
            handleMiniClick={this.handleMiniClick}
            // brandText={this.getActiveRoute(routes)}
            brandText={this.state.isAdmin ? "Admin Dashboard" : "Agent Dashboard"}
            sidebarOpened={this.state.sidebarOpened}
            toggleSidebar={this.toggleSidebar}
            agent={this.state.agent}
            user={this.state.user}
          />
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

export default Admin;
