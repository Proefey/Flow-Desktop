import mongoose from "mongoose";
import userModel from "./user.js";
import taskListModel from "./task.js";
import dotenv from "dotenv";

dotenv.config();

mongoose.set("debug", true);

mongoose
    .connect("mongodb+srv://capstone:emilysebkylecarl@watercapstone.u4wo3gp.mongodb.net/", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .catch((error) => console.log(error));

/* Gets a task list by its id */
function getTaskListById(id) {
    return taskListModel.findById(id);
}


export default {
    getTaskListById
};
