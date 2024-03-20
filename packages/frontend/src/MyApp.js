import React, {useState} from "react";
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Taskbar from "./Taskbar/Taskbar";
import Login from "./Login/Login.js";
import Signup from "./SignUp/SignUp.js";
import AddMachine from "./AddMachine/AddMachine.js";
import SingleView from "./DataView/SingleView";
import Predictor from "./DataView/Predictor";
import Overview from "./DataView/Overview";
import MultiView from "./DataView/MultiView";

function MyApp() {
  const INVALID_TOKEN = "INVALID_TOKEN";
  const [token, setToken] = useState(INVALID_TOKEN);
  const [UID, setUID] = useState(null);
  const [Target, changeTarget] = useState("0");
  const [options, changeOptions] = useState([]);
  const [MID, changeMID] = useState([]);

  //Gives authentication to API requests
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

  //Responsible for top level rendering of each of the pages depending on the url
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