import React, { useEffect, useState, useCallback } from "react";
import "./shopified.css";
import { BounceLoader, BarLoader, BeatLoader } from "react-spinners";
import { ExportCSV } from "./ExportCSV";
import XLSX from "xlsx";
import axios from "axios";
import "./shopified.css";
let base64 = require("base-64");
import { withRouter } from "react-router-dom";
import Main from "./Main";
import { SkuProvider } from "./SkuContext";

var requestOptions = null;
const Shopified = () => {
  const [id, setId] = useState([]);
  const [variant, setVariant] = useState([]);
  const [handle, setHandle] = useState([]);
  const [server, setServer] = useState([]);
  const [final, setFinal] = useState([]);
  const [myserver, setMyserver] = useState([]);
  const [excel, setExcel] = useState([]);
  const [finalexcel, setFinalexcel] = useState([]);
  const [secondfinal, setSecondfinal] = useState([]);
  const [locationid, setLocationid] = useState({});
  const [loading, setLoading] = useState(false);
  const [groupload, setGroupload] = useState(false);
  var loader = false;
  // https://thingproxy.freeboard.io/fetch/       “http://gobetween.oklabs.org/” : free proxies

  const auth = {
    API: "f3663d02d5f03c5949e201ce23b63bc7",
    Password: "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",
    SharedSecret: "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",
  };
  let url =
    "https://thingproxy.freeboard.io/fetch/https://needynwanty.myshopify.com/admin/api/2019-07/products.json?fields=id,handle,title";

  useEffect(() => {
    ///////////--------------------------------------setting location-----------------------------------------------------------------

    var dataFinal = {
      none: "null",
    };
    fetch("https://brandfer.herokuapp.com/orders/getLocation", {
      method: "POST",
      headers: {
        Authorization: "Basic " + btoa(`${auth.API}:${auth.Password}`),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataFinal),
    })
      .then((response) => response.json())
      .then((data) => {
        //    console.log(data);
        setLocationid(data);
      }) // Manipulate the data retrieved back, if we want to do something with it
      .catch((err) => console.log(err));

    /////-------------------------------------------------------------------------------------------------------------------------------

    // fetching location of the store

    // -------------------- Create webhook----------------------------------------------//
    // var data3 = {
    //   webhook: {
    //     topic: "orders/create",
    //     address: "https://ordercreated.free.beeceptor.com/",
    //     format: "json",
    //   },
    // };

    // fetch(
    //   "https://thingproxy.freeboard.io/fetch/https://needynwanty.myshopify.com/admin/api/2021-07/webhooks.json",
    //   {
    //     method: "POST",
    //     headers: {
    //       Authorization: "Basic " + btoa(`${auth.API}:${auth.Password}`),
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(data3),
    //   }
    // )
    //   .then((response) => response.json())
    //   .then((data) => console.log(data)) // Manipulate the data retrieved back, if we want to do something with it
    //   .catch((err) => console.log(err));

    // -------------------- Create webhook----------------------------------------------//

    const sleep = (time) => {
      return new Promise((resolve) => setTimeout(resolve, time));
    };

    setLoading(false);
  }, []);

  const fetchVariants = async (id) => {
    setLoading(true);
    const sleep = (time) => {
      return new Promise((resolve) => setTimeout(resolve, time));
    };
    if (id.products !== undefined || id.products !== null) {
      // console.log(id.products);

      for (var myid = 0; myid < id.products.length; myid++) {
        await sleep(700);

        /////////////-----------------------fetching variants ------------------------------------------------------------------------------

        var body5 = {
          idz: "" + id.products[myid].id,
        };
        // console.log(body5);
        fetch("https://brandfer.herokuapp.com/orders/getVariants", {
          method: "POST",
          headers: {
            Authorization: "Basic " + btoa(`${auth.API}:${auth.Password}`),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body5),
        })
          .then((response) => response.json())
          .then((data) => {
            variant.push(data);
            handle.push(id.products[myid]);
            //  console.log(id.products[myid]);
            //  console.log(data);
          })
          // Manipulate the data retrieved back, if we want to do something with it
          .catch((err) => console.log(err));

        /////////////-----------------------fetching variants ------------------------------------------------------------------------------

        // fetch(
        //   `https://thingproxy.freeboard.io/fetch/https://needynwanty.myshopify.com/admin/api/2019-07/products/${id.products[myid].id}/variants.json?fields=inventory_quantity,sku,id,product_id,inventory_item_id`,
        //   {
        //     method: "GET",
        //     headers: {
        //       Authorization: "Basic " + btoa(`${auth.API}:${auth.Password}`),
        //     },
        //   }
        // )
        //   .then((res) => res.json())
        //   .then((data) => variant.push(data), handle.push(id.products[myid]));
      }

      // fetch("https://brandfer.herokuapp.com/finals/")
      //   .then((response) => response.json())
      //   .then((data) => myserver.push(data));

      fetch("https://brandfer.herokuapp.com/uploads/")
        .then((response) => response.json())
        .then((servers) => {
          setServer(servers);
          // console.log(servers);
          // console.log(variant);
          ////////////////display data /////////////////////////////////////////////-------------------------------------------------

          for (var s = 0; s < servers.length; s++) {
            for (var v = 0; v < variant.length; v++) {
              for (var vv = 0; vv < variant[v].variants.length; vv++) {
                if (variant[v].variants[vv].sku === servers[s].sku) {
                  console.log("sku matched");
                  var finalObj = {
                    groupCode: servers[s].group,
                    groupQuantity: servers[s].quantity,
                    sku: variant[v].variants[vv].sku,
                    skuQuantity: variant[v].variants[vv].inventory_quantity,
                    variantID: variant[v].variants[vv].id,
                    productID: variant[v].variants[vv].product_id,
                    inventoryItemId: variant[v].variants[vv].inventory_item_id,
                  };
                  final.push(finalObj);
                }
              }
            }
          }

          // for (var h = 0; h < handle.length; h++) {
          //   for (var f = 0; f < final.length; f++) {
          //     console.log(handle[h]);
          //     if (final[f].productID === handle[h].id) {
          //       final[f].handle = handle[h].handle;
          //     }
          //   }
          // }
          console.log(final);
          setFinal(
            final.filter(function (el) {
              if (!this[el.sku]) {
                this[el.sku] = true;
                return true;
              }
              return false;
            }, Object.create(null))
          );

          ////////------------------------display data------------------------------------------/////////////////////////////////////

          ///////////-----------------------push to backend------------------/---------------------------/////////////////////////////////

          fetch("https://brandfer.herokuapp.com/finals/")
            .then((response) => response.json())
            .then((myservers) => {
              myserver.push(myservers);

              // console.log(myservers);
              // console.log(final);

              for (var f = 0; f < final.length; f++) {
                var myObj = {
                  variantID: final[f].variantID,
                  productID: final[f].productID,
                  groupCode: final[f].groupCode,
                  groupQuantity: final[f].groupQuantity,
                  skuQuantity: final[f].skuQuantity,
                  sku: final[f].sku,
                  // handle: final[f].handle,
                  // productLink:
                  //   "https://needynwanty.myshopify.com/admin/api/2019-07/products/" +
                  //   final[f].handle,
                };
                excel.push(myObj);
              }

              setExcel(
                excel.filter(function (el) {
                  if (!this[el.sku]) {
                    this[el.sku] = true;
                    return true;
                  }
                  return false;
                }, Object.create(null))
              );

              // console.log(excel);
              // console.log(myservers);
              for (var i = 0; i < myservers.length; i++) {
                for (var j = 0; j < final.length; j++) {
                  if (
                    myservers[i].groupCode === final[j].groupCode &&
                    myservers[i].sku === final[j].sku &&
                    myservers[i].variantID == final[j].variantID
                  ) {
                    //  console.log("splice: " + final[j]);
                    // delete value from database instead

                    axios
                      .delete(
                        "https://brandfer.herokuapp.com/finals/delete-final/" +
                          myservers[i]._id
                      )
                      .then((res) => {
                        console.log(res);
                      })
                      .catch((err) => {
                        console.log("Error in UpdateBookInfo!");
                      });

                    //   // final.splice(j, 1);
                  }
                }
              }

              final.map((mydata) => {
                requestOptions = {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    groupCode: mydata.groupCode,
                    groupQuantity: mydata.groupQuantity,
                    handle: mydata.handle,
                    productID: mydata.productID,
                    sku: mydata.sku,
                    skuQuantity: mydata.skuQuantity,
                    variantID: mydata.variantID,
                    inventoryItemId: mydata.inventoryItemId,
                  }),
                };

                fetch(
                  "https://brandfer.herokuapp.com/finals/create-final",
                  requestOptions
                )
                  .then((response) => response.json())
                  .then((data) => console.log(data));
              });
            });

          /////////--------------------------------------------------push to backend-------------------------------------------/////////////////////////////
        });
    }

    setLoading(false);
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

  function displayData() {
    // collecting handles
    // for (var s = 0; s < server.length; s++) {
    //   for (var v = 0; v < variant.length; v++) {
    //     for (var vv = 0; vv < variant[v].variants.length; vv++) {
    //       if (variant[v].variants[vv].sku === server[s].sku) {
    //         var finalObj = {
    //           groupCode: server[s].group,
    //           groupQuantity: server[s].quantity,
    //           sku: variant[v].variants[vv].sku,
    //           skuQuantity: variant[v].variants[vv].inventory_quantity,
    //           variantID: variant[v].variants[vv].id,
    //           productID: variant[v].variants[vv].product_id,
    //           inventoryItemId: variant[v].variants[vv].inventory_item_id,
    //         };
    //         final.push(finalObj);
    //       }
    //     }
    //   }
    // }
    // for (var h = 0; h < handle.length; h++) {
    //   for (var f = 0; f < final.length; f++) {
    //     if (final[f].productID === handle[h].id) {
    //       final[f].handle = handle[h].handle;
    //     }
    //   }
    // }
    // setFinal(
    //   final.filter(function (el) {
    //     if (!this[el.sku]) {
    //       this[el.sku] = true;
    //       return true;
    //     }
    //     return false;
    //   }, Object.create(null))
    // );
  }

  function pushBackend() {
    // console.log(myserver[0]);
    // console.log(final);
    // for (var f = 0; f < final.length; f++) {
    //   var myObj = {
    //     variantID: final[f].variantID,
    //     productID: final[f].productID,
    //     groupCode: final[f].groupCode,
    //     groupQuantity: final[f].groupQuantity,
    //     skuQuantity: final[f].skuQuantity,
    //     sku: final[f].sku,
    //     handle: final[f].handle,
    //     productLink:
    //       "https://needynwanty.myshopify.com/admin/api/2019-07/products/" +
    //       final[f].handle,
    //   };
    //   excel.push(myObj);
    // }
    // setExcel(
    //   excel.filter(function (el) {
    //     if (!this[el.sku]) {
    //       this[el.sku] = true;
    //       return true;
    //     }
    //     return false;
    //   }, Object.create(null))
    // );
    // console.log(excel);
    // console.log(myserver);
    // for (var i = 0; i < myserver[0].length; i++) {
    //   for (var j = 0; j < final.length; j++) {
    //     if (
    //       myserver[0][i].groupCode === final[j].groupCode &&
    //       myserver[0][i].sku === final[j].sku &&
    //       myserver[0][i].variantID == final[j].variantID
    //     ) {
    //       //  console.log("splice: " + final[j]);
    //       // delete value from database instead
    //       axios
    //         .delete(
    //           "https://brandfer.herokuapp.com/finals/delete-final/" + myserver[0][i]._id
    //         )
    //         .then((res) => {
    //           console.log(res);
    //         })
    //         .catch((err) => {
    //           console.log("Error in UpdateBookInfo!");
    //         });
    //       // final.splice(j, 1);
    //     }
    //   }
    // }
    // final.map((mydata) => {
    //   requestOptions = {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       groupCode: mydata.groupCode,
    //       groupQuantity: mydata.groupQuantity,
    //       handle: mydata.handle,
    //       productID: mydata.productID,
    //       sku: mydata.sku,
    //       skuQuantity: mydata.skuQuantity,
    //       variantID: mydata.variantID,
    //       inventoryItemId: mydata.inventoryItemId,
    //     }),
    //   };
    //   fetch("https://brandfer.herokuapp.com/finals/create-final", requestOptions)
    //     .then((response) => response.json())
    //     .then((data) => console.log(data));
    // });
  }

  const readExcel2 = (file) => {
    // console.log(locationid.locations[0].id);
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
      setFinalexcel(d);
    });
  };

  function groupUpdate() {
    setGroupload(true);

    // 1. fetch all final from backend
    fetch("https://brandfer.herokuapp.com/finals/")
      .then((response) => response.json())
      .then((secondfinals) => {
        setSecondfinal(secondfinals);
        setLoading(false);

        // console.log(secondfinals);
        // console.log(finalexcel);

        for (var s = 0; s < secondfinals.length; s++) {
          for (var f = 0; f < finalexcel.length; f++) {
            // console.log(secondfinal[s].groupCode + ":" + finalexcel[f].groupCode);

            if (secondfinals[s].groupCode === finalexcel[f].groupCode) {
              // console.log("reached inner");
              var data = {
                groupCode: finalexcel[f].groupCode,
                groupQuantity: finalexcel[f].groupQuantity,
                // handle: secondfinals[s].handle,
                productID: secondfinals[s].productID,
                sku: secondfinals[s].sku,
                skuQuantity: finalexcel[f].groupQuantity,
                variantID: secondfinals[s].variantID,
                inventoryItemId: secondfinals[s].inventoryItemId,
              };

              // put edit command on final changing its variant qty and group qty

              axios
                .put(
                  "https://brandfer.herokuapp.com/finals/update-final/" +
                    secondfinals[s]._id,
                  data
                )
                .then((res) => {
                  console.log(res);
                })
                .catch((err) => {
                  console.log("Error in updating app database!");
                });
              /////////////////----------------------------------------------------------------setting inventory-----------------------------------//////

              var data2 = {
                location_id: locationid.locations[0].id,
                inventory_item_id: secondfinals[s].inventoryItemId,
                available: finalexcel[f].groupQuantity,
              };

              var dataFinal22 = {
                location_id: locationid.locations[0].id,
                inventory_item_id: secondfinals[s].inventoryItemId,
                available: finalexcel[f].groupQuantity,
              };

              setTimeout(() => {
                fetch("https://brandfer.herokuapp.com/orders/setInventory", {
                  method: "POST",
                  headers: {
                    Authorization:
                      "Basic " + btoa(`${auth.API}:${auth.Password}`),
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(dataFinal22),
                })
                  .then((response) => response.json())
                  .then((data) => {
                    // console.log(data);
                    setGroupload(false);
                  }) // Manipulate the data retrieved back, if we want to do something with it
                  .catch((err) => console.log(err));
              }, 500);

              /////////////////----------------------------------------------------------------setting inventory-----------------------------------//////

              // server and final have equal length

              for (var z = 0; z < server.length; z++) {
                if (server[z].group == finalexcel[f].groupCode) {
                  var mydata = {
                    quantity: finalexcel[f].groupQuantity,
                    quantity2: finalexcel[f].groupQuantity,
                  };

                  axios
                    .put(
                      "https://brandfer.herokuapp.com/uploads/update-upload/" +
                        server[z]._id,
                      mydata
                    )
                    .then((res) => {
                      // console.log(res);
                      console.log("uploads updated!!");
                    })
                    .catch((err) => {
                      console.log("Error in updating app uploads!");
                    });
                }
              }
            }
          }
        }
      });

    // 2. check if group code matches with final group code

    // 3. if yes than using _id edit group and variant quantity in the backend
    if (finalexcel.length == 0) {
      setGroupload(false);
    }
  }

  if (groupload) {
    return (
      <div>
        <span className="none">Please don't close the browser....</span>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  function webhookActivation() {
    var editWebHook = {
      webhook: {
        id: 1044923318477,
        address: "https://brandfer.herokuapp.com/orders/webhooks/create-order",
      },
    };
    var data3 = {
      webhook: {
        topic: "orders/create",
        address: "https://brandfer.herokuapp.com/orders/webhooks/create-order",
        format: "json",
      },
    };
    fetch(
      "https://thingproxy.freeboard.io/fetch/https://needynwanty.myshopify.com/admin/api/2021-07/webhooks/1044923318477.json",
      {
        method: "PUT",
        headers: {
          Authorization: "Basic " + btoa(`${auth.API}:${auth.Password}`),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editWebHook),
      }
    )
      .then((response) => response.json())
      .then((data) => console.log(data)) // Manipulate the data retrieved back, if we want to do something with it
      .catch((err) => console.log(err));

    // fetch(
    //   "https://thingproxy.freeboard.io/fetch/https://needynwanty.myshopify.com/admin/api/2021-07/webhooks.json",
    //   {
    //     method: "POST",
    //     headers: {
    //       Authorization: "Basic " + btoa(`${auth.API}:${auth.Password}`),
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(data3),
    //   }
    // )
    //   .then((response) => response.json())
    //   .then((data) => console.log(data)) // Manipulate the data retrieved back, if we want to do something with it
    //   .catch((err) => console.log(err));
  }

  function DisplayData() {
    setLoading(true);
    fetch("https://brandfer.herokuapp.com/finals/")
      .then((res) => res.json())
      .then((data) => {
        setFinal(data);
        setLoading(false);
      });
  }

  function SyncData() {
    // ////////////////////////----------------------------------------------------fetch products , id,title,handle --------------------
    var dataFinal1 = {
      none: "null",
    };
    setLoading(true);

    fetch("https://brandfer.herokuapp.com/orders/getProductInfo", {
      method: "POST",
      headers: {
        Authorization: "Basic " + btoa(`${auth.API}:${auth.Password}`),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataFinal1),
    })
      .then((response) => response.json())
      .then((id) => {
        //   console.log("product info");
        setId(id);
        //    console.log(id);
        fetchVariants(id);
      }) // Manipulate the data retrieved back, if we want to do something with it
      .catch((err) => console.log(err));
    // ////////////////////////----------------------------------------------------fetch products , id,title,handle --------------------
  }

  return (
    <div className="shopified">
      <Main />
      <div>
        <h3>Shopified page</h3>
        <div className="mybuttons3">
          <div>
            <ExportCSV csvData={final} fileName="file" />
          </div>
          <div className="mybtn">
            <button type="button" className="btn btn-light" onClick={SyncData}>
              Sync Data
            </button>
          </div>
        </div>
        <br />

        <div className="mybutton2">
          <div className="input-group mb-3">
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files[0];
                readExcel2(file);
              }}
              className="form-control"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-default"
            />
          </div>
        </div>
        <div className="mybuttons">
          <div className="mybuttons3">
            <button
              type="button"
              className="btn btn-light"
              onClick={groupUpdate}
            >
              Group Update
            </button>
          </div>
          <div className="mybuttons3">
            <button
              type="button"
              className="btn btn-light"
              onClick={DisplayData}
            >
              Display Data
            </button>
          </div>
          <div className="mybuttons4">
            <button
              type="button"
              className="btn btn-light"
              onClick={webhookActivation}
            >
              Activate Webhook
            </button>
          </div>
        </div>
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">Group Code</th>
              <th scope="col">Group Quantity</th>
              {/* <th scope="col">Handle</th> */}
              <th scope="col">Product ID</th>
              <th scope="col">Sku</th>
              <th scope="col">Sku Quantity</th>
              <th scope="col">Variant ID</th>
            </tr>
          </thead>
          <tbody>
            {final
              ? final.map((mydata) => (
                  <>
                    <>
                      <tr key={mydata.variantID}>
                        <td>{mydata.groupCode}</td>
                        <td>{mydata.groupQuantity}</td>
                        {/* <td>{mydata.handle}</td> */}
                        <td>{mydata.productID}</td>
                        <td>{mydata.sku}</td>
                        <td>{mydata.skuQuantity}</td>
                        <td>{mydata.variantID}</td>
                      </tr>
                    </>
                  </>
                ))
              : ""}
          </tbody>

          {/* <tbody>
            {secondfinal
              ? secondfinal.map((mydata) => (
                  <>
                    <>
                      <tr key={mydata.variantID}>
                        <td>{mydata.groupCode}</td>
                        <td>{mydata.groupQuantity}</td>
                    
                        <td>{mydata.productID}</td>
                        <td>{mydata.sku}</td>
                        <td>{mydata.skuQuantity}</td>
                        <td>{mydata.variantID}</td>
                      </tr>
                    </>
                  </>
                ))
              : ""}
          </tbody> */}
        </table>

        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">Group Code</th>
              <th scope="col">Group Quantity</th>
            </tr>
          </thead>
          <tbody>
            {finalexcel
              ? finalexcel.map((mydata) => (
                  <>
                    <>
                      <tr key={mydata.variantID}>
                        <td>{mydata.groupCode}</td>
                        <td>{mydata.groupQuantity}</td>
                      </tr>
                    </>
                  </>
                ))
              : ""}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default withRouter(Shopified);
