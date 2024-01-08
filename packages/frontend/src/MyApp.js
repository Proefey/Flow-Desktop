import React, {useState, useEffect} from "react";
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import CalMonth from "./Calendar/CalMonth";
import CalWeek from "./Calendar/CalWeek";
import Taskbar from "./Taskbar/Taskbar";
import Login from "./Login/Login.js";
import Signup from "./SignUp/SignUp.js";
import AddMachine from "./AddMachine/AddMachine.js";

const curdate = new Date();
const curyear = curdate.getFullYear();
const curmonth = curdate.getMonth() + 1;
const curday = curdate.getDate();
function MyApp() {
  const INVALID_TOKEN = "INVALID_TOKEN";
  const [token, setToken] = useState(INVALID_TOKEN);
  const [UID, setUID] = useState(null);
  const [User, setUser] = useState(null);
  const [MName, setMName] = useState([]);
  const [MID, setMID] = useState([]);
  const [Target, setTarget] = useState("0");
  console.info(token);
  console.info(User);
  console.info(UID);
  console.info(MName);
  console.info(MID);
  console.info("Target " + Target);

  function addAuthHeader(otherHeaders = {}) {
      if (token === INVALID_TOKEN) {
          return otherHeaders;
      } else {
          return {
              ...otherHeaders,
              Authorization: `Bearer ${token}`
          };
      }
  }

  function changeTarget(index){
    if(MID != null && MID.length > 0){
      setTarget(MID[index]);
    }
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={
                        <Login
                            saveToken={setToken}
                            setUser={setUser}
                            setUID = {setUID}
                            setMName={setMName}
                            setMID={setMID}
                            setTarget={setTarget}
                        />
                    }
        />
        <Route path="signup" element={
                        <Signup
                            saveToken={setToken}
                            setUser={setUser}
                            setMName={setMName}
                            setMID={setMID}
                        />
                    }
                />
        <Route path = "week" element={<Navigate replace to = {curyear + "-" + curmonth + "-" + curday} />} />
        <Route path = "week/:newdate" element = {
          <div> 
            <CalWeek addHeader = {addAuthHeader}/> 
            <Taskbar 
              MName = {MName} 
              MID = {MID} 
              UID = {UID}
              changeTarget = {changeTarget}
              addHeader={addAuthHeader}
              setMName={setMName}
              setMID={setMID}
            />  
          </div>
          } 
        />
        <Route path = "month" element={<Navigate replace to = {curyear + "-" + curmonth + "-" + curday} />} />
        <Route path = "month/:newdate" element = {
          <div> 
            <CalMonth 
              addHeader={addAuthHeader}
              Target = {Target}
              /> 
            <Taskbar 
              MName = {MName} 
              MID = {MID} 
              UID = {UID}
              changeTarget = {changeTarget}
              addHeader={addAuthHeader}
              setMName={setMName}
              setMID={setMID}
            />
          </div>
          } 
        />
        <Route path = "addMachine" element={
            <AddMachine
              MID = {MID}
              setMID = {setMID}
              MName = {MName}
              setMName = {setMName}
              UID = {UID}
              addHeader={addAuthHeader}
            />
          }
        />
      </Routes>
    </BrowserRouter>
    );
 }

 export default MyApp;