import mongoose from "mongoose";
import userModel from "./user.js";
import dataPackModel from "./datapack.js";
import dotenv from "dotenv";

dotenv.config();

mongoose.set("debug", true);

mongoose
    .connect("mongodb+srv://Proefey:0UPYpvGmo21iyI5l@teamflow.u4jpeoh.mongodb.net/TeamFlow?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .catch((error) => console.log(error));

/* Gets all users */
function getUsers(name) {
    let promise;
    if (name) {
        promise = userModel.find({ name: name });
    } else {
        promise = userModel.find();
    }
    return promise;
    
}

/* Gets a user by their id */
function getUserById(id) {
    return userModel.findById(id);
}

/* Gets a user by their username */
function getUserByUsername(username) {
    return userModel.findOne({ username: username });
}

/* Deletes a user by their given id */
function deleteUserById(id) {
    return userModel.findByIdAndDelete(id);
}

async function instantiateUser(user) {
    const newUser = new userModel(user);
    const promise = newUser.save();
    return promise;
}

function editUser(UID, MID, MName) {
    const promise = userModel.updateOne(
        { _id: UID},
        { 
            $push: { 
                "machineID": MID,
                "machineName": MName
            } 
        }
    );
    return promise;
}

function deleteMachine(UID, MID, MName){
    const promise = userModel.updateOne(
        { _id: UID},
        { 
            $pull: { 
                "machineID": MID,
                "machineName": MName
            } 
        }
    );
    return promise;
}

function getData(id){
    let promise;
    if(id){
        promise = dataPackModel.find({machineID: id});
    } else{
        promise = dataPackModel.find();
    }
    return promise;
}

/*Helper Function For addData*/
function sameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}


export default {
    getUsers,
    getUserById,
    getUserByUsername,
    deleteUserById,
    instantiateUser,
    editUser,
    deleteMachine,
    getData,
};
