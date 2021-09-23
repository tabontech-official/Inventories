import React, { useState, useContext } from "react";
import {
  BrowserRouter as Router,
  Link,
  Route,
  Switch,
  useHistory,
  useLocation,
} from "react-router-dom";
import App from "./App";
import Home from "./Home";
import Login from "./Login";
import Main from "./Main";
import Shopified from "./Shopified";
import ChangePassword from "./ChangePassword";
import ProtectedRoute from "./ProtectedRoute";
import { SkuProvider } from "./SkuContext";
import { SkuContext } from "./SkuContext";

const MyRoute = () => {
  const [isauthenticated, setIsauthenticated] = useState(false);
  // var isauthenticated = useContext(SkuContext);
  //  console.log("route is authenticated: " + isauthenticated);
  return (
    <div>
      <SkuContext.Provider value={{ isauthenticated, setIsauthenticated }}>
        <Router>
          <Switch>
            {/* <ProtectedRoute
            exact
            path="/upload"
            component={App}
            isAuth={isauthenticated}
          />

          <ProtectedRoute
            exact
            path="/main"
            component={Main}
            isAuth={isauthenticated}
          />

          <ProtectedRoute
            exact
            path="/shopified"
            component={Shopified}
            isAuth={isauthenticated}
          />

          <ProtectedRoute
            exact
            path="/home"
            component={Home}
            isAuth={isauthenticated}
          /> */}

            <ProtectedRoute
              exact
              path="/upload"
              component={App}
              isAuth={isauthenticated}
            />
            <ProtectedRoute
              exact
              path="/shopified"
              component={Shopified}
              isAuth={isauthenticated}
            />
            <ProtectedRoute
              exact
              path="/home"
              component={Home}
              isAuth={isauthenticated}
            />
            <ProtectedRoute
              exact
              path="/main"
              component={Main}
              isAuth={isauthenticated}
            />
            <ProtectedRoute
              exact
              path="/changepassword"
              component={ChangePassword}
              isAuth={isauthenticated}
            />
            <Route exact path="/" component={Login} />
          </Switch>

          {/* <Route exact path="/" component={Login} /> */}
          {/* <ProtectedRoute
        path="/main"
        component={Main}
        isAuth={isauthenticated}
        myprop={isauthenticated}
      /> */}
        </Router>
      </SkuContext.Provider>
    </div>
  );
};

export default MyRoute;
