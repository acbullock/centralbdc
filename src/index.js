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
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

import AuthLayout from "./layouts/Auth/Auth.jsx";
import AdminLayout from "./layouts/Admin/Admin.jsx";
import AuthenticationLayout from "./layouts/Authentication/Authentication.jsx"
import DealershipLayout from "./layouts/Dealership/Dealership.jsx"
import "./assets/css/nucleo-icons.css";
import "./assets/scss/black-dashboard-pro-react.scss?v=1.0.0";
import "./assets/demo/demo.css";
import "react-notification-alert/dist/animate.css";
import Mongo from "./mongo.js"

import Utils from "./utils.js"
const hist = createBrowserHistory();

document.body.classList.toggle("white-content");



ReactDOM.render(
  <Router history={hist}>
    <Switch>
      <Route path="/auth" render={props => <AuthLayout {...props}
        mongo={Mongo} utils={Utils}
      />} />
      <Route path="/admin" render={props => <AdminLayout {...props}
        mongo={Mongo} utils={Utils}
      />} />
      <Route path="/authentication" render={props => <AuthenticationLayout {...props}
        mongo={Mongo} utils={Utils}
      />} />
      <Route path="/dealership" render={props => <DealershipLayout {...props}
        mongo={Mongo} utils={Utils}
      />} />
      <Redirect from="/" to="/auth/login" />
    </Switch>
  </Router>,
  document.getElementById("root")
);
