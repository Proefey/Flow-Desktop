import express from 'express';
import Services from "./services.js";
import cors from 'cors';
import { registerUser, loginUser, authenticateUser } from "./authorize.js";

const app = express();
const port = 8080;
const APP_VERSION = "1.0.0";

app.use(cors());
app.use(express.json());

app.post("/login", loginUser);
app.post("/signup", registerUser);

app.get("/users", authenticateUser, (req, res) => {
    const name = req.query.name;
    Services.getUsers(name)
        .then((users) => {
            users = { users_list: users };
            res.send(users);
        })
        .catch((error) => {
            console.log(error);
        });
});

app.get("/users/:id", authenticateUser, (req, res) => {
    const id = req.params.id;
    Services.getUserById(id)
        .then((user) => {
            if (user === null) {
                res.status(404).send("User not found.");
            } else {
                res.send(user);
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(404).send("User not found.");
        });
});

app.put("/users/:id/:MNAME/:MID", authenticateUser, (req, res) => {
    const UID = req.params.id;
    const MNAME = req.params.MNAME;
    const MID = req.params.MID;
    Services.editUser(UID, MID, MNAME)
        .then((response) => {
            res.status(200).send(response);
        })
        .catch((error) => {
            console.log(error);
        });
});

app.post("/users", authenticateUser, (req, res) => {
    let userToAdd = req.body;
    Services.instantiateUser(userToAdd)
        .then((user) => {
            res.status(201).send(user);
        })
        .catch((error) => {
            console.log(error);
        });
});

app.delete("/users/:id/:MNAME/:MID", authenticateUser, (req, res) => {
    const UID = req.params.id;
    const MNAME = req.params.MNAME;
    const MID = req.params.MID;
    Services.deleteMachine(UID, MID, MNAME)
        .then((response) => {
            res.status(200).send(response);
        })
        .catch((error) => {
            console.log(error);
        });
});


app.get("/data/:id", authenticateUser, (req, res) => {
    const MID = req.params.id;
    console.info("Delete: " + MID);
    Services.getData(MID)
        .then((data) => {
            data = { data: data };
            res.send(data);
        })
        .catch((error) => {
            console.log(error);
        });
});

app.listen(port, () => {
    if (port) {
      console.log(
        `REST API Version ${APP_VERSION} is listening on port: ${port}.`
      );
    } else {
      console.log(
        `REST API Version ${APP_VERSION} is listening on port: ${port}.`
      );
    }
  });




