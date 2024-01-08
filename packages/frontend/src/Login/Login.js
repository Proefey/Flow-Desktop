// src/MyApp.js
import React from "react";
import LoginForm from "./LoginForm.js";

function Login(props) {
    function loginUser(payload) {
        props.saveToken(payload.token);
        props.setUser(payload.name);
        props.setUID(payload.UID);
        props.setMName(payload.MName);
        props.setMID(payload.MID);
        if(payload.MID != null && payload.MID.length > 0){
            props.setTarget(payload.MID[0]);
        }
    }

    return (
        <div className="container">
            <LoginForm loginUser={loginUser} />
        </div>
    );
}

export default Login;
