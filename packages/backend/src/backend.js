import express from 'express';
import Services from "./services.js";
import cors from 'cors';
import { registerUser, loginUser, authenticateUser } from "./authorize.js";

//Constants
const app = express();
//Port Number
const port = 8080;
const APP_VERSION = "1.0.0";

//Set Cors Options
var corsOptions = {
    origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
};

app.use(cors(corsOptions));
app.use(express.json());

//Login is treated in Authorize.js
//Note the lack of authenticateUser, which is intentional as by this point the user
//Has not logged in yet and thus does not have any authentication
app.post("/login", loginUser);
//Signup is treated in Authorize.js
app.post("/signup", registerUser);

//Return a list of users
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

//Return a list of users based on ID
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

//Add a machine with name MNAME and ID MID to user with UID
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

//Add a user
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

//Delete a machine
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

//Get Data from one machine based on ID
app.get("/data/:id", authenticateUser, (req, res) => {
    const MID = req.params.id;
    Services.getData(MID)
        .then((data) => {
            data = { data: data };
            res.send(data);
        })
        .catch((error) => {
            console.log(error);
        });
});

//Get Data from many machines, ids split by "-"
app.get("/data/multi/:ids", authenticateUser, (req, res) => {
    const MIDs = req.params.ids;
    var myArray = MIDs.split("-");
    for(var i=0; i<myArray.length; i++) { myArray[i] = parseInt(myArray[i], 10); } 
    Services.getData(myArray)
        .then((data) => {
            data = { data: data };
            res.send(data);
        })
        .catch((error) => {
            console.log(error);
        });
});

//This is only used if you try to directly access backend
app.get("/", (req, res) => {
    const MID = 2;
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




