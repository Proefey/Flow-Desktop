// src/authPages/TheForm.js
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link, useNavigate } from "react-router-dom";
import Colors from "../Const/Colors"

import {Backend_URL} from "../Const/Urls";

function TheForm(props) {
    const [user, setUser] = useState({
        username: "",
        pwd: ""
    });

    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    function handleChange(event) {
        const { name, value } = event.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value
        }));
    }

    const submitForm = async () => {
        if (!user.username || !user.pwd) {
            setErrorMessage("Please enter both username and password");
            return;
        }

        fetch(`${Backend_URL}/login`, {
            mode: 'no-cors',
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })
            .then((res) => {
                if (res.status === 200) {
                    res.json().then((payload) => {
                        props.loginUser(payload);
                        navigate("/month");
                    });
                } else {
                    setErrorMessage("Incorrect username or password");
                    setUser({
                        username: "",
                        pwd: ""
                    });
                }
            })
            .catch((error) => {
                console.error("Error logging in:", error);
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
                  height: '50vh',
                  border: 'solid',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <h2
                    style = {{
                        textAlign: 'center',
                    }}
                >
                Login
                </h2>
                <Form>
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
                        <Link to="/signup">
                            <Button variant="link">Create a new account</Button>
                        </Link>
                    </div>
                    <div style={{ marginTop: "10px" }}>
                        <Button variant="success" onClick={submitForm}>
                            Submit
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
}
export default TheForm;
