// src/MyApp.js
import React from "react";
import SignupForm from "./SignUpForm.js";

function Signup(props) {
    function signupUser(payload) {
        props.saveToken(payload.token);
        props.setUID(payload.UID);
    }

    return (
        <div className="container">
            <SignupForm signupUser={signupUser} />
        </div>
    );
}

export default Signup;
