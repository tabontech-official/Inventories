import React, { useState } from "react";
import "./ChangePassword.css";
const ChangePassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newpassword, setNewPassword] = useState("");
  function getEmail(e) {
    e.preventDefault();
    setEmail(e.target.value);
  }

  function getPassword(e) {
    e.preventDefault();
    setPassword(e.target.value);
  }
  function getNewPassword(e) {
    e.preventDefault();
    setNewPassword(e.target.value);
  }
  function showAlertPostive() {
    document.getElementById("alert-examplepositive").style.visibility =
      "visible";
    setTimeout(() => {
      document.getElementById("alert-examplepositive").style.visibility =
        "hidden";
    }, 3000);
  }
  function showAlertNegative() {
    document.getElementById("alert-examplenegative").style.visibility =
      "visible";
    setTimeout(() => {
      document.getElementById("alert-examplenegative").style.visibility =
        "hidden";
    }, 3000);
  }

  const handleSubmitClick = (e) => {
    console.log(email);
    console.log(password);
    console.log(newpassword);
    e.preventDefault();
    // send a rest call to verify user

    const body5 = {
      email: email,
      password: password,
      newpassword: newpassword,
    };

    fetch("https://brandfer.herokuapp.com/users/changepassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body5),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        if (data.result) {
          showAlertPostive();
        } else {
          showAlertNegative();
        }
      })
      // Manipulate the data retrieved back, if we want to do something with it
      .catch((err) => console.log(err));
  };

  return (
    <div className="changepasswordform">
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
        <div className="form-group text-left">
          <label htmlFor="exampleInputPassword1">New Password</label>
          <input
            type="password"
            className="form-control"
            id="newpassword"
            value={newpassword}
            onChange={getNewPassword}
            placeholder="Password"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          onClick={handleSubmitClick}
        >
          Execute Change
        </button>
      </form>
      <br />
      <div className="alert alert-success" id="alert-examplepositive">
        <strong>Success!</strong> Password Changed
      </div>

      <div className="alert alert-warning" id="alert-examplenegative">
        <strong>Warning!</strong> Wrong Credentials
      </div>
    </div>
  );
};

export default ChangePassword;
