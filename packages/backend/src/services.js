import mongoose from "mongoose";
import userModel from "./user.js";
import dataPackModel from "./datapack.js";
import dotenv from "dotenv";

dotenv.config();

mongoose.set("debug", true);

mongoose
    .connect(process.env.MONGODB_URL, {
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

/* Create New User */
async function instantiateUser(user) {
    const newUser = new userModel(user);
    const promise = newUser.save();
    return promise;
}

/* Adds Machine To User*/
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

/* Deletes Machine From User */
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

/* Gets Data from One ID*/
function getData(id){
    let promise;
    if(id){
        promise = dataPackModel.find({machineID: id});
    } else{
        promise = dataPackModel.find();
    }
    return promise;
}

/* Gets Data From Multiple IDs */
function getMultiData(ids){
    let promise;
    if(ids){
        promise = dataPackModel.find({machineID: { $in : ids}});
    } else{
        promise = dataPackModel.find();
    }
    return promise;
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
    getMultiData
};
