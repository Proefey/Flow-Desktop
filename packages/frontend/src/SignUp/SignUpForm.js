// src/authPages/TheForm.js
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate } from "react-router-dom";
import Colors from "../Const/Colors"

import {Backend_URL} from "../Const/Urls";

function SignupForm(props) {
    //User JSON object that will be sent to backend
    const [user, setUser] = useState({
        username: "",
        pwd: "",
        name: ""
    });

    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    //Updates formData
    function handleChange(event) {
        const { name, value } = event.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value
        }));
    }

    //Validate Input and Send to Backend
    const submitForm = async () => {
        if (!user.username || !user.pwd) {
            setErrorMessage("Please enter both username and password");
            return;
        }

        fetch(`${Backend_URL}/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })
            .then((res) => {
                if (res.status === 201) {
                    res.json().then((payload) => {
                        props.signupUser(payload);
                        navigate("/Overview");
                    });
                } else if (res.status === 409) {
                    setErrorMessage("Username already taken.");
                    setUser({
                        name: "",
                        username: "",
                        pwd: ""
                    });
                } else {
                    setErrorMessage("Error registering");
                    console.log(res.body);
                    setUser({
                        name: "",
                        username: "",
                        pwd: ""
                    });
                }
            })
            .catch((error) => {
                console.error("Error signing up:", error);
            });
    };

    return (
        <div>
            <style>{'body { background-color: #000000; }'}</style> 
            <div         
                style = {{
                  transform: `translate(${10}vw, ${25}vh)`,
                  position:'absolute',
                  background: Colors.flightblue,
                  opacity: 1,
                  width: '50vw',
                  height: '55vh',
                  border: 'solid',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <h2
                    style = {{
                        textAlign: 'center',
                    }}
                >
                Sign Up
                </h2>
                <Form>
                    <Row className="align-items-center">
                        <Col xs="auto">
                            <Form.Group controlId="formBasicDescription">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    placeholder="Enter name"
                                    value={user.name}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="align-items-center">
                        <Col xs="auto">
                            <Form.Group controlId="formBasicTitle">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="username"
                                    placeholder="Enter username"
                                    value={user.username}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="align-items-center">
                        <Col xs="auto">
                            <Form.Group controlId="formBasicDescription">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="pwd"
                                    placeholder="Enter password"
                                    value={user.pwd}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    {errorMessage && (
                        <div
                            style={{ marginTop: "10px" }}
                            className="alert alert-danger"
                            role="alert"
                        >
                            {errorMessage}
                        </div>
                    )}

                    <div style={{ marginTop: "10px" }}>
                        <Button variant="primary" onClick={submitForm}>
                            Submit
                        </Button>
                    </div>
                </Form>
        </div>
        </div>
    );
}
export default SignupForm;
