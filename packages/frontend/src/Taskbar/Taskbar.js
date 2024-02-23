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

  const topheight = 120;
  const topwidth = window.innerWidth;
  return(
      <div>
        <div
        style = {{
          transform: `translate(${0}px, ${10}px)`,
          position:'absolute',
          background: Colors.fblue,
          opacity: 0.5,
          width: topwidth,
          height: topheight - 20,
          border: 'none',
        }}

        />

        <div
        style = {{
          transform: `translate(${0}px, ${0}px)`,
          position:'absolute',
          opacity: 1,
          width: topwidth,
          height: topheight,
          border: 'none',
          borderBottom: 'solid',
          borderTop: 'solid',
          borderColor: Colors.flightblue,
        }}
        />

        <div style ={{
          position: 'absolute',
          transform: `translate(${topwidth / 2 - 240}px, ${0}px)`
        }}>
          <Triangle mode={"left"} base={topheight} color={"black"}/>
        </div>

        <div style ={{
          position: 'absolute',
          transform: `translate(${topwidth / 2 + 140}px, ${0}px)`
        }}>
          <Triangle mode={"right"} base={topheight} color={"black"}/>
        </div>

        <div
        style = {{
          transform: `translate(${topwidth / 2 - 150}px, ${0}px)`,
          position:'absolute',
          backgroundColor: 'black',
          opacity: 1,
          width: 300,
          height: topheight,
        }}
        >
        <p 
        align = 'center'
        style = {{
          fontSize: 40,
          fontWeight: 'bold',
          color: Colors.flightblue,
        }}>
        Welcome <br/>
        {name}
        </p>
        </div>

        <div>
        <Link to={"/multiview"}>
        <button style = {{
          background: Colors.fdarkblue, 
          position: 'absolute', 
          transform: `translate(${24}vw, ${topheight / 4}px)`,
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
          transform: `translate(${63}vw, ${topheight / 4}px)`,
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
          transform: `translate(${75}vw, ${topheight / 4}px)`,
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
          transform: `translate(${87}vw, ${topheight / 4}px)`,
          width: '10vw',
          height: '6vh',
          fontSize: 20
        }}> 
        To Overview
        </button>
        </Link>
        </div>

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