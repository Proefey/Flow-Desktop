import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Services from "./services.js";

dotenv.config();

/* Registers a user by validating input (making sure username and password are defined), and username
   isn't already taken, then using bcrypt to encrypt the password. generateAccessToken() then provides
   a token that can be used to access protected routes */
export function registerUser(req, res) {
    const { username, name, pwd } = req.body;

    if (!username || !pwd || !name) {
        res.status(400).send("Bad request: Invalid input data.");
    } else {
        Services.getUserByUsername(username).then((user) => {
            // If a user was found, the username is a repeat
            if (user !== null) {
                console.log(user);
                res.status(409).send("Username already taken.");
            } else {
                bcrypt
                    .genSalt(10)
                    .then((salt) => bcrypt.hash(pwd, salt))
                    .then((password) => {
                        generateAccessToken(username).then((token) => {
                            console.log("Token: ", token);
                            Services.instantiateUser({
                                username,
                                name,
                                password
                            })
                                .then((newUser) => {
                                    res.status(201).send({
                                        token: token,
                                        UID: newUser._id,
                                    });
                                })
                                .catch((error) => {
                                    console.log(error);
                                });
                        });
                    });
            }
        });
    }
}

/* Uses jwt to generate an access token for the user. This access token ensures that routes that could
   contain sensitive data are only accessed by authenticated users */
function generateAccessToken(username) {
    return new Promise((resolve, reject) => {
        jwt.sign(
            { username: username },
            process.env.TOKEN_SECRET,
            { expiresIn: "1d" },
            (error, token) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(token);
                }
            }
        );
    });
}

/* Verifies the provided token to ensure that the user trying to access a protected route is using 
   a valid token */
export function authenticateUser(req, res, next) {
    const authHeader = req.headers["authorization"];
    // Getting the second part of the auth header (the token)
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        console.log("No token received.");
        res.status(401).end();
    } else {
        jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
            if (decoded) {
                next();
            } else {
                console.log("JWT Error:", error);
                res.status(401).end();
            }
        });
    }
}

/* Logs in an already existing user. Similar to registerUser(), but since the user already exists,
   the function uses bcrypt to encrpt the given password and compare it to the already encrypted
   password stored in teh database. If these match, an access token is provided in the response body
   */
export function loginUser(req, res) {
    const { username, pwd } = req.body; // from form

    Services.getUserByUsername(username).then((user) => {
        if (!user) {
            res.status(401).send("Unauthorized");
        } else {
            bcrypt
                .compare(pwd, user.password)
                .then((matched) => {
                    if (matched) {
                        generateAccessToken(username).then((token) => {
                            res.status(200).send({
                                token: token,
                                UID: user._id,
                            });
                        });
                    } else {
                        // invalid password
                        res.status(401).send("Unauthorized");
                    }
                })
                .catch(() => {
                    res.status(401).send("Unauthorized");
                });
        }
    });
}
