import React, { useState, useContext } from "react";
import logo from "./img/final-logo.png";
import {
  BrowserRouter as Router,
  Link,
  Route,
  Switch,
  useHistory,
  useLocation,
} from "react-router-dom";
import "./Login.css";
import { withRouter } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import Main from "./Main";
import App from "./App";
import Shopified from "./Shopified";
import Home from "./Home";
import { SkuProvider } from "./SkuContext";
import { SkuContext } from "./SkuContext";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setIsauthenticated } = useContext(SkuContext);
  const { isauthenticated } = useContext(SkuContext);

  let history = useHistory();
  function getEmail(e) {
    e.preventDefault();
    setEmail(e.target.value);
  }

  function getPassword(e) {
    e.preventDefault();
    setPassword(e.target.value);
  }

  const handleSubmitClick = (e) => {
    // console.log(email);
    // console.log(password);
    e.preventDefault();
    // send a rest call to verify user

    const body5 = {
      email: email,
      password: password,
    };

    fetch("https://brandfer.herokuapp.com/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body5),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.result);

        if (data.result) {
          setIsauthenticated(true);
          // console.log("setisAuthenticatedtrue: " + isauthenticated);
          history.push("/main");
        } else {
          //  isauthenticated = false;
          // console.log(isauthenticated);
          setIsauthenticated(true);
          // console.log("setisAuthenticatedfalse: " + isauthenticated);

          history.push("/");
        }
      })
      // Manipulate the data retrieved back, if we want to do something with it
      .catch((err) => console.log(err));
  };

  return (
    <div className="main-div">
      <div
        className="card col-12 col-lg-4 login-card mt-2 hv-center"
        id="loginform"
      >
        <form>
          <div className="form-group text-left">
            <label htmlFor="exampleInputEmail1">Email address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={getEmail}
              aria-describedby="emailHelp"
              placeholder="Enter email"
            />
            <small id="emailHelp" className="form-text text-muted">
              We'll never share your email with anyone else.
            </small>
          </div>
          <div className="form-group text-left">
            <label htmlFor="exampleInputPassword1">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={getPassword}
              placeholder="Password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            onClick={handleSubmitClick}
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default withRouter(Login);
