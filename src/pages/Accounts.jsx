import React from "react";
import "./Accounts.scss";
import Favicon from "../assets/Favicon.png";

const Accounts = () => {
  return (
    <div className="accounts-page">
      <div className="accounts-hero">
        <h1>Signup / Login</h1>
      </div>

      <div className="accounts-content">
        <div className="card-left">
          <img src={Favicon} alt="logo" style={{ height: 60 }} />
          <h2>CIT Alumni Association</h2>
          <p>Sign up or log in to stay connected with your community</p>
        </div>

        <div className="card-right">
          <h3>Choose any one of the following to Signup/Login</h3>

          <button className="social fb">CONNECT WITH FACEBOOK</button>
          <button className="social google">CONNECT WITH GOOGLE</button>
          <button className="social linkedin">CONNECT WITH LINKEDIN</button>

          <div className="or">OR</div>

          <div className="email-row">
            <input placeholder="Enter your Email..." type="email" />
            <button className="go">→</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accounts;
