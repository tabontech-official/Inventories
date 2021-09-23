import React, { useState, useEffect } from "react";
import axios from "axios";

import "./Server.css";
import { withRouter } from "react-router-dom";

const Server = () => {
  const [server, setServer] = useState([]);
  const [order, setOrder] = useState([]);
  const [final, setFinal] = useState([]);
  const [update, setUpdate] = useState([]);
  const [locationid, setLocationid] = useState([]);
  const [loading, setLoading] = useState(false);

  const auth = {
    API: "f3663d02d5f03c5949e201ce23b63bc7",
    Password: "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",
    SharedSecret: "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",
  };
  useEffect(() => {
    //---------------------------------------------location backend api---------------------------------------------------

    var dataFinal = {
      none: "null",
    };

    fetch("https://brandfer.herokuapp.com/orders/getLocation", {
      method: "POST",
      // headers: {
      //   Authorization: "Basic " + btoa(`${auth.API}:${auth.Password}`),
      //   "Content-Type": "application/json",
      // },
      body: JSON.stringify(dataFinal),
    })
      .then((response) => response.json())
      .then((data) => {
        //  console.log(data);
        setLocationid(data);
      }) // Manipulate the data retrieved back, if we want to do something with it
      .catch((err) => console.log(err));

    //---------------------------------------------location backend api--------------------------------------------------
  }, []);

  function getServerData() {
    setLoading(true);
    fetch("https://brandfer.herokuapp.com/uploads/")
      .then((response) => response.json())
      .then((data) => {
        setServer(data);
        setLoading(false);
      });
  }

  if (loading) {
    return (
      <div>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="server">
      <br />

      <div className="serverButton">
        <div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={getServerData}
          >
            Get Server Data
          </button>
        </div>
      </div>
      <br />
      <br />

      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">Group Code</th>
            <th scope="col">SKU</th>
            <th scope="col">Variant Quantity</th>
            <th scope="col">Group Quantity</th>
          </tr>
        </thead>

        <tbody>
          {server
            ? server.map((mydata) => (
                <tr key={mydata._id}>
                  <td>{mydata.group}</td>
                  <td>{mydata.sku}</td>
                  <td>{mydata.quantity2}</td>
                  <td>{mydata.quantity}</td>
                </tr>
              ))
            : ""}
        </tbody>
      </table>
    </div>
  );
};

export default Server;
