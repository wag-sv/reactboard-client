import "./Auth.css";
import React, { useState, useContext } from "react";
import api from "../../apis/api";

import { AuthContext } from "../../contexts/authContext";

function Login(props) {
  const authContext = useContext(AuthContext);

  const [state, setState] = useState({ password: "", email: "" });
  const [errors, setErrors] = useState({
    email: null,
    password: null,
  });

  function handleChange(event) {
    setState({
      ...state,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await api.post("/login", state);
      // console.log(response);

      authContext.setLoggedInUser({ ...response.data });
      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({ ...response.data })
      );
      setErrors({ msg: "" });
      props.history.push("/board");
    } catch (err) {
      console.error(err.response.data);
      setErrors({ ...err.response.data });
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>

      <div>
        <label htmlFor="signupFormEmail">E-mail</label>
        <input
          type="email"
          name="email"
          id="signupFormEmail"
          value={state.email}
          error={errors.email}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="signupFormPassword">Password</label>
        <input
          type="password"
          name="password"
          id="signupFormPassword"
          value={state.password}
          error={errors.password}
          onChange={handleChange}
        />
        {errors.msg && <div className="error-login"> {errors.msg}</div>}
      </div>

      <div className="footer-auth">
        <button type="submit" className="btnAuth">
          Login!
        </button>

        <div onClick={props.handleSignup} className="redirect">
          Don't have an account? Click here to signup!
        </div>
      </div>
    </form>
  );
}

export default Login;
