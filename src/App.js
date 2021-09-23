import logo from "./logo.svg";
import "./App.css";
import { React, useEffect, useState } from "react";
import XLSX from "xlsx";
import $ from "jquery";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import axios from "axios";
import Shopified from "./Shopified";
let base64 = require("base-64");
import { withRouter } from "react-router-dom";
import Main from "./Main";
import { SkuProvider } from "./SkuContext";

function App() {
  const [data, setData] = useState([]);
  const [unique, setUnique] = useState([]);
  const [loading, setLoading] = useState(false);
  const [upload, setUpload] = useState([]);
  var requestOptions = null;
  const auth = {
    API: "f3663d02d5f03c5949e201ce23b63bc7",
    Password: "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",
    SharedSecret: "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",
  };
  // let url =
  //   "https://thingproxy.freeboard.io/fetch/https://needynwanty.myshopify.com/admin/api/2019-07/products.json";

  useEffect(() => {
    // -------------------- Create webhook----------------------------------------------/

    var data3 = {
      webhook: {
        topic: "orders/create",
        address: "https://brandfer.herokuapp.com/orders/webhooks/create-order",
        format: "json",
      },
    };

    /////////////-------------------------------------------------------creating proxy free webhook---------------------------

    var editdata = {
      webhook: {
        id: 1044923318477,
        address: "https://brandfer.herokuapp.com/orders/webhooks/create-order",
      },
    };
  }, []);

  function serverUpload() {
    setLoading(true);
    // fetch post

    // console.log(upload); //group
    // console.log(unique); //Group

    for (var i = 0; i < upload.length; i++) {
      for (var j = 0; j < unique.length; j++) {
        if (
          upload[i].group === unique[j].Group &&
          upload[i].sku === unique[j].SKU
        ) {
          // unique.splice(j, 1);

          axios
            .delete(
              "https://brandfer.herokuapp.com/uploads/delete-upload/" +
                upload[i]._id
            )
            .then((res) => {
              console.log(res);
            })
            .catch((err) => {
              console.log("Error in upload deletion!");
            });
        }
      }
    }

    unique.map((mydata) => {
      console.log("server data" + mydata);
      requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          group: mydata.Group,
          sku: mydata.SKU,
          quantity2: mydata.QTY_2,
          quantity: mydata.Group_QTY,
        }),
      };

      fetch(
        "https://brandfer.herokuapp.com/uploads/create-upload",
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => {
          // console.log(data);
          setLoading(false);
          showAlert();
        });
    });

    // showAlert();
    // alert("Your file is being uploaded!");
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

  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: "buffer" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        resolve(data);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((d) => {
      // console.log(d);
      setData(d);

      setUnique(
        d.filter(function (el) {
          if (!this[el.SKU]) {
            this[el.SKU] = true;
            return true;
          }
          return false;
        }, Object.create(null))
      );
    });

    fetch("https://brandfer.herokuapp.com/uploads/")
      .then((response) => response.json())
      .then((data) => setUpload(data));
  };

  if (loading) {
    return (
      <div>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  function showAlert() {
    document.getElementById("alert-example").style.visibility = "visible";
    setTimeout(() => {
      document.getElementById("alert-example").style.visibility = "hidden";
    }, 3000);
  }

  return (
    <div className="App">
      <Main />
      <p className="fs-1">Shopify App</p>
      <div class="alert alert-secondary" id="alert-example" role="alert">
        File is uploaded
      </div>
      <div className="input-group mb-3">
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files[0];
            readExcel(file);
          }}
          className="form-control"
          aria-label="Sizing example input"
          aria-describedby="inputGroup-sizing-default"
        />
      </div>

      <br />

      <button type="button" className="btn btn-light " onClick={serverUpload}>
        Upload to server
      </button>

      <br />
      <br />
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">Group</th>
            <th scope="col">SKU</th>
            <th scope="col">Quantity-2</th>
            <th scope="col">Quantity</th>
          </tr>
        </thead>

        <tbody>
          {unique
            ? unique.map((mydata) => (
                <>
                  <>
                    <tr key={mydata._id}>
                      <td>{mydata.Group}</td>
                      <td>{mydata.SKU}</td>
                      <td>{mydata.QTY_2}</td>
                      <td>{mydata.Group_QTY}</td>
                    </tr>
                  </>
                </>
              ))
            : ""}
        </tbody>
      </table>
      <div>{/* <Shopified /> */}</div>
    </div>
  );
}

export default withRouter(App);
