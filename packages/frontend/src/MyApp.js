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
  const [Target, setTarget] = useState("0");
  console.info(token);
  console.info(UID);
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
    setTarget(index);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={
                        <Login
                            saveToken={setToken}
                            setUID = {setUID}
                        />
                    }
        />
        <Route path="signup" element={
                        <Signup
                            saveToken={setToken}
                            setUID = {setUID}
                        />
                    }
                />
        <Route path = "week" element={<Navigate replace to = {curyear + "-" + curmonth + "-" + curday} />} />
        <Route path = "week/:newdate" element = {
          <div> 
            <CalWeek addHeader = {addAuthHeader}/> 
            <Taskbar 
              UID = {UID}
              changeTarget = {changeTarget}
              addHeader={addAuthHeader}
              Target = {Target}
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
              UID = {UID}
              /> 
            <Taskbar 
              UID = {UID}
              changeTarget = {changeTarget}
              addHeader={addAuthHeader}
              Target = {Target}
            />
          </div>
          } 
        />
        <Route path = "addMachine" element={
            <AddMachine
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