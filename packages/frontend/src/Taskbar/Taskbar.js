import React, {useState, useEffect} from "react";
import Colors from "../Const/Colors"
import Triangle from "@react-native-toolkit/triangle";
import {Link } from 'react-router-dom';
import Dropdown from './Dropdown';
import {Backend_URL} from "../Const/Urls";

const Taskbar = props => {
  var [name, setName] = useState("");

  const addHeader = props.addHeader;
  const UID = props.UID;

  //Fetches the name of the user to display
  useEffect(() => {
    function fetchUser() {
      const promise = fetch(Backend_URL + `/users/` + UID, {
          headers: addHeader()
      });
      return promise;
    }
    fetchUser()
        .then((res) => res.json())
        .then((json) => setName(json["name"]))
        .catch((error) => {
            console.log(error);
            setName(""); // To indicate API call failed
        });
  }, [UID, addHeader]);

  return(
      <div>
        {/*Top Taskbar Render*/}
        <div
        style = {{
          transform: `translate(${0}vw, ${1}vh)`,
          position:'absolute',
          background: Colors.fblue,
          opacity: 0.5,
          width: '100vw',
          height: '11vh',
          border: 'none',
        }}

        />

        <div
        style = {{
          transform: `translate(${0}vw, ${0}vh)`,
          position:'absolute',
          opacity: 1,
          width: '100vw',
          height: '13vh',
          border: 'none',
          borderBottom: 'solid',
          borderTop: 'solid',
          borderColor: Colors.flightblue,
        }}
        />

        <div style ={{
          position: 'absolute',
          transform: `translate(${37}vw, ${0}vh)`
        }}>
          <Triangle mode={"left"} base={120} color={"black"}/>
        </div>

        <div style ={{
          position: 'absolute',
          transform: `translate(${58}vw, ${0}vh)`
        }}>
          <Triangle mode={"right"} base={120} color={"black"}/>
        </div>

        <div
        style = {{
          transform: `translate(${42}vw, ${0}vh)`,
          position:'absolute',
          backgroundColor: 'black',
          opacity: 1,
          width: '16vw',
          height: '13vh',
        }}
        >
        <p 
        align = 'center'
        style = {{
          fontSize: '2vw',
          fontWeight: 'bold',
          color: Colors.flightblue,
        }}>
        Welcome <br/>
        {name}
        </p>
        </div>

        {/*Buttons To Move To Other Pages*/}
        <div>
        <Link to={"/multiview"}>
        <button style = {{
          background: Colors.fdarkblue, 
          position: 'absolute', 
          transform: `translate(${24}vw, ${3}vh)`,
          width: '10vw',
          height: '6vh',
          fontSize: 20
        }}> 
        To Multi View
        </button>
        </Link>
        </div>

        <div>
        <Link to={"/singleView"}>
        <button style = {{
          background: Colors.fdarkblue, 
          position: 'absolute', 
          transform: `translate(${63}vw, ${3}vh)`,
          width: '10vw',
          height: '6vh',
          fontSize: 20
        }}> 
        To Single View
        </button>
        </Link>
        </div>

        <div>
        <Link to={"/predictor"}>
        <button style = {{
          background: Colors.fdarkblue, 
          position: 'absolute', 
          transform: `translate(${75}vw, ${3}vh)`,
          width: '10vw',
          height: '6vh',
          fontSize: 20
        }}> 
        To Predictor
        </button>
        </Link>
        </div>

        <div>
        <Link to={"/overview"}>
        <button style = {{
          background: Colors.fdarkblue, 
          position: 'absolute', 
          transform: `translate(${87}vw, ${3}vh)`,
          width: '10vw',
          height: '6vh',
          fontSize: 20
        }}> 
        To Overview
        </button>
        </Link>
        </div>

        {/*Dropdown Render*/}
        <div>
        <Dropdown 
          changeTarget = {props.changeTarget}
          addHeader={props.addHeader}
          UID = {props.UID}
          changeOptions = {props.changeOptions}
          changeMID = {props.changeMID}
        />
        </div>
      </div>
  );
}


export default Taskbar;