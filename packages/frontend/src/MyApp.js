import React, {useState} from "react";
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import CalMonth from "./Calendar/CalMonth";
import CalWeek from "./Calendar/CalWeek";
import Taskbar from "./Taskbar/Taskbar";
import Login from "./Login/Login.js";
import Signup from "./SignUp/SignUp.js";
import AddMachine from "./AddMachine/AddMachine.js";
import SingleView from "./DataView/SingleView";
import Predictor from "./DataView/Predictor";
import Overview from "./DataView/Overview";
import MultiView from "./DataView/MultiView";

const curdate = new Date();
const curyear = curdate.getFullYear();
const curmonth = curdate.getMonth() + 1;
const curday = curdate.getDate();
function MyApp() {
  const INVALID_TOKEN = "INVALID_TOKEN";
  const [token, setToken] = useState(INVALID_TOKEN);
  const [UID, setUID] = useState(null);
  const [Target, changeTarget] = useState("0");
  const [options, changeOptions] = useState([]);
  const [MID, changeMID] = useState([]);
  console.info(options);

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
        <Route path = "singleView" element = {
          <div> 
            <SingleView 
              addHeader={addAuthHeader}
              Target = {Target}
              UID = {UID}
              MID = {MID}
              /> 
            <Taskbar 
              UID = {UID}
              changeTarget = {changeTarget}
              addHeader={addAuthHeader}
              Target = {Target}
              changeOptions = {changeOptions}
              changeMID = {changeMID}
            />
          </div>
          } 
        />
        <Route path = "predictor" element = {
          <div> 
            <Predictor 
              addHeader={addAuthHeader}
              Target = {Target}
              UID = {UID}
              MID = {MID}
              /> 
            <Taskbar 
              UID = {UID}
              changeTarget = {changeTarget}
              addHeader={addAuthHeader}
              Target = {Target}
              changeOptions = {changeOptions}
              changeMID = {changeMID}
            />
          </div>
          } 
        />
        <Route path = "overview" element = {
          <div> 
            <Overview 
              addHeader={addAuthHeader}
              Target = {Target}
              UID = {UID}
              MID = {MID}
              options = {options}
              /> 
            <Taskbar 
              UID = {UID}
              changeTarget = {changeTarget}
              addHeader={addAuthHeader}
              Target = {Target}
              changeOptions = {changeOptions}
              changeMID = {changeMID}
            />
          </div>
          } 
        />
        <Route path = "multiview" element = {
          <div> 
            <MultiView 
              addHeader={addAuthHeader}
              Target = {Target}
              UID = {UID}
              MID = {MID}
              options = {options}
              /> 
            <Taskbar 
              UID = {UID}
              changeTarget = {changeTarget}
              addHeader={addAuthHeader}
              Target = {Target}
              changeOptions = {changeOptions}
              changeMID = {changeMID}
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