import React, { useState, useEffect } from "react";
import "./Home.css";
import { withRouter } from "react-router-dom";
import Main from "./Main";
import { SkuProvider } from "./SkuContext";
const Home = () => {
  const [order, setOrder] = useState([]);
  const auth = {
    API: "f3663d02d5f03c5949e201ce23b63bc7",
    Password: "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",
    SharedSecret: "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",
  };
  useEffect(() => {
    // -------------------- Create webhook----------------------------------------------//
    var data3 = {
      webhook: {
        topic: "orders/create",
        address: "https://brandfer.herokuapp.com/orders/webhooks/create-order",
        format: "json",
      },
    };

    /////////////---------------------------------------------------------------creating proxy free webhook---------------
    var editdata = {
      webhook: {
        id: 1044923318477,
        address: "https://brandfer.herokuapp.com/orders/webhooks/create-order",
      },
    };
  }, []);

  return (
    <div className="home">
      <Main />
      <h3 className="info">
        This App is created in order to facilitate inventroy management of
        Shopify stores.User need to upload Excel file inorder to give app data
        to process inventory.Any order placed in shopified will automically be
        processed in this app.
      </h3>
    </div>
  );
};

export default withRouter(Home);
