import React, {useState, useEffect} from "react";
import Colors from "../Const/Colors"
import Triangle from "@react-native-toolkit/triangle";
import { useParams, Link } from 'react-router-dom';
import Dropdown from './Dropdown';

const Taskbar = props => {

  //Convert Date to String For Linking
  function linkString(linkDate){
    const linkYear = linkDate.getFullYear();
    const linkMonth = linkDate.getMonth() + 1;
    const linkDay = linkDate.getDate();
    return linkYear + "-" + linkMonth + "-" + linkDay;
  }  

  let params = useParams();
  var pstDate = params['newdate'] + " PST";
  var [date,setDate] = useState(new Date(pstDate));
  var firstdate = new Date(date.getFullYear(), date.getMonth(), 1);
  var month = firstdate.getMonth();
  var day = firstdate.getDay();
  var year = firstdate.getFullYear();
  var [name, setName] = useState("");

  const addHeader = props.addHeader;
  const UID = props.UID;

  useEffect(() => {
    function fetchUser() {
      const promise = fetch(`http://localhost:5000/users/` + UID, {
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

  //Calendar Position
  const headerx = 350;
  const headery = 25;
  const header_width = 600;
  const header_height = 60;
  const calendarx = 90;
  const calendary = 200;
  const dialx = 1300;
  const dialdx = 300;
  const dialy = 200;
  const dialdy = 250;
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
          transform: 'translate(${0}px, ${0}px)',
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
        align = 'justify'
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
        <Link to={"/week/" + linkString(date)}>
        <button style = {{
          background: Colors.fdarkblue, 
          position: 'absolute', 
          transform: `translate(${63}vw, ${topheight / 4}px)`,
          width: '10vw',
          height: '6vh',
          fontSize: 20
        }}> 
        To Chart
        </button>
        </Link>
        </div>

        <div>
        <Link to={"/month/" + linkString(date)}>
        <button style = {{
          background: Colors.fdarkblue, 
          position: 'absolute', 
          transform: `translate(${75}vw, ${topheight / 4}px)`,
          width: '10vw',
          height: '6vh',
          fontSize: 20
        }}> 
        To Calendar
        </button>
        </Link>
        </div>

        <div>
        <Dropdown 
          changeTarget = {props.changeTarget}
          addHeader={props.addHeader}
          UID = {props.UID}
        />
        </div>
      </div>
  );
}


export default Taskbar;