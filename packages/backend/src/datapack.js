import mongoose from "mongoose";

const dataschema = new mongoose.Schema({
    machineID: {
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

const DataPack = mongoose.model("Data", dataschema);

export default DataPack;
