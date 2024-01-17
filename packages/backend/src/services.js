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

function addData(data){
    const dataToAdd = new dataPackModel(data);
    console.info(dataToAdd['machineID']);
    var replaceData = dataPackModel.find({machineID: 4});
    console.info(replaceData.length);
    console.info(replaceData);
    if(replaceData != null && replaceData.length > 0){
        const dataToAddDate = new Date(dataToAdd['timestamp'].replace(/-/g, "/").replace("T", " "));
        console.info("Check Date: " + dataToAddDate);
        for(var i = 0; i < replaceData.length; i++){
            var newDate = new Date(replaceData[i]['timestamp'].replace(/-/g, "/").replace("T", " "));
            console.info(newDate);
            if(sameDay(dataToAddDate, newDate)){
                dataPackModel.findByIdAndDelete(replaceData[i]['id']);
            }
        }
    }
    //const promise = dataToAdd.save();
    return true;
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
    addData
};
