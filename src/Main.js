import React, { useState, useContext } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from "react-router-dom";
import App from "./App";
import Server from "./Server";
import Home from "./Home";
import Shopified from "./Shopified";
import { withRouter } from "react-router-dom";
import "./Main.css";
import { SkuProvider } from "./SkuContext";
import { SkuContext } from "./SkuContext";
const Main = ({ myprop }) => {
  const { setIsauthenticated } = useContext(SkuContext);
  return (
    <div className="main">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/home">
            Shopify App
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                  className="nav-link active"
                  aria-current="page"
                  to="/upload"
                >
                  Upload
                </Link>
              </li>
              {/* <li className="nav-item">
                  <Link className="nav-link" to="/server">
                    Server
                  </Link>
                </li> */}
              <li className="nav-item">
                <Link className="nav-link" to="/shopified">
                  Shopify Sync
                </Link>
              </li>
            </ul>
          </div>

          <Link className="nav-link" to="/changepassword">
            Change Password
          </Link>

          <button
            type="button"
            class="btn btn-light"
            onClick={() => {
              setIsauthenticated(false);
            }}
          >
            Log Out
          </button>
        </div>
      </nav>
    </div>
  );
};

export default withRouter(Main);
