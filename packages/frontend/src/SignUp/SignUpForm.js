// src/authPages/TheForm.js
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

function SignupForm(props) {
    const [user, setUser] = useState({
        username: "",
        pwd: "",
        name: ""
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

        fetch(`${API_URL}/signup`, {
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
                        navigate("/month");
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
    );
}
export default SignupForm;
