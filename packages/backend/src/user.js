import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        username: {
            type: String,
            required: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            trim: false
        },
        machineID: [{
            required: true,
            type: Number
        }],
        machineName: [{
            required: true,
            type: String
        }],
    },
    { collection: "users" }
);

const User = mongoose.model("User", UserSchema);

export default User;
