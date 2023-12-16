import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const port = 5000;
const APP_VERSION = "1.0.0";

app.use(cors());
app.use(express.json());


const datapack = new mongoose.Schema({
    id: {
      required: true,
      type: Number
    },
    timestamp: {
      required: true,
      type: String
    },
    temp: {
      required: true,
      type: Number
    },
    humidity: {
      required: true,
      type: Number
    },
    waterlevel: {
      required: true,
      type: Number
    },
    waterproduced: {
      required: true,
      type: Number
    },
    power: {
      required: true,
      type: Number
    },
    tds: {
      required: true,
      type: Number
    }
  }, {collection : 'DataPack'});

app.get("/", (req, res) => {
  res.send(`Hello World! - node backend app version ${APP_VERSION}`);
});

let dbConnection;

function setConnection(newConn) {
  dbConnection = newConn;
  return dbConnection;
}

function getDbConnection() {
  if (!dbConnection) {
    dbConnection = mongoose.createConnection("mongodb+srv://capstone:emilysebkylecarl@watercapstone.u4wo3gp.mongodb.net/ApplicationData", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  return dbConnection;
}

async function getData(id) {
    const pack = getDbConnection().model("pack", datapack);
    return await pack.find({ id: id });
}

app.get('/data', async (req, res) => {
    const { id } = req.query;
    try {
      const pack = await getData(id);
      res.send({ datapack: pack });
    } catch (error) {
      console.log('Mongoose error: ' + error);
      res.status(500).send('An error ocurred in the server.');
    }
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




