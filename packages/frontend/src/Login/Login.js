// src/MyApp.js
import React from "react";
import LoginForm from "./LoginForm.js";

function Login(props) {
    function loginUser(payload) {
        props.saveToken(payload.token);
        props.setUID(payload.UID);
    }

    return (
        <div className="container">
            <LoginForm loginUser={loginUser} />
        </div>
    );
}

export default Login;
